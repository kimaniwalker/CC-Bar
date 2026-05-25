"use server";

import { OrderInsert } from "@/types/Orders";
import { createClient } from "../supabase/server";
import { DB_TABLES } from "@/types/Database";

export const handleUpdateOrder = async ({ order }: { order: OrderInsert }) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(DB_TABLES.ORDERS)
    .upsert({ ...order }, { onConflict: "stripe_payment_intent_id" })
    .eq("stripe_payment_intent_id", order.stripe_payment_intent_id)
    .select()
    .single();

  if (error) {
    console.error("Error updating order:", error);
    throw new Error("Failed to update order");
  }

  console.log("✅ Order updated:", data);
  return { order_id: data.id };
};
