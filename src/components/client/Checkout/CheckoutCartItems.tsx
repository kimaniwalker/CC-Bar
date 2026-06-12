"use client";

import { Text } from "@/components/ds/Text";
import { useCart } from "../Cart/CartContext";
import { StockError } from "@/types/Product";
import CheckoutCartItem from "./CheckoutCartItem";

export const CheckoutCartItems = ({
  onHandleClearError,
  errors,
  hasVipSubscriptionInCart,
}: {
  onHandleClearError: (sku: string) => void;
  errors: StockError[] | undefined;
  hasVipSubscriptionInCart?: boolean;
}) => {
  const { cart, getTotalCartQuantity } = useCart();
  const cartQuantity = getTotalCartQuantity();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between flex-wrap">
        <Text size="md" className="font-semibold text-neutral-900">
          Your Items
        </Text>
        <div className="rounded-full bg-neutral-100 px-3 py-1">
          <Text size="sm" className="font-medium text-neutral-700">
            {cartQuantity} {cartQuantity === 1 ? "item" : "items"}{" "}
            {hasVipSubscriptionInCart && "(includes VIP Subscription)"}
          </Text>
        </div>
      </div>

      <div className="space-y-3">
        {cart.map((product) => (
          <div key={`${product.sku}-${product.id}`}>
            <CheckoutCartItem
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
