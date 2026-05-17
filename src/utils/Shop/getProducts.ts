"use cache"
import { createClient } from "@/utils/Supabase/client";
import { cacheTag } from "next/cache";

export async function getProducts(query?: string) {
  cacheTag("products");
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