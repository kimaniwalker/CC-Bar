"use cache"
import { createClient } from "@/utils/Supabase/client";
import { Product } from "@/types/Product";

// accept a single id or an array of ids
export const getProductDetails = async (ids: string | string[]): Promise<Product[]> => {
  const supabase = createClient();

  // build query depending on whether ids is an array or single value
  let query = supabase.from("products").select("*");

  if (Array.isArray(ids)) {
    query = query.in("id", ids);
  } else {
    query = query.eq("id", ids);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return (data ?? []) as Product[];
};