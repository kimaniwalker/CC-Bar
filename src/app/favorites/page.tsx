import FavoritesProductList from "@/components/client/Favorites/FavoritesProductList";
import { Suspense } from "react";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading favorites...</div>}>
            
            <FavoritesProductList />
            </Suspense>
    )
}