"use server";
import { createClient } from "../supabase/server";

export const addUserFavorite = async ({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}): Promise<void> => {
  if (userId === "guest") {
    console.log("⏭️ Skipping adding favorite for guest user");
    return;
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("favorites")
    .insert({ product_id: productId, user_id: userId });

  if (error) {
    console.error("Error adding favorite:", error);
    throw new Error("Failed to add favorite");
  }
};
