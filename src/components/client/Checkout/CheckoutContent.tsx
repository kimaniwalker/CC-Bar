"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import type { StockError } from "@/types/Product";
import { useCart } from "../Cart/CartContext";
import { MockSubscriptionProductCard } from "./MockSubscriptionProductCard";
import { OrderSummary } from "./OrderSummary";
import { User } from "@supabase/supabase-js";
import { Subscription } from "@/types/User";
import { CheckoutHeader } from "./CheckoutHeader";
import { CheckoutErrorBanner } from "./CheckoutErrorBanner";
import { CheckoutCartItems } from "./CheckoutCartItems";
import { EmptyCartState } from "./EmptyCartState";

export default function CheckoutContent({
  user,
  subscription,
}: {
  user: User | null;
  subscription: Subscription | null;
}) {
  const { cart, getCartSubtotal } = useCart();
  const searchParams = useSearchParams();
  const isVipSubscriptionFlow =
    searchParams.get("flow") === "isVipSubscription";
  const [errors, setErrors] = React.useState<StockError[]>([]);

  const cartSubtotal = getCartSubtotal();

  const handleClearError = (sku: string) => {
    setErrors((prev) => prev.filter((e) => e.sku !== sku));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Page Header */}
      <CheckoutHeader />

      {/* Error Banner */}
      <CheckoutErrorBanner errors={errors} onClearError={handleClearError} />

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
          <CheckoutCartItems
            onHandleClearError={handleClearError}
            errors={errors}
          />

          {/* Empty Cart State */}
          <EmptyCartState isVipSubscriptionFlow={isVipSubscriptionFlow} />
        </section>

        {/* Right Column - Order Summary */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <OrderSummary
            isVipSubscriptionFlow={isVipSubscriptionFlow}
            setErrors={setErrors}
            cartSubtotal={cartSubtotal}
            user={user}
            cart={cart}
            subscription={subscription}
          />
        </aside>
      </div>
    </div>
  );
}
