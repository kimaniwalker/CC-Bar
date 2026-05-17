"use server"
import { createClient } from "@/utils/Supabase/server";
import { OrdersResponse } from "@/types/Orders";


export const getOrderDetails = async (id:string): Promise<OrdersResponse[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, user_id, status, total, created_at, shipping_address, shipping_total, subtotal, order_items(id, order_id, product_id, quantity, price)"
    )
    .eq("id", id)
    .order("created_at", { ascending: false })
    .overrideTypes<OrdersResponse[]>()

  if (error) {
    console.error("Error fetching profile:", error);
    return [];
  }

  return data ?? [];
};