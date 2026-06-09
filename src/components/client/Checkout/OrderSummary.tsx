import { Text } from "@/components/ds/Text";
import { VipLoyaltyCard } from "../Cart/VipLoyaltyCard";
import { useRouter } from "next/navigation";
import { type User } from "@supabase/supabase-js";
import { Cart } from "@/types/Cart";
import React, { useEffect } from "react";
import { validateStock } from "@/utils/Product/validateProductStock";
import { StockError } from "@/types/Product";
import { Store, Truck } from "lucide-react";
import useHandlePayment from "@/hooks/useHandleCheckout";
import { handleSubscriptionSignup } from "@/utils/Subscriptions/handleSubscriptionSignup";
import { getUserSubscription } from "@/utils/Subscriptions/getUserSubscription";
import { SubscriptionStatus } from "@/types/Subscriptions";
import { handleCheckout } from "@/utils/Checkout/handleCheckout";
import { handleCalculateCartTotal } from "@/utils/Checkout/handleCalculateCartTotal";

type ShippingMethod = "delivery" | "pickup";

export const OrderSummary = ({
  cartSubtotal,
  user,
  cart,
  setErrors,
  isVipSubscriptionFlow,
}: {
  isVipSubscriptionFlow: boolean;
  user: User | null;
  cartSubtotal: number;
  cart: Cart;
  setErrors: React.Dispatch<React.SetStateAction<StockError[]>>;
}) => {
  const [loading, setLoading] = React.useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] =
    React.useState(false);
  const [shippingMethod, setShippingMethod] =
    React.useState<ShippingMethod>("delivery");
  const router = useRouter();
  const { formatLineItems } = useHandlePayment();
  const showSubscriptionOffer = isVipSubscriptionFlow || hasActiveSubscription;

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (user?.id) {
        const subscriptions = await getUserSubscription(user.id);
        const hasActiveSubscription =
          subscriptions?.[0]?.status === SubscriptionStatus.ACTIVE;
        setHasActiveSubscription(hasActiveSubscription);
      }
    };

    fetchSubscriptionStatus();
  }, [user]);

  const onSubscribeToVip = () => {
    if (!user) {
      router.push(
        "/auth/login?flow=isVipSubscription&redirect_to=/checkout?flow=isVipSubscription",
      );
    } else {
      router.push("/checkout?flow=isVipSubscription");
    }
  };

  const handlePay = async () => {
    setLoading(true);

    try {
      const { valid, errors } = await validateStock(cart);

      if (!valid) {
        setErrors(errors);
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
            shippingMethod,
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
          shippingMethod,
          includes_shipping:
            hasActiveSubscription ||
            shippingMethod === "pickup" ||
            (shippingMethod === "delivery" && cartSubtotal >= 75)
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

  return (
    <aside className="h-fit rounded-3xl border border-neutral-200 bg-white p-6 sticky top-6">
      <Text size="md" className="font-semibold">
        Order Summary
      </Text>

      <div className="mt-6 flex flex-col gap-4">
        {/* Shipping Method Selection */}
        <div className="space-y-2">
          <Text size="sm" className="font-medium text-neutral-700">
            Fulfillment Method
          </Text>

          <div className="grid grid-cols-2 gap-2">
            {/* Delivery Option */}
            <button
              type="button"
              onClick={() => setShippingMethod("delivery")}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition ${
                shippingMethod === "delivery"
                  ? "border-purple-600 bg-purple-50"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              }`}
            >
              <Truck
                className={`h-5 w-5 ${
                  shippingMethod === "delivery"
                    ? "text-purple-600"
                    : "text-neutral-600"
                }`}
              />
              <div className="text-center">
                <Text
                  size="xs"
                  className={`font-medium ${
                    shippingMethod === "delivery"
                      ? "text-purple-900"
                      : "text-neutral-900"
                  }`}
                >
                  Delivery
                </Text>
                <Text
                  size="xs"
                  className={
                    shippingMethod === "delivery"
                      ? "text-purple-700"
                      : "text-neutral-600"
                  }
                >
                  {cartSubtotal < 75 ? "$9.00" : "Free"}
                </Text>
              </div>
            </button>

            {/* Pickup Option */}
            <button
              type="button"
              onClick={() => setShippingMethod("pickup")}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition ${
                shippingMethod === "pickup"
                  ? "border-purple-600 bg-purple-50"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              }`}
            >
              <Store
                className={`h-5 w-5 ${
                  shippingMethod === "pickup"
                    ? "text-purple-600"
                    : "text-neutral-600"
                }`}
              />
              <div className="text-center">
                <Text
                  size="xs"
                  className={`font-medium ${
                    shippingMethod === "pickup"
                      ? "text-purple-900"
                      : "text-neutral-900"
                  }`}
                >
                  Pickup
                </Text>
                <Text
                  size="xs"
                  className={
                    shippingMethod === "pickup"
                      ? "text-purple-700"
                      : "text-neutral-600"
                  }
                >
                  Free
                </Text>
              </div>
            </button>
          </div>

          {/* Pickup Location Info */}
          {shippingMethod === "pickup" && (
            <div className="rounded-lg bg-purple-50 p-3 border border-purple-100">
              <Text size="xs" className="text-purple-900 font-medium mb-1">
                Pickup Location
              </Text>
              <Text size="xs" className="text-purple-700">
                4052 Helena Rd, Helena, AL 35080
              </Text>
              <Text size="xs" className="text-purple-600 mt-1">
                We&apos;ll email you when your order is ready (typically 3-5
                business days)
              </Text>
            </div>
          )}
        </div>

        <hr />

        {/* Pricing Breakdown */}
        <div className="flex justify-between">
          <Text size="sm">Subtotal</Text>
          <Text size="sm">${cartSubtotal.toFixed(2)}</Text>
        </div>

        <div className="flex justify-between">
          <Text size="sm">
            {shippingMethod === "delivery" ? "Shipping" : "Pickup"}
          </Text>
          <Text
            size="sm"
            className={
              shippingMethod === "pickup" ? "text-green-600 font-medium" : ""
            }
          >
            {shippingMethod === "delivery" && cartSubtotal < 75
              ? "$9.00"
              : "Free"}
          </Text>
        </div>

        <hr />

        <VipLoyaltyCard
          isVipSubscriptionFlow={isVipSubscriptionFlow}
          cartSubtotal={cartSubtotal}
          onSubscribe={onSubscribeToVip}
          isPickup={shippingMethod === "pickup"}
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

        <button
          disabled={loading || cart.length === 0}
          onClick={handlePay}
          className="h-14 rounded-2xl bg-black text-white font-medium transition hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Complete Checkout"}
        </button>

        <Text size="sm" className="text-center text-neutral-500">
          Secure checkout powered by Stripe.
        </Text>
      </div>
    </aside>
  );
};
