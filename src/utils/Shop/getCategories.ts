"use cache"
import { createClient } from "@/utils/Supabase/client";
import { Category } from "@/types/Category";

export const getCategories = async (): Promise<Category[]> => {
  const supabase = createClient();

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
};