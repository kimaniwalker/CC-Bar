"use server";
import { createClient } from "@/utils/supabase/client";
import { Order } from "@/types/Orders";
import Stripe from "stripe";

type OrderInsert = Omit<Order, "created_at" | "updated_at" | "items"> & {
  lineItems: Stripe.LineItem[];
};

export const handleAddNewOrder = async ({ order }: { order: OrderInsert }) => {
  const supabase = createClient();

  if (order.user_id === "guest") {
    return { orderId: null };
  }

  // insert the order and return the new id
  const { data: insertedOrder, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: order.user_id,
      stripe_payment_intent_id: order.stripe_payment_intent_id,
      stripe_customer_id: order.stripe_customer_id,
      total: order.total,
      subtotal: order.subtotal,
      shipping_total: order.shipping_total,
      status: order.status,
    })
    .select("id")
    .single();

  if (orderError) {
    // Handle duplicate webhooks gracefully
    if (
      orderError.code === "23505" &&
      orderError.message?.includes("stripe_payment_intent_id")
    ) {
      console.log(
        "⚠️ Duplicate webhook - Order already exists for payment intent:",
        order.stripe_payment_intent_id,
      );
      throw new Error("DUPLICATE_HANDLED");
    }
    console.error("❌ Failed to insert order", orderError.message);
    throw orderError;
  }

  console.log("✅ Order created:", insertedOrder.id);

  const orderId = insertedOrder.id;

  // attach order_id to each order item before inserting
  const itemsToInsert = order.lineItems.map((item) => {
    const product = item.price?.product as Stripe.Product;
    const metadata = product.metadata || {};

    // Extract selected options from metadata
    const selectedOptions: Record<string, string> = {};
    Object.entries(metadata).forEach(([key, value]) => {
      // Skip system fields, only store option selections
      if (!["product_id", "sku", "quantity", "custom_message"].includes(key)) {
        selectedOptions[key] = value;
      }
    });

    return {
      order_id: orderId,
      product_id: metadata.product_id || null,
      sku: metadata.sku || null,
      quantity: item.quantity,
      price: item.price?.unit_amount || 0,
      selected_options:
        Object.keys(selectedOptions).length > 0 ? selectedOptions : null,
      custom_message: metadata.custom_message || null,
    };
  });

  const { error: orderItemsError } = await supabase
    .from("order_items")
    .insert(itemsToInsert);

  if (orderItemsError) {
    console.error("❌ Failed to insert order items", orderItemsError.message);
    throw orderItemsError;
  }

  console.log("✅ Order items created");

  return { orderId };
};
