"use server";
import { CheckoutType } from "@/types/Reservations";
import Stripe from "stripe";
import { handleUpdateOrder } from "../Orders/handleUpdateOrder";
import { ORDER_STATUS, OrderItem } from "@/types/Orders";
import { CartProduct } from "@/types/Product";
import { handleUpdateOrderItems } from "../Orders/handleUpdateOrderItems";

export const createPaymentIntent = async ({
  amount,
  options,
  orderItems = [],
}: {
  amount: number;
  options?: Record<string, string>;
  orderItems?: CartProduct[];
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

    const { order_id } = await handleUpdateOrder({
      order: {
        stripe_payment_intent_id: intent.id,
        total: intent.amount,
        status: ORDER_STATUS.PENDING_PAYMENT,
        user_id: options?.user_id,
        stripe_customer_id: options?.customer_id ?? (intent.customer as string),
        order_source: CheckoutType.IN_STORE,
      },
    });

    const orderItemsToInsert: Omit<OrderItem, "id">[] = orderItems.map(
      (item) => ({
        order_id,
        product_id: item.id,
        sku: item.sku,
        quantity: item.quantity,
        price: Math.round(Number(item.price) * 100),
      }),
    );

    await handleUpdateOrderItems({
      order_items: orderItemsToInsert,
    });

    return intent.client_secret;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw new Error("Failed to create payment intent");
  }
};
