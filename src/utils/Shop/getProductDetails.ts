import { ProductWithOptions } from "@/types/Product";
import { createClient } from "../supabase/server";
import { cache } from "react";

// accept a single id or an array of ids
export const getProductDetails = cache(
  async (ids: string | string[]): Promise<ProductWithOptions[]> => {
    const supabase = await createClient();

    // build query depending on whether ids is an array or single value
    let query = supabase.from("products").select(`
    *,
    product_option_groups (
      *,
      product_options (*)
    )
  `);

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

    return (data ?? []) as ProductWithOptions[];
  },
);
