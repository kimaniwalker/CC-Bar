"use server";

import { retreiveCheckoutSession } from "@/hooks/useStripe";
import { handleAddNewOrder } from "@/utils/Orders/handleAddNewOrder";
import { ORDER_STATUS } from "@/types/Orders";
import type Stripe from "stripe";

export async function handleOrderCheckout(
  stripeSession: Stripe.Checkout.Session,
) {
  const { session, lineItems } = await retreiveCheckoutSession(
    stripeSession.id,
  );

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
  if (orderId === null) {
    console.log("⚠️ Guest checkout - ⏭️ skipping order creation");
    return;
  }
  console.log("✅ Order created successfully:", orderId);
}
