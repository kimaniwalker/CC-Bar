"use cache"
import { createClient } from "@/utils/supabase/client";
import { Product } from "@/types/Product";


export const getProductDetails = async (id:number): Promise<Product[]> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .overrideTypes<Product[]>();

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data ?? [];
};