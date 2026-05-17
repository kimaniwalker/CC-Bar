import { OrderItem } from "@/types/Orders";
import { Product } from "@/types/Product";
import Image from "next/image";
import { AddToCartPillButton } from "./AddToCartPillButton";
import { ProductHeartButton } from "../Favorites/ProductHeartButton";
import { Text } from "@/components/ds/Text";

export const OrderDetailsProducts = ({
  products,
  order_items,
}: {
  products: Product[];
  order_items: OrderItem[];
}) => {
  return (
    <section className="rounded-3xl p-6 shadow-sm bg-white flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <Text size="xl" className={`text-xl font-semibold text-neutral-900`}>
            Purchased Items
          </Text>

          <Text size="sm" className="mt-1 text-sm text-neutral-500">
            Products included in this order.
          </Text>
        </div>
      </div>

      <div className="my-6 space-y-4">
        {products.map((product: Product) => {
          const orderItem = order_items.find(
            (item) => item.product_id === product.id,
          );
          return (
            <div
              key={product.id}
              className="flex gap-4 rounded-2xl border border-neutral-200 p-5"
            >
              <div className="h-24 w-24 shrink-0 rounded-lg overflow-hidden relative">
                <Image
                  src={product.thumbnail}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                <ProductHeartButton
                  product_id={product.id}
                  className="-top-1 -right-1"
                />
              </div>
              <div className="min-w-0 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <Text
                    size="md"
                    className="font-medium text-neutral-900 line-clamp-1 text-ellipsis"
                  >
                    {product.name}
                  </Text>
                  <Text size="sm" className="mt-1 text-sm text-neutral-600">
                    {product.sku}
                  </Text>
                  <AddToCartPillButton product={product} />
                </div>
                <div className="flex justify-between">
                  <Text
                    size="sm"
                    className="text-sm font-medium text-neutral-600"
                  >
                    Quantity: {orderItem?.quantity}
                  </Text>
                  <Text
                    size="md"
                    className="text-sm font-medium text-neutral-600"
                  >
                    ${(orderItem?.price || 0) / 100}
                  </Text>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
