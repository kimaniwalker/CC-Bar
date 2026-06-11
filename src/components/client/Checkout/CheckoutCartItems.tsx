"use client";

import { Text } from "@/components/ds/Text";
import { useCart } from "../Cart/CartContext";
import CartProduct from "@/components/client/Cart/CartProduct";
import { StockError } from "@/types/Product";

export const CheckoutCartItems = ({
  onHandleClearError,
  errors,
}: {
  onHandleClearError: (sku: string) => void;
  errors: StockError[] | undefined;
}) => {
  const { cart, getTotalCartQuantity } = useCart();
  const cartQuantity = getTotalCartQuantity();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Text size="md" className="font-semibold text-neutral-900">
          Your Items
        </Text>
        <div className="rounded-full bg-neutral-100 px-3 py-1">
          <Text size="sm" className="font-medium text-neutral-700">
            {cartQuantity} {cartQuantity === 1 ? "item" : "items"}
          </Text>
        </div>
      </div>

      <div className="space-y-3">
        {cart.map((product) => (
          <div
            key={`${product.sku}-${product.id}`}
            className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <CartProduct
              product={product}
              errors={errors}
              onHandleUpdateProductQuantity={onHandleClearError}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
