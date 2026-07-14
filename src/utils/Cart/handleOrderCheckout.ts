"use server";

import { handleAddNewOrder } from "@/utils/Orders/handleAddNewOrder";
import { ORDER_STATUS } from "@/types/Orders";
import type Stripe from "stripe";
import { retrieveCheckoutSession } from "./retrieveCheckoutSession";
import { createShipstationOrder } from "../ShipStation/createShipstationOrder";
import { StripeSessionWithShipping } from "@/types/Shiptstation";
import { formatShipStationOrder } from "../ShipStation/formatShipstationOrder";

export async function handleOrderCheckout(
  stripeSession: Stripe.Checkout.Session,
) {
  const session = (await retrieveCheckoutSession(
    stripeSession.id,
  )) as StripeSessionWithShipping;
  const lineItems = session?.line_items?.data as Stripe.LineItem[];

  console.log(session);

  const { orderId } = await handleAddNewOrder({
    order: {
      id: session.id,
      user_id: stripeSession.client_reference_id ?? "guest",
      stripe_payment_intent_id: String(session.payment_intent),
      stripe_customer_id: String(session.customer),
      total: session.amount_total ?? 0,
      subtotal: session.amount_subtotal ?? 0,
      shipping_total: session.total_details?.amount_shipping ?? 0,
      status: ORDER_STATUS.CONFIRMED,
      lineItems,
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

  if (orderId === null) {
    console.log("⚠️ Guest checkout - ⏭️ skipping order creation");
    return;
  }

  console.log("✅ Order created successfully:", orderId);
}
