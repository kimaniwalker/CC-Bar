"use cache"
import { createClient } from "@/utils/supabase/client";

export async function getProducts(query?: string) {
  const supabase = createClient();

  let queryBuilder = supabase
    .from("products")
    .select("*");

  if (query?.trim()) {
    queryBuilder = queryBuilder.ilike("name", `%${query}%`);
  }

  const { data, error } = await queryBuilder;

  if (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }

  return data;
}