import { createClient } from "@/utils/supabase/server";
import { Category } from "@/types/Category";
import { cache } from "react";


export const getCategories = cache(async (): Promise<Category[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .overrideTypes<Category[]>();

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data ?? [];
});