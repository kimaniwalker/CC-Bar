"use server";

import Stripe from "stripe";
import { handleUpdateOrder } from "../Orders/handleUpdateOrder";
import { ORDER_STATUS } from "@/types/Orders";

export async function handleInStoreCheckout(
  payment_intent: Stripe.PaymentIntent,
) {
  try {
    await handleUpdateOrder({
      order: {
        stripe_payment_intent_id: payment_intent.id,
        status: ORDER_STATUS.CONFIRMED,
        total: payment_intent.amount,
      },
    });
    console.log(
      "✅ In-store checkout handled for PaymentIntent:",
      payment_intent.id,
    );
  } catch (error) {
    console.error("Error handling in-store checkout:", error);
    throw new Error("Failed to handle in-store checkout");
  }
}
