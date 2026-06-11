"use client";

import { Text } from "@/components/ds/Text";
import { Crown, Sparkles, Check, AlertCircle, Pause } from "lucide-react";
import { SubscriptionStatus } from "@/types/Subscriptions";
import { Subscription } from "@/types/User";
import { hasActiveBenefits } from "@/utils/Subscriptions/hasActiveBenefits";

interface VipLoyaltyCardProps {
  subscription: Subscription | null;
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
  subscription,
}: VipLoyaltyCardProps) => {
  // VIP pricing calculations
  const vipSubtotal = cartSubtotal * (1 - VIP_DISCOUNT);
  const discountSavings = cartSubtotal - vipSubtotal;

  // Calculate shipping cost
  const shippingCost = isPickup
    ? 0
    : cartSubtotal < FREE_SHIPPING_THRESHOLD
      ? STANDARD_SHIPPING_COST
      : 0;

  const totalSavings = discountSavings + shippingCost;

  const subscriptionStatus = subscription?.status;
  const isPausedVip = subscriptionStatus === SubscriptionStatus.PAUSED;
  const isCanceledVip = subscriptionStatus === SubscriptionStatus.CANCELED;

  const userHasActiveBenefits = hasActiveBenefits(subscription);

  const handleSubscribe = () => {
    onSubscribe();
  };

  // ========================================
  // ACTIVE VIP MEMBER - Show applied benefits
  // ========================================
  if (userHasActiveBenefits || isVipSubscriptionFlow) {
    const cancelAt = subscription?.cancel_at;
    const isScheduledToCancel = cancelAt && new Date(cancelAt) > new Date();

    return (
      <div className="rounded-2xl bg-linear-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Crown className="h-5 w-5 text-emerald-600" />
          <Text size="md" className="font-semibold text-emerald-900">
            VIP Member Benefits Applied ✨
          </Text>
        </div>

        {/* Show warning banner if scheduled to cancel */}
        {isScheduledToCancel && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-2 mb-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
              <div>
                <Text size="xs" className="text-amber-900 font-medium">
                  Benefits end on {new Date(cancelAt).toLocaleDateString()}
                </Text>
                <Text size="xs" className="text-amber-700">
                  Enjoy VIP pricing until your membership ends.
                </Text>
              </div>
            </div>
          </div>
        )}

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

  // ========================================
  // PAUSED VIP - Show benefits unavailable
  // ========================================
  if (isPausedVip) {
    return (
      <div className="rounded-2xl bg-linear-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Pause className="h-5 w-5 text-amber-600" />
          <Text size="md" className="font-semibold text-amber-900">
            VIP Benefits Currently Paused
          </Text>
        </div>

        <div className="rounded-lg bg-white/60 border border-amber-200 p-3 mb-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
            <div>
              <Text size="xs" className="text-amber-900 font-medium mb-1">
                Your membership is paused for this billing cycle
              </Text>
              <Text size="xs" className="text-amber-700">
                Resume your subscription to unlock VIP pricing and benefits.
              </Text>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex justify-between items-center">
            <Text size="sm" className="text-amber-700">
              Current Price
            </Text>
            <Text size="sm" className="font-semibold text-amber-900">
              ${cartSubtotal.toFixed(2)}
            </Text>
          </div>

          <div className="flex justify-between items-center opacity-50">
            <Text size="sm" className="text-amber-600">
              Potential VIP Discount
            </Text>
            <Text size="sm" className="text-amber-600">
              -${discountSavings.toFixed(2)}
            </Text>
          </div>

          {!isPickup && shippingCost > 0 && (
            <div className="flex justify-between items-center opacity-50">
              <Text size="sm" className="text-amber-600">
                Potential Free Shipping
              </Text>
              <Text size="sm" className="text-amber-600">
                -${shippingCost.toFixed(2)}
              </Text>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 p-2 bg-amber-100/50 rounded-lg">
          <Sparkles className="h-4 w-4 text-amber-600" />
          <Text size="xs" className="text-amber-800 font-medium">
            Missing ${totalSavings.toFixed(2)} in savings on this order
          </Text>
        </div>
      </div>
    );
  }

  // ========================================
  // CANCELED VIP - Cannot reactivate
  // ========================================
  if (isCanceledVip) {
    return (
      <div className="rounded-2xl bg-linear-to-br from-rose-50 to-pink-50 border-2 border-rose-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Crown className="h-5 w-5 text-rose-600" />
          <Text size="md" className="font-semibold text-rose-900">
            VIP Membership Ended
          </Text>
        </div>

        <div className="rounded-lg bg-white/60 border border-rose-200 p-3 mb-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600 mt-0.5" />
            <div>
              <Text size="xs" className="text-rose-900 font-medium mb-1">
                Your VIP membership has been canceled
              </Text>
              <Text size="xs" className="text-rose-700">
                Each customer can only have one VIP membership. We recommend
                using pause instead of canceling to maintain your benefits.
              </Text>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex justify-between items-center">
            <Text size="sm" className="text-rose-700">
              Current Price
            </Text>
            <Text size="sm" className="font-semibold text-rose-900">
              ${cartSubtotal.toFixed(2)}
            </Text>
          </div>

          <div className="flex justify-between items-center opacity-50">
            <Text size="sm" className="text-rose-600 line-through">
              VIP Discount (20%)
            </Text>
            <Text size="sm" className="text-rose-600 line-through">
              -${discountSavings.toFixed(2)}
            </Text>
          </div>

          {!isPickup && shippingCost > 0 && (
            <div className="flex justify-between items-center opacity-50">
              <Text size="sm" className="text-rose-600 line-through">
                Free Shipping
              </Text>
              <Text size="sm" className="text-rose-600 line-through">
                -${shippingCost.toFixed(2)}
              </Text>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 p-2 bg-rose-100/50 rounded-lg">
          <Text size="xs" className="text-rose-800 font-medium">
            You could have saved ${totalSavings.toFixed(2)} as a VIP member
          </Text>
        </div>
      </div>
    );
  }

  // ========================================
  // NON-VIP - Encourage signup
  // ========================================
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
