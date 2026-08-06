import { Text } from "@/components/ds/Text";
import { VipLoyaltyCard } from "../Cart/VipLoyaltyCard";
import { useRouter } from "next/navigation";
import { type User } from "@supabase/supabase-js";
import { Cart, ShippingMethod, ShippingRate } from "@/types/Cart";
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
  const [selectedRate, setSelectedRate] = React.useState<ShippingRate | null>(
    null,
  );
  const router = useRouter();

  const showSubscriptionOffer = isVipSubscriptionFlow || hasActiveSubscription;

  // Estimated weight: 8 oz per item unit
  const totalWeightOunces = Math.max(
    cart.reduce((acc, item) => acc + item.quantity * 8, 0),
    8,
  );

  const displayTotal = (() => {
    const base = handleCalculateCartTotal(
      cart,
      shippingMethod,
      showSubscriptionOffer,
    );

    if (!selectedRate || shippingMethod !== "delivery") return base;

    const selectedRateCost = selectedRate.shipmentCost + selectedRate.otherCost;

    if (showSubscriptionOffer) {
      // VIP: ground is free, anything else adds the full rate cost
      if (selectedRate.serviceCode !== "usps_ground_advantage") {
        return base + selectedRateCost;
      }
      return base; // ground stays free
    }

    if (cartSubtotal < 75) {
      // Non-VIP: swap out the hardcoded $9 for the actual rate
      return base - 9 + selectedRateCost;
    }

    return base;
  })();

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
          weightOunces={totalWeightOunces}
          selectedRate={selectedRate}
          onRateSelect={setSelectedRate}
          isVip={hasActiveSubscription || isVipSubscriptionFlow}
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
            ${displayTotal.toFixed(2)}
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
          selectedRate={selectedRate}
        />
      </div>
    </aside>
  );
};
