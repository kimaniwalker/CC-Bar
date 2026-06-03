"use server";
import { FavoritesResponse } from "@/types/Favorites";
import { createClient } from "../supabase/server";

export default async function getUserFavorites(userId?: string) {
  if (!userId) {
    console.warn("No user ID provided for fetching orders.");
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("favorites")
    .select(
      `
            id,
            user_id,
            product_id,
            created_at,
            products (
                *
            )
        `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .overrideTypes<FavoritesResponse[]>();

  if (error) {
    console.error("Error fetching user favorites details:", error);
    return [];
  }

  return data ?? [];
}
