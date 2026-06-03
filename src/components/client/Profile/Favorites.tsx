import { getUser } from "@/utils/User/getUser";
import getUserFavorites from "@/utils/Favorites/getUserFavorites";
import Image from "next/image";
import { AddToCartPillButton } from "../Orders/AddToCartPillButton";
import { ProductHeartButton } from "../Favorites/ProductHeartButton";
import { Text } from "@/components/ds/Text";
import { Heart } from "lucide-react";

export const Favorites = async () => {
  const user = await getUser();
  const favorites = await getUserFavorites(user?.id);
  const hasFavorites = favorites.length > 0;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        {hasFavorites && (
          <div className="w-full">
            <div className="flex justify-between">
              <Text size="xl" className="text-xl font-semibold">
                Favorites
              </Text>

              <button className="text-sm font-medium text-neutral-900 hover:underline">
                <Text as="span" size="sm">
                  View All
                </Text>
              </button>
            </div>
            <Text size="sm" className="mt-1 text-sm text-neutral-500">
              Products you&apos;ve saved for later.
            </Text>
          </div>
        )}
      </div>

      {/* Empty State */}
      {!hasFavorites && (
        <div className="mt-6 flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-neutral-100 p-4">
            <Heart className="h-8 w-8 text-neutral-400" />
          </div>
          <Text size="xl" className="mt-4 text-xl font-semibold">
            No favorites yet
          </Text>
          <Text size="sm" className="mt-1 text-center text-neutral-500">
            Start exploring and save your favorite products
          </Text>
        </div>
      )}

      {/* Favorites List */}
      {hasFavorites && (
        <div className="mt-6 space-y-4">
          {favorites.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-2xl border border-neutral-200 p-4"
            >
              <div className="h-16 w-16 rounded-2xl bg-neutral-100 relative overflow-hidden">
                <Image
                  fill
                  src={item.products.thumbnail}
                  alt={item.products.name}
                  style={{ objectFit: "cover" }}
                  sizes="64px"
                />
                <ProductHeartButton
                  product_id={item.products.id}
                  className="-top-1 -right-1"
                />
              </div>

              <div className="flex-1">
                <Text
                  size="md"
                  className="font-medium text-neutral-900 line-clamp-2 text-ellipsis text-sm"
                >
                  {item.products.name}
                </Text>
                <div className="flex justify-between items-baseline">
                  <Text size="sm" className="mt-1 text-sm text-neutral-500">
                    {item.products.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </Text>
                  <AddToCartPillButton product={item.products} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
