"use client";

import { Text } from "@/components/ds/Text";
import useHandlePayment from "@/hooks/useHandleCheckout";
import { Cart, ShippingRate } from "@/types/Cart";
import { Subscription } from "@/types/User";
import { validateStock } from "@/utils/Product/validateProductStock";
import { handleSubscriptionSignup } from "@/utils/Subscriptions/handleSubscriptionSignup";
import { hasActiveBenefits } from "@/utils/Subscriptions/hasActiveBenefits";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import React from "react";
import { StockError } from "@/types/Product";
import { handleCheckout } from "@/utils/Checkout/handleCheckout";
import { analytics } from "@/utils/Analytics/analytics";
import { Stripe } from "stripe";

export const CheckoutActionButton = ({
  isVipSubscriptionFlow,
  user,
  onSetErrors,
  cart,
  subscription,
  shipping_method,
  cartSubtotal,
  selectedRate,
}: {
  isVipSubscriptionFlow: boolean;
  user: User | null;
  onSetErrors: (erros: StockError[]) => void;
  cart: Cart;
  subscription: Subscription | null;
  shipping_method: "delivery" | "pickup";
  cartSubtotal: number;
  selectedRate?: ShippingRate | null;
}) => {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { formatLineItems } = useHandlePayment();
  const hasActiveSubscription = subscription
    ? hasActiveBenefits(subscription)
    : false;

  const handlePay = async () => {
    setLoading(true);
    analytics.trackElementClicked({
      event: "element_clicked",
      type: "cta",
      name: "Pay Now",
      location: "/checkout",
    });

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
      const isVipShippingUpgrade =
        hasActiveSubscription &&
        shipping_method === "delivery" &&
        !!selectedRate &&
        selectedRate.serviceCode !== "usps_ground_advantage";

      const needsShipping =
        (!hasActiveSubscription &&
          shipping_method === "delivery" &&
          cartSubtotal < 75) ||
        isVipShippingUpgrade;
      const SERVICE_INFO: Record<
        string,
        { name: string; min: number; max: number }
      > = {
        usps_ground_advantage: {
          name: "USPS Ground Advantage",
          min: 2,
          max: 5,
        },
        usps_priority_mail: { name: "USPS Priority Mail", min: 1, max: 3 },
        usps_priority_mail_express: {
          name: "USPS Priority Express",
          min: 1,
          max: 2,
        },
      };

      const shippingOptions:
        | Stripe.Checkout.SessionCreateParams.ShippingOption[]
        | undefined =
        needsShipping && selectedRate
          ? [
              {
                shipping_rate_data: {
                  type: "fixed_amount",
                  fixed_amount: {
                    amount: Math.round(
                      (selectedRate.shipmentCost + selectedRate.otherCost) *
                        100,
                    ),
                    currency: "usd",
                  },
                  display_name:
                    SERVICE_INFO[selectedRate.serviceCode]?.name ??
                    selectedRate.serviceName,
                  ...(SERVICE_INFO[selectedRate.serviceCode] && {
                    delivery_estimate: {
                      minimum: {
                        unit: "business_day",
                        value: SERVICE_INFO[selectedRate.serviceCode].min,
                      },
                      maximum: {
                        unit: "business_day",
                        value: SERVICE_INFO[selectedRate.serviceCode].max,
                      },
                    },
                  }),
                },
              },
            ]
          : undefined;

      const session = await handleCheckout({
        line_items: formatLineItems(cart),
        redirect_url: "/checkout",
        metadata: {
          ...(user?.id && { user_id: user.id }),
          ...(user?.email && { email: user.email }),
          is_vip: hasActiveSubscription ? "true" : "false",
          shippingMethod: shipping_method,
          includes_shipping: needsShipping ? "false" : "true",
        },
        shipping_options: shippingOptions,
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
    analytics.trackElementClicked({
      event: "element_clicked",
      type: "cta",
      name: "Continue without VIP",
      location: "/checkout",
    });
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
