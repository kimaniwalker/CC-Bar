"use client"

import { Text } from "@/components/ds/Text";
import { useFavorites } from "../Favorites/FavoritesContext";

export const FavoritesCount = ({ count }: { count: number }) => {
    const {productIds} = useFavorites();
    return (
        <div className="rounded-2xl border border-neutral-200 bg-[#F8F5F1] px-5 py-4 text-center">
        <Text size="xl" className="text-2xl font-semibold">{productIds.length ?? count}</Text>
        <Text size="sm" className="mt-1 text-xs text-neutral-500">Favorites</Text>
      </div>
    )
}