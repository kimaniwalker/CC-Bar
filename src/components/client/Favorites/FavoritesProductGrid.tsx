
import { Text } from "@/components/ds/Text";
import { FavoritesProductCard } from "./FavortiesProductCard";
import { FavoritesResponse } from "@/types/Favorites";

type ProductList = {
  products: FavoritesResponse[];
  heading?: string;
};

export default function FavoritesProductGrid({ products, heading }: ProductList) {
 

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>
         {heading && <Text size="lg" className="mb-6">{heading}</Text>}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
         {products?.map((item) => (
            <FavoritesProductCard key={item.id} product={item.products} />
          ))}
        </div>
      </div>
    </div>
  );
}
