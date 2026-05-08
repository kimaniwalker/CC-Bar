"use client"
import { useState } from "react"
import { StarRating } from "./StarRating"
import { Text } from "@/components/ds/Text"

const PAGE_SIZE = 4;

export const ProductReviewList = ({ reviews }: { reviews: any[] }) => {
    const [visible, setVisible] = useState(PAGE_SIZE);
    const hasMore = visible < reviews.length;

    return (
        <div className="flex flex-col gap-4">
            {reviews.slice(0, visible).map((review, index) => (
                <div key={index} className="border rounded-lg p-4 flex flex-col gap-2">
                    <Text size="md" className="font-semibold">{review.name}</Text>
                    <StarRating rating={review.rating} />
                    <Text size="sm" className="text-gray-500">{review.comment}</Text>
                </div>
            ))}

            {hasMore && (
                <button
                    onClick={() => setVisible(prev => prev + PAGE_SIZE)}
                    className="mt-2 px-4 py-2 border border-black rounded-lg text-sm font-medium hover:bg-black hover:text-white transition"
                >
                    Load More ({reviews.length - visible} remaining)
                </button>
            )}
        </div>
    )
}