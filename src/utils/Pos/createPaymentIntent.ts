"use server";
import { CheckoutType } from "@/types/Reservations";
import Stripe from "stripe";
import { handleUpdateOrder } from "../Orders/handleUpdateOrder";
import { ORDER_STATUS, OrderItem } from "@/types/Orders";
import { CartProduct } from "@/types/Product";
import { handleUpdateOrderItems } from "../Orders/handleUpdateOrderItems";
import { UserProfile } from "@/types/User";
import { convertProfileToStripeMetadata } from "./convertProfileToStripeMetadata";
import { calculateProductPrice } from "../Cart/normalizeCartProduct";
import { createClient } from "../supabase/server";

export const createPaymentIntent = async ({
  amount,
  options,
  orderItems = [],
  existingOrderId,
}: {
  amount: number;
  options?: UserProfile & {};
  orderItems?: CartProduct[];
  existingOrderId?: string;
}) => {
  // @ts-expect-error - The stripe terminal library expects a config param here which we can ignore.
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    // Build shipping object only if address exists
    const hasShippingAddress =
      options?.shipping_address?.address_1 ||
      options?.shipping_address?.city ||
      options?.shipping_address?.state;

    const intent = await stripe.paymentIntents.create({
      amount,
      customer: options?.customer_id,
      metadata: {
        ...convertProfileToStripeMetadata(options),
        type: existingOrderId
          ? CheckoutType.RESERVATION
          : CheckoutType.IN_STORE,
        ...(existingOrderId && { order_id: existingOrderId }),
      },
      receipt_email: options?.email,
      setup_future_usage: "off_session",
      description: existingOrderId
        ? "Balance payment for reservation"
        : "Payment for CC-BAR",
      currency: "usd",
      payment_method_types: ["card_present"],
      capture_method: "automatic",
      statement_descriptor_suffix: "CANDLE COW BAR",
      ...(hasShippingAddress && {
        shipping: {
          address: {
            line1: options?.shipping_address?.address_1,
            line2: options?.shipping_address?.address_2 || undefined,
            city: options?.shipping_address?.city,
            state: options?.shipping_address?.state,
            postal_code: options?.shipping_address?.zip_code,
          },
          name:
            `${options?.first_name ?? ""} ${options?.last_name ?? ""}`.trim() ||
            "In-Store Customer",
        },
      }),
    });

    let order_id: string;

    if (existingOrderId) {
      // Get existing order to retrieve deposit amount and payment intent
      const supabase = await createClient();
      const { data: existingOrder, error } = await supabase
        .from("orders")
        .select("total, stripe_payment_intent_id")
        .eq("id", existingOrderId)
        .single();

      if (error || !existingOrder) {
        throw new Error("Existing order not found");
      }

      const depositAmount = existingOrder.total; // Original $25 deposit
      const balanceAmount = intent.amount; // New items being charged
      const newTotal = depositAmount + balanceAmount; // Total charges

      // Update existing order - charge the balance and update total
      await handleUpdateOrder({
        order: {
          stripe_payment_intent_id: existingOrder.stripe_payment_intent_id, // Keep original
          status: ORDER_STATUS.PENDING_PAYMENT,
          total: newTotal, // Deposit + balance
        },
      });
      order_id = existingOrderId;
    } else {
      // Create new in-store order
      const result = await handleUpdateOrder({
        order: {
          stripe_payment_intent_id: intent.id,
          total: intent.amount,
          status: ORDER_STATUS.PENDING_PAYMENT,
          ...(options?.id !== "guest" && { user_id: options?.id }),
          stripe_customer_id:
            options?.customer_id ?? (intent.customer as string),
          order_source: CheckoutType.IN_STORE,
        },
      });
      order_id = result.order_id;
    }

    // Add order items with selected options
    const orderItemsToInsert: Omit<OrderItem, "id" | "created_at">[] =
      orderItems.map((item) => {
        // Calculate price with option adjustments
        const itemPrice = calculateProductPrice(item);

        // Convert selected_options to the format needed for database
        const selectedOptions = item.selected_options
          ? Object.fromEntries(
              Object.entries(item.selected_options).map(([key, value]) => [
                key,
                Array.isArray(value.optionName)
                  ? value.optionName.join(", ")
                  : value.optionName,
              ]),
            )
          : undefined;

        return {
          order_id,
          product_id: item.id,
          sku: item.sku,
          quantity: item.quantity,
          price: Math.round(itemPrice * 100),
          selected_options: selectedOptions,
          custom_message: item.custom_message || undefined,
        };
      });

    await handleUpdateOrderItems({
      order_items: orderItemsToInsert,
    });

    return intent.client_secret;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw new Error("Failed to create payment intent");
  }
};
