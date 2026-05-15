"use server"

import { createClient } from "../supabase/server";

export async function removeFavoriteById({product_id, userId}:{product_id: string, userId: string}): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("product_id", product_id)
        .eq("user_id", userId);

    if (error) {
        console.error("Error removing favorite:", error);
        throw new Error("Failed to remove favorite");
    }
 
}