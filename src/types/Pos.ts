import { PaymentIntent } from "@stripe/stripe-js";

export type CollectPaymentResult =
  | {
      success: true;
      paymentIntent: PaymentIntent;
    }
  | {
      success: false;
      error: string;
    };

export type PaymentState =
  | "idle"
  | "creating_intent"
  | "awaiting_payment"
  | "processing"
  | "success"
  | "failed";
