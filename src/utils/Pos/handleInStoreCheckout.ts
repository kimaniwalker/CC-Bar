"use server";

import Stripe from "stripe";

export async function handleInStoreCheckout(
  payment_intent: Stripe.PaymentIntent,
) {
  console.log(
    "Handling in-store checkout for PaymentIntent:",
    payment_intent.id,
  );
}
