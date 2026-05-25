"use server";

import { OrderItem } from "@/types/Orders";
import { createClient } from "../supabase/server";
import { DB_TABLES } from "@/types/Database";

export const handleUpdateOrderItems = async ({
  order_items,
}: {
  order_items: Omit<OrderItem, "id">[];
}) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from(DB_TABLES.ORDER_ITEMS)
    .insert(order_items);

  if (error) {
    console.error("Error updating order items:", error);
    throw new Error("Failed to update order items");
  }
  console.log("✅ Order items updated:", order_items);
};
