
import { getProductReviews } from "@/utils/server/getProductReviews"
import { Text } from "../ds/Text"
import { ProductReviewInput } from "../client/Shop/ProductReviewInput"
import { ProductReviewList } from "../client/Shop/ProductReviewList"

export const ProductReviews = async ({ product_id }: { product_id: string }) => {
    const reviews = await getProductReviews(product_id)
    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
            <ProductReviewInput product_id={product_id} />
            <Text size="lg" className="mb-6">Customer Reviews</Text>
            {reviews && reviews.length > 0 ? (
                <ProductReviewList reviews={reviews} />
            ) : (
                <Text size="md" className="text-gray-500">No reviews yet.</Text>
            )}
        </div>
    )
}