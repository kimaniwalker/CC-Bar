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
import { ShoppingBag, AlertCircle, X } from "lucide-react";

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
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900">
            <ShoppingBag className="h-6 w-6 text-white" />
          </div>
          <div>
            <Text size="xl" className="font-bold text-neutral-900">
              Checkout
            </Text>
            <Text size="sm" className="text-neutral-600">
              Review your order before completing checkout
            </Text>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {errors.length > 0 && (
        <div className="mb-6 rounded-2xl border-2 border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <Text size="sm" className="font-semibold text-red-900 mb-2">
                Some items are unavailable
              </Text>
              <div className="space-y-2">
                {errors.map((error) => (
                  <div
                    key={error.sku}
                    className="flex items-center justify-between bg-white/60 rounded-lg p-2"
                  >
                    <Text size="sm" className="text-red-800">
                      {error.errorMessage}
                    </Text>
                    <button
                      onClick={() => handleClearError(error.sku)}
                      className="ml-2 text-red-600 hover:text-red-800 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        {/* Left Column - Cart Items */}
        <section className="space-y-4">
          {/* VIP Subscription Card */}
          {isVipSubscriptionFlow && (
            <div>
              <MockSubscriptionProductCard />
            </div>
          )}

          {/* Cart Items Section */}
          {cart.length > 0 && (
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
                      onHandleUpdateProductQuantity={handleClearError}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty Cart State */}
          {cart.length === 0 && !isVipSubscriptionFlow && (
            <div className="rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 p-12 text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
              <Text size="lg" className="font-semibold text-neutral-700 mb-2">
                Your cart is empty
              </Text>
              <Text size="sm" className="text-neutral-600">
                Add some items to get started
              </Text>
            </div>
          )}
        </section>

        {/* Right Column - Order Summary */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <OrderSummary
            isVipSubscriptionFlow={isVipSubscriptionFlow}
            setErrors={setErrors}
            cartSubtotal={cartSubtotal}
            user={user}
            cart={cart}
          />
        </aside>
      </div>
    </div>
  );
}
