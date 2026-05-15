// ...existing code...
"use client"

import { Heart } from "lucide-react"
import { useState } from "react";
import { useUser } from "../Auth/AuthContext";
import { useFavorites } from "./FavoritesContext";
import { removeFavoriteById } from "@/utils/server/removeFavoriteById";
import { addUserFavorite } from "@/utils/server/addUserFavorite";


export const ProductHeartButton = ({ product_id, className }: { product_id: string, className?: string }) => {
    const { toggleFavoriteById, productIds } = useFavorites()
    const isFavorited = productIds.includes(String(product_id))
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { user } = useUser()

    const toggleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        if (isLoading) return;
        setIsLoading(true);

        // optimistic update in context
        toggleFavoriteById(product_id)

        try {
            if (isFavorited && user?.id) {
                await removeFavoriteById({ product_id: product_id, userId: user.id });
            } else {
                if (user?.id) {
                    await addUserFavorite({ productId: product_id, userId: user.id });
                }
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
            // revert optimistic change on error
            toggleFavoriteById(product_id)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            type="button"
            className={`absolute z-10 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur transition hover:scale-105 ${className ? className: "right-3 top-3 "}`}
            onClick={(e) => toggleFavorite(e)}
            aria-pressed={isFavorited}
            aria-label={isFavorited ? "Remove favorite" : "Add favorite"}
        >
            <Heart className={`h-5 w-5 transition ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
        </button>
    )
}
// ...existing code...