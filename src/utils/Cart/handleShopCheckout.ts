"use server";

import { createClient } from "@/utils/supabase/server";
import { retreiveCheckoutSession } from "@/hooks/useStripe";
import { withRewards } from "@/utils/Rewards/withRewards";
import { RewardActionKey } from "@/types/Rewards";
import type Stripe from "stripe";
import { handleOrderCheckout } from "./handleOrderCheckout";

export async function handleShopCheckout(session: Stripe.Checkout.Session) {
  const supabase = await createClient();
  const { lineItems } = await retreiveCheckoutSession(session.id);

  // Check if this order has already been processed
  const { data: existingOrder } = await supabase
    .from("orders") // or whatever table tracks your orders
    .select("stripe_payment_intent_id")
    .eq("stripe_payment_intent_id", session.payment_intent)
    .single();

  if (existingOrder) {
    console.log(
      "⚠️ Duplicate webhook - Order already processed for session:",
      session.payment_intent,
    );
    return; // Exit gracefully
  }

  // Collect all stock updates
  const stockUpdates = lineItems.reduce(
    (acc, item) => {
      const product = item.price?.product as Stripe.Product;
      const { product_id, sku, isVariationProduct } = product?.metadata || {};

      if (!product_id) {
        console.warn("⚠️ Missing product_id on line item:", item.id);
        return acc;
      }

      acc.push({
        product_id,
        sku,
        quantity: item.quantity ?? 0,
        is_variation: isVariationProduct === "true",
      });

      return acc;
    },
    [] as {
      product_id: string;
      sku: string;
      quantity: number;
      is_variation: boolean;
    }[],
  );

  console.log("📦 Stock updates:", JSON.stringify(stockUpdates, null, 2));

  try {
    await withRewards(
      RewardActionKey.FIRST_ORDER,
      async () => {
        // 1. Create order & order_items (establishes idempotency lock)
        await handleOrderCheckout(session);

        // Sync stock in one RPC call
        const { error } = await supabase.rpc("sync_stock", {
          updates: stockUpdates,
        });

        if (error) {
          console.error("❌ Failed to sync stock:", error.message);
          throw error;
        }

        console.log(`✅ Stock synced for ${stockUpdates.length} items`);
      },
      session.client_reference_id ?? "guest",
    );
  } catch (error) {
    // Stock sync failed - this is critical, re-throw
    console.error("💥 Critical error in shop checkout:", error);
    throw error; // Stripe will retry the webhook
  }
}
