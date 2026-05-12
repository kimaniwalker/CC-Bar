"use server"
import { createClient } from "@/utils/supabase/server"
import { ProductReviewFormInputs } from "@/types/ProductReview";

export const handleAddProductReview = async (data: ProductReviewFormInputs) => {
    const supabase = await createClient()
    const { error } = await supabase.from("product_reviews").insert({ ...data });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}