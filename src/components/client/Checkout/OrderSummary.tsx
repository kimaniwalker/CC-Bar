import { Text } from "@/components/ds/Text";
import { VipLoyaltyCard } from "../Cart/VipLoyaltyCard";
import { useRouter } from "next/navigation";
import { type User } from "@supabase/supabase-js";
import { Cart, ShippingMethod } from "@/types/Cart";
import React from "react";
import { StockError } from "@/types/Product";
import { handleCalculateCartTotal } from "@/utils/Checkout/handleCalculateCartTotal";
import { hasActiveBenefits } from "@/utils/Subscriptions/hasActiveBenefits";
import { Subscription } from "@/types/User";
import { CheckoutActionButton } from "./CheckoutActionButton";
import { OrderSummaryDetails } from "./OrderSummaryDetails";

export const OrderSummary = ({
  cartSubtotal,
  user,
  cart,
  setErrors,
  isVipSubscriptionFlow,
  subscription,
}: {
  isVipSubscriptionFlow: boolean;
  user: User | null;
  cartSubtotal: number;
  cart: Cart;
  subscription: Subscription | null;
  setErrors: React.Dispatch<React.SetStateAction<StockError[]>>;
}) => {
  const hasActiveSubscription = subscription
    ? hasActiveBenefits(subscription)
    : false;
  const [shippingMethod, setShippingMethod] =
    React.useState<ShippingMethod>("delivery");
  const router = useRouter();

  const showSubscriptionOffer = isVipSubscriptionFlow || hasActiveSubscription;

  const onSubscribeToVip = () => {
    if (!user) {
      router.push(
        "/auth/login?flow=isVipSubscription&redirect_to=/checkout?flow=isVipSubscription",
      );
    } else {
      router.push("/checkout?flow=isVipSubscription");
    }
  };

  return (
    <aside className="h-fit rounded-3xl border border-neutral-200 bg-white p-6 sticky top-6">
      <Text size="md" className="font-semibold">
        Order Summary
      </Text>

      <div className="mt-6 flex flex-col gap-4">
        {/* Shipping Method Selection */}
        <OrderSummaryDetails
          shippingMethod={shippingMethod}
          setShippingMethod={setShippingMethod}
          isVipSubscriptionFlow={isVipSubscriptionFlow}
          cartSubtotal={cartSubtotal}
        />

        <hr />

        <VipLoyaltyCard
          isVipSubscriptionFlow={isVipSubscriptionFlow}
          cartSubtotal={cartSubtotal}
          onSubscribe={onSubscribeToVip}
          isPickup={shippingMethod === "pickup"}
          subscription={subscription}
        />

        <hr />

        <div className="flex justify-between">
          <Text size="md" className="font-semibold">
            Total
          </Text>
          <Text size="md" className="font-semibold">
            $
            {handleCalculateCartTotal(
              cart,
              shippingMethod,
              showSubscriptionOffer,
            ).toFixed(2)}
          </Text>
        </div>

        <CheckoutActionButton
          isVipSubscriptionFlow={isVipSubscriptionFlow}
          user={user}
          onSetErrors={setErrors}
          cart={cart}
          subscription={subscription}
          shipping_method={shippingMethod}
          cartSubtotal={cartSubtotal}
        />
      </div>
    </aside>
  );
};
