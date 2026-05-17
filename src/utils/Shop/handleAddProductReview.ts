"use server"
import { createClient } from "@/utils/Supabase/client"
import { ProductReviewFormInputs } from "@/types/ProductReview";

export const handleAddProductReview = async (data: ProductReviewFormInputs) => {
    const supabase = createClient()
    const { error } = await supabase.from("product_reviews").insert({ ...data });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}