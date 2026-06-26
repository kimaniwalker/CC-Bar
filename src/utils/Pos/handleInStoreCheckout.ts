"use server";

import Stripe from "stripe";
import { handleUpdateOrder } from "../Orders/handleUpdateOrder";
import { ORDER_STATUS } from "@/types/Orders";
import { createClient } from "../supabase/server";

export async function handleInStoreCheckout(
  payment_intent: Stripe.PaymentIntent,
) {
  try {
    const existingOrderId = payment_intent.metadata.order_id;

    // If this is a reservation checkout (existing order)
    if (existingOrderId) {
      const supabase = await createClient();

      const { data: existingOrder, error } = await supabase
        .from("orders")
        .select("stripe_payment_intent_id, total")
        .eq("id", existingOrderId)
        .single();

      if (error || !existingOrder) {
        throw new Error("Existing order not found");
      }

      const depositAmount = existingOrder.total; // Original deposit
      const balanceAmount = payment_intent.amount; // New items charged
      const newTotal = depositAmount + balanceAmount; // Total charges

      // Update existing reservation order
      await handleUpdateOrder({
        order: {
          stripe_payment_intent_id: existingOrder.stripe_payment_intent_id,
          status: ORDER_STATUS.CONFIRMED,
          total: newTotal,
        },
      });

      console.log(
        "✅ Reservation checkout completed for order:",
        existingOrderId,
        "Total:",
        newTotal / 100,
      );
    } else {
      // Regular in-store purchase (new order)
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
    }
  } catch (error) {
    console.error("Error handling in-store checkout:", error);
    throw new Error("Failed to handle in-store checkout");
  }
}
