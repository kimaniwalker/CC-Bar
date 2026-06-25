"use client";

import { Text } from "@/components/ds/Text";
import useHandlePayment from "@/hooks/useHandleCheckout";
import { Cart } from "@/types/Cart";
import { Subscription } from "@/types/User";
import { validateStock } from "@/utils/Product/validateProductStock";
import { handleSubscriptionSignup } from "@/utils/Subscriptions/handleSubscriptionSignup";
import { hasActiveBenefits } from "@/utils/Subscriptions/hasActiveBenefits";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import React from "react";
import { StockError } from "@/types/Product";
import { handleCheckout } from "@/utils/Checkout/handleCheckout";

export const CheckoutActionButton = ({
  isVipSubscriptionFlow,
  user,
  onSetErrors,
  cart,
  subscription,
  shipping_method,
  cartSubtotal,
}: {
  isVipSubscriptionFlow: boolean;
  user: User | null;
  onSetErrors: (erros: StockError[]) => void;
  cart: Cart;
  subscription: Subscription | null;
  shipping_method: "delivery" | "pickup";
  cartSubtotal: number;
}) => {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { formatLineItems } = useHandlePayment();
  const hasActiveSubscription = subscription
    ? hasActiveBenefits(subscription)
    : false;

  const handlePay = async () => {
    setLoading(true);

    if (isVipSubscriptionFlow && !user?.id) {
      router.push(
        "/auth/login?flow=isVipSubscription&redirect_to=/checkout?flow=isVipSubscription",
      );
      setLoading(false);
      return;
    }

    try {
      const { valid, errors } = await validateStock(cart);

      if (!valid) {
        onSetErrors(errors);
        setLoading(false);
        return;
      }

      console.log("Stock validation passed, proceeding to checkout...");

      // VIP Subscription Flow (user signing up for VIP + shop items)
      if (isVipSubscriptionFlow && !hasActiveSubscription) {
        const url = await handleSubscriptionSignup({
          redirect_url: "/checkout?flow=isVipSubscription",
          line_items: cart.length > 0 ? formatLineItems(cart) : undefined,
          metadata: {
            ...(user?.id && { user_id: user.id }),
            ...(user?.email && { email: user.email }),
            shippingMethod: shipping_method,
            is_vip_subscription_flow: "true",
            includes_shipping: "true",
          },
        });

        if (url) {
          router.push(url);
        }
        return;
      }

      // Regular Shop Checkout (existing VIP member or non-VIP user)
      const session = await handleCheckout({
        line_items: formatLineItems(cart),
        redirect_url: "/checkout",
        metadata: {
          ...(user?.id && { user_id: user.id }),
          ...(user?.email && { email: user.email }),
          is_vip: hasActiveSubscription ? "true" : "false",
          shippingMethod: shipping_method,
          includes_shipping:
            hasActiveSubscription ||
            shipping_method === "pickup" ||
            (shipping_method === "delivery" && cartSubtotal >= 75)
              ? "true"
              : "false", // Free shipping for VIPs and orders over $75 & pickup orders
        },
      });

      if (session) {
        router.push(session);
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptOut = () => {
    router.push("/checkout");
  };

  return (
    <div className="space-y-3">
      <button
        disabled={loading || (cart.length === 0 && !isVipSubscriptionFlow)}
        onClick={handlePay}
        className="w-full h-14 rounded-2xl bg-black text-white font-medium transition hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {isVipSubscriptionFlow && !hasActiveSubscription && (
        <button
          onClick={handleOptOut}
          disabled={loading}
          className="w-full h-12 rounded-2xl bg-white border-2 border-neutral-200 text-neutral-700 font-medium transition hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue without VIP
        </button>
      )}

      <Text size="sm" className="text-center text-neutral-500">
        Secure checkout powered by Stripe.
      </Text>
    </div>
  );
};
