"use server"
import { createClient } from "../Supabase/server";

export const addUserFavorite = async ({ productId, userId }: { productId: string; userId: string }): Promise<void> => {
    const supabase = await createClient();
    const { error } = await supabase
        .from("favorites")
        .insert({ product_id: productId, user_id: userId });

    if (error) {
        console.error("Error adding favorite:", error);
        throw new Error("Failed to add favorite");
    }

}