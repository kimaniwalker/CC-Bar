"use server";

import { handleUpdateSubscription } from "./handleUpdateSubscription";
import { updateUserProfile } from "../User/updateUserProfile";
import { SubscriptionStatus } from "@/types/Subscriptions";
import { calculateNextRenewalDate } from "./calculateNextRenewalDate";
import { createClient } from "../supabase/server";
import { handleAddNewOrder } from "../Orders/handleAddNewOrder";
import { ORDER_STATUS } from "@/types/Orders";
import Stripe from "stripe";
import { withRewards } from "../Rewards/withRewards";
import { RewardActionKey } from "@/types/Rewards";
import { retrieveCheckoutSession } from "../Cart/retrieveCheckoutSession";
import { formatShipStationOrder } from "../ShipStation/formatShipstationOrder";
import { createShipstationOrder } from "../ShipStation/createShipstationOrder";

// Extend the Stripe Session type to include invoice
interface SubscriptionSession extends Stripe.Checkout.Session {
  invoice?: string;
}

export const handleShopSubscription = async (sessionId: string) => {
  const rawSession = await retrieveCheckoutSession(sessionId);
  const session = rawSession as SubscriptionSession;
  const supabase = await createClient();

  // Check for duplicate processing
  const { data: existingOrder } = await supabase
    .from("orders")
    .select("stripe_payment_intent_id")
    .eq("stripe_payment_intent_id", session.invoice) // For subscriptions, use the invoice ID as the unique identifier
    .single();

  if (existingOrder) {
    console.log(
      "⚠️ Duplicate webhook - Order already processed:",
      session.invoice,
    );
    return;
  }

  // Collect all stock updates

  const stockUpdates = session?.line_items?.data.reduce(
    (acc, item) => {
      const product = item.price?.product as Stripe.Product;
      const { product_id, sku } = product?.metadata || {};
      const SUBSCRIPTION_SKU = "SKU-CCBAR-SUB";

      // Skip subscription items
      if (sku === SUBSCRIPTION_SKU) {
        console.log("⏭️ Skipping subscription item from stock sync:", sku);
        return acc;
      }

      if (!product_id) {
        console.warn("⚠️ Missing product_id on line item:", item.id);
        return acc;
      }

      acc.push({
        product_id,
        sku,
        quantity: item.quantity ?? 0,
      });

      return acc;
    },
    [] as {
      product_id: string;
      sku: string;
      quantity: number;
    }[],
  );

  console.log("📦 Stock updates:", JSON.stringify(stockUpdates, null, 2));

  try {
    await withRewards(
      RewardActionKey.FIRST_ORDER,
      async () => {
        // Sync user profile with Stripe customer ID
        await updateUserProfile({
          user: {
            customer_id: session.customer as string,
            id: session.client_reference_id ?? "guest",
          },
        });

        // Sync stock in one RPC call
        const { error } = await supabase.rpc("sync_stock", {
          updates: stockUpdates,
        });

        if (error) {
          console.error("❌ Failed to sync stock:", error.message);
          throw error;
        }

        console.log(`✅ Stock synced for ${stockUpdates?.length} items`);
        // Create order record
        console.log("✅ Creating new subscription order:", session.invoice);

        const { orderId } = await handleAddNewOrder({
          order: {
            id: sessionId,
            user_id: session.client_reference_id ?? "guest",
            stripe_payment_intent_id: session.invoice ?? "",
            stripe_customer_id: session.customer as string,
            total: session.amount_total ?? 0,
            subtotal: session.amount_subtotal ?? 0,
            shipping_total: session.total_details?.amount_shipping ?? 0,
            status: ORDER_STATUS.CONFIRMED,
            lineItems: session?.line_items?.data || [],
          },
        });

        if (session?.metadata?.shippingMethod === "delivery") {
          console.log("🚚 Delivery order - ShipStation creation");
          const shipstationOrder = formatShipStationOrder(session, orderId);
          console.log(
            "📦 ShipStation Order:",
            JSON.stringify(shipstationOrder, null, 2),
          );
          await createShipstationOrder(shipstationOrder);
        }

        await handleUpdateSubscription({
          user_id: session.client_reference_id ?? "guest",
          status: SubscriptionStatus.ACTIVE,
          subscription_id: session.subscription as string,
          next_renewal: calculateNextRenewalDate(),
          updated_at: new Date().toISOString(),
        });
      },
      session.client_reference_id ?? "guest",
    );
  } catch (error) {
    console.error("💥 Critical error in shop checkout:", error);
    throw error; // Stripe will retry the webhook
  }
};
