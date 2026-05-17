import { getUser } from "@/utils/User/getUser";
import getUserFavorites from "@/utils/Favorites/getUserFavorites";
import { Suspense } from "react";
import FavoritesProductGrid from "./FavoritesProductGrid";

export default async function FavoritesProductList() {
    const user = await getUser();
    const favorites = await getUserFavorites(user?.id)



    return (
        <Suspense fallback={<div>Loading favorites...</div>}>
            <FavoritesProductGrid products={favorites} heading="Your Favorites" />
        </Suspense>
    )
}
