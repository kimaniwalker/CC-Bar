"use cache"
import { createClient } from "@/utils/supabase/client";
import { ProductReview } from "@/types/ProductReview";


export const getProductReviews = async (product_id:number): Promise<ProductReview[]> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("product_reviews")
    .select("*")
    .eq("product_id", product_id)
    .overrideTypes<ProductReview[]>();

  if (error) {
    console.error("Error fetching product reviews", error);
    return [];
  }

  return data ?? [];
};