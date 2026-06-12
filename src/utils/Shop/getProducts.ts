"use cache";
import { createClient } from "@/utils/supabase/client";
import { cacheTag } from "next/cache";

type SortOption =
  | "price_asc"
  | "price_desc"
  | "newest"
  | "bestselling"
  | "name_asc"
  | "name_desc";

export async function getProducts(query?: string, sort?: string) {
  cacheTag("products");
  const supabase = createClient();

  let queryBuilder = supabase.from("products").select("*");

  // Apply search filter
  if (query?.trim()) {
    queryBuilder = queryBuilder.ilike("name", `%${query}%`);
  }

  // Apply sorting
  if (sort) {
    switch (sort as SortOption) {
      case "price_asc":
        queryBuilder = queryBuilder.order("price", { ascending: true });
        break;
      case "price_desc":
        queryBuilder = queryBuilder.order("price", { ascending: false });
        break;
      case "newest":
        queryBuilder = queryBuilder.order("created_at", { ascending: false });
        break;
      case "bestselling":
        // Assuming you have a sales_count or similar column
        queryBuilder = queryBuilder.order("sales_count", { ascending: false });
        break;
      case "name_asc":
        queryBuilder = queryBuilder.order("name", { ascending: true });
        break;
      case "name_desc":
        queryBuilder = queryBuilder.order("name", { ascending: false });
        break;
      default:
        // Default sort by created_at descending
        queryBuilder = queryBuilder.order("created_at", { ascending: false });
    }
  } else {
    // Default sort when no sort param
    queryBuilder = queryBuilder.order("created_at", { ascending: false });
  }

  const { data, error } = await queryBuilder;

  if (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }

  return data;
}
