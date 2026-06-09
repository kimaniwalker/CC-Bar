"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Text } from "@/components/ds/Text";
import { useUser } from "@/components/client/Auth/AuthContext";
import type { StockError } from "@/types/Product";
import { useCart } from "../Cart/CartContext";
import CartProduct from "@/components/client/Cart/CartProduct";
import { MockSubscriptionProductCard } from "./MockSubscriptionProductCard";
import { OrderSummary } from "./OrderSummary";

export default function CheckoutContent() {
  const { cart, getTotalCartQuantity, getCartSubtotal } = useCart();
  const searchParams = useSearchParams();
  const isVipSubscriptionFlow =
    searchParams.get("flow") === "isVipSubscription";
  const [errors, setErrors] = React.useState<StockError[]>([]);

  const { user } = useUser();
  const cartQuantity = getTotalCartQuantity();
  const cartSubtotal = getCartSubtotal();

  const handleClearError = (sku: string) => {
    setErrors((prev) => prev.filter((e) => e.sku !== sku));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
      <section>
        <div className="mb-6">
          <Text size="md">Checkout</Text>

          <Text size="sm">Review your order before completing checkout.</Text>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white">
          <div className="border-b p-6">
            <Text size="sm">
              {cartQuantity} item
              {cartQuantity !== 1 ? "s" : ""}
            </Text>
          </div>

          <div className="flex flex-col">
            {isVipSubscriptionFlow && <MockSubscriptionProductCard />}
            {cart.map((product) => (
              <CartProduct
                key={`${product.sku}-${product.id}`}
                product={product}
              />
            ))}
          </div>
        </div>

        {errors.length > 0 && (
          <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-4">
            <Text size="sm">Some items are unavailable.</Text>

            <div className="mt-3 flex flex-col gap-2">
              {errors.map((error) => (
                <div
                  key={error.sku}
                  className="flex items-center justify-between"
                >
                  <Text size="sm">{error.errorMessage}</Text>

                  <button
                    onClick={() => handleClearError(error.sku)}
                    className="text-sm underline"
                  >
                    Dismiss
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <OrderSummary
        isVipSubscriptionFlow={isVipSubscriptionFlow}
        setErrors={setErrors}
        cartSubtotal={cartSubtotal}
        user={user}
        cart={cart}
      />
    </div>
  );
}
