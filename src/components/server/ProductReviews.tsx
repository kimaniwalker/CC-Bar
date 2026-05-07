
import { getProductReviews } from "@/utils/server/getProductReviews"
import { Text } from "../ds/Text"
import { StarRating } from "../client/Shop/StarRating"
import { ProductReviewInput } from "../client/Shop/ProductReviewInput"

export const ProductReviews = async({product_id}:{product_id: number}) => {
    const reviews = await getProductReviews(product_id)
    return  <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
                 <ProductReviewInput product_id={product_id} />
                 <Text size="lg" className="mb-6">Customer Reviews</Text>
                 {reviews && reviews.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {reviews.map((review, index) => (
                            <div key={index} className="border rounded-lg p-4 flex flex-col gap-2">
                                <Text size="md" className="font-semibold">{review.name}</Text>
                                <StarRating rating={review.rating} />
                                <Text size="sm" className="text-gray-500">{review.comment}</Text>
                            </div>
                        ))}
                    </div>
                 ) : (
                    <Text size="md" className="text-gray-500">No reviews yet.</Text>
                 )}
    
            </div>
}