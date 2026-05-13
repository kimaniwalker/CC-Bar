import { Order } from "@/types/Orders";
import { createClient } from "../supabase/server";

export default async function getUserOrders(userId?: string) {

    if (!userId) {
        console.warn("No user ID provided for fetching orders.");
        return [];
    }

    const supabase = await createClient();
    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .overrideTypes<Order[]>()

    if (error) {
        console.error("Error fetching user orders:", error);
        return [];
    }

    return data ?? [];
}