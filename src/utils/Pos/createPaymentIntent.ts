"use server";
import { CheckoutType } from "@/types/Reservations";
import Stripe from "stripe";

export const createPaymentIntent = async ({
  amount,
  options,
}: {
  amount: number;
  options?: Record<string, string>;
}) => {
  // @ts-expect-error - The stripe terminal library expects a config param here which we can ignore.
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    // For Terminal payments, the 'payment_method_types' parameter must include
    // 'card_present'.
    // To automatically capture funds when a charge is authorized,
    // set `capture_method` to `automatic`.
    const intent = await stripe.paymentIntents.create({
      amount,
      customer: options?.customer_id,
      metadata: { ...options, type: CheckoutType.IN_STORE },
      receipt_email: options?.email,
      setup_future_usage: "off_session",
      description: "Payment for CC-BAR",
      currency: "usd",
      payment_method_types: ["card_present"],
      capture_method: "automatic",
      statement_descriptor_suffix: "CANDLE COW BAR",
    });
    console.log({ intent });
    return intent.client_secret;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw new Error("Failed to create payment intent");
  }
};
