"use client";

import { Text } from "@/components/ds/Text";
import { Crown, Sparkles, Check } from "lucide-react";
import { useUser } from "../Auth/AuthContext";
import { useEffect, useState } from "react";
import { getUserSubscription } from "@/utils/Subscriptions/getUserSubscription";
import { SubscriptionStatus } from "@/types/Subscriptions";
import { Subscription } from "@/types/User";

interface VipLoyaltyCardProps {
  cartSubtotal: number;
  onSubscribe: () => void;
  isVipSubscriptionFlow?: boolean;
  isPickup?: boolean;
}

const VIP_DISCOUNT = 0.2; // 20% off
const FREE_SHIPPING_THRESHOLD = 75;
const STANDARD_SHIPPING_COST = 9;

export const VipLoyaltyCard = ({
  cartSubtotal,
  onSubscribe,
  isVipSubscriptionFlow,
  isPickup = false,
}: VipLoyaltyCardProps) => {
  const { user } = useUser();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const subscriptions = await getUserSubscription(user.id);
        setSubscription(subscriptions?.[0] || null);
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user?.id]);

  // VIP pricing calculations
  const vipSubtotal = cartSubtotal * (1 - VIP_DISCOUNT);
  const discountSavings = cartSubtotal - vipSubtotal;

  // Calculate shipping cost (0 for pickup or VIP members, or if over threshold)
  const shippingCost = isPickup
    ? 0
    : cartSubtotal < FREE_SHIPPING_THRESHOLD
      ? STANDARD_SHIPPING_COST
      : 0;

  const totalSavings = discountSavings + shippingCost;

  if (loading) {
    return null;
  }

  const isActiveVip = subscription?.status === SubscriptionStatus.ACTIVE;
  const handleSubscribe = () => {
    onSubscribe();
  };

  // VIP Member Banner - Show active savings
  if (isActiveVip || isVipSubscriptionFlow) {
    return (
      <div className="rounded-2xl bg-linear-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Crown className="h-5 w-5 text-emerald-600" />
          <Text size="md" className="font-semibold text-emerald-900">
            VIP Member Benefits Applied ✨
          </Text>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-emerald-600 mt-0.5" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <Text size="sm" className="text-emerald-700">
                  20% Member Discount
                </Text>
                <Text size="sm" className="font-semibold text-emerald-900">
                  -${discountSavings.toFixed(2)}
                </Text>
              </div>
            </div>
          </div>

          {!isPickup && shippingCost > 0 && (
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 mt-0.5" />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <Text size="sm" className="text-emerald-700">
                    Free Shipping
                  </Text>
                  <Text size="sm" className="font-semibold text-emerald-900">
                    -${shippingCost.toFixed(2)}
                  </Text>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-emerald-200 pt-2 mt-2">
            <div className="flex justify-between items-center">
              <Text size="md" className="font-bold text-emerald-900">
                Your VIP Price
              </Text>
              <Text size="lg" className="font-bold text-emerald-900">
                ${vipSubtotal.toFixed(2)}
              </Text>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 p-2 bg-white/60 rounded-lg">
          <Sparkles className="h-4 w-4 text-emerald-600" />
          <Text size="xs" className="text-emerald-800 font-medium">
            You&apos;re saving ${totalSavings.toFixed(2)} on this order!
          </Text>
        </div>
      </div>
    );
  }

  // Non-VIP Banner - Show what they're missing
  return (
    <div className="rounded-2xl bg-linear-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Crown className="h-5 w-5 text-purple-600" />
        <Text size="md" className="font-semibold text-purple-900">
          See What You&apos;re Missing
        </Text>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between items-center">
          <Text size="sm" className="text-purple-700">
            Current Price
          </Text>
          <Text
            size="sm"
            className="font-semibold text-purple-900 line-through"
          >
            ${cartSubtotal.toFixed(2)}
          </Text>
        </div>

        <div className="flex justify-between items-center">
          <Text size="sm" className="text-purple-700">
            With 20% VIP Discount
          </Text>
          <Text size="sm" className="font-semibold text-purple-900">
            -${discountSavings.toFixed(2)}
          </Text>
        </div>

        {!isPickup && shippingCost > 0 && (
          <div className="flex justify-between items-center">
            <Text size="sm" className="text-purple-700">
              With Free Shipping
            </Text>
            <Text size="sm" className="font-semibold text-purple-900">
              -${shippingCost.toFixed(2)}
            </Text>
          </div>
        )}

        <div className="border-t border-purple-200 pt-2 flex justify-between items-center">
          <Text size="md" className="font-bold text-purple-900">
            VIP Member Price
          </Text>
          <Text size="lg" className="font-bold text-purple-900">
            ${vipSubtotal.toFixed(2)}
          </Text>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-3 p-2 bg-purple-100/50 rounded-lg">
        <Sparkles className="h-4 w-4 text-purple-600" />
        <Text size="xs" className="text-purple-800 font-medium">
          Save ${totalSavings.toFixed(2)} on this order as a VIP member!
        </Text>
      </div>

      <button
        className="block w-full text-center rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700"
        onClick={handleSubscribe}
      >
        Become a VIP Member - $25/month
      </button>
    </div>
  );
};
