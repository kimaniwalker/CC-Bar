"use server"
import { OrdersResponse } from "@/types/Orders";
import { createClient } from "../Supabase/server";

export default async function getUserOrders(userId?: string) {

    if (!userId) {
        console.warn("No user ID provided for fetching orders.");
        return [];
    }

    const supabase = await createClient();
    const { data, error } = await supabase
    .from("orders")
    .select(
      "id, user_id, status, total, created_at, order_items(id, order_id, product_id, quantity, price)"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .overrideTypes<OrdersResponse[]>()
    
    console.log({data})

    if (error) {
        console.error("Error fetching user orders:", error);
        return [];
    }

    return data ?? [];
}