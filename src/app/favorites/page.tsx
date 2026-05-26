import FavoritesProductList from "@/components/client/Favorites/FavoritesProductList";
import ProductGridSkeleton from "@/components/client/Shop/ProductGridSkeleton";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <FavoritesProductList />
    </Suspense>
  );
}
