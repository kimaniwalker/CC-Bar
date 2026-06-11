import { Text } from "@/components/ds/Text";
import { SubscriptionStatus } from "@/types/Subscriptions";
import { Subscription } from "@/types/User";
import { Crown, Sparkles, AlertCircle } from "lucide-react";
import { hasActiveBenefits } from "@/utils/Subscriptions/hasActiveBenefits";

interface CartBannerProps {
  totalVipSavings: number;
  onClickJoinVip?: () => void;
  subscription?: Subscription | null;
}

export const CartBanner = ({
  totalVipSavings,
  onClickJoinVip,
  subscription,
}: CartBannerProps) => {
  const subscriptionStatus = subscription?.status;
  const userHasActiveBenefits = hasActiveBenefits(subscription ?? null);
  const isScheduledToCancel =
    subscription?.cancel_at && new Date(subscription.cancel_at) > new Date();

  // Active VIP Member Banner (includes scheduled cancellation)
  if (userHasActiveBenefits) {
    return (
      <div className="rounded-xl bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-3">
        <div className="flex items-center gap-2">
          <Crown className="h-4 w-4 text-emerald-600" />
          <div className="flex-1">
            <Text size="sm" className="font-semibold text-emerald-900">
              VIP Savings Applied
            </Text>
            <Text size="xs" className="text-emerald-700">
              You&apos;re saving ${totalVipSavings.toFixed(2)} ✨
            </Text>
          </div>
        </div>

        {/* Show warning if scheduled to cancel */}
        {isScheduledToCancel && (
          <div className="mt-2 pt-2 border-t border-emerald-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-3 w-3 text-amber-600 mt-0.5" />
              <Text size="xs" className="text-amber-700">
                Benefits end{" "}
                {new Date(subscription.cancel_at ?? "").toLocaleDateString()}
              </Text>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Paused Subscription Banner
  if (subscriptionStatus === SubscriptionStatus.PAUSED) {
    return (
      <div className="rounded-xl border border-amber-200 bg-linear-to-r from-amber-50 to-orange-50 p-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <Text size="sm" className="font-semibold text-amber-900">
            Your VIP Benefits Are Paused
          </Text>
        </div>

        <div className="mt-1">
          <Text size="xs" className="text-amber-700">
            Resume your subscription to unlock{" "}
            <span className="font-semibold">${totalVipSavings.toFixed(2)}</span>{" "}
            in savings on this order.
          </Text>
        </div>
      </div>
    );
  }

  // Canceled Subscription Banner
  if (subscriptionStatus === SubscriptionStatus.CANCELED) {
    const bannerContent = (
      <div className="rounded-xl border border-rose-200 bg-linear-to-r from-rose-50 to-pink-50 p-3">
        <div className="flex items-center gap-2">
          <Crown className="h-4 w-4 text-rose-600" />
          <Text size="sm" className="font-semibold text-rose-900">
            VIP Membership Ended
          </Text>
        </div>

        <div className="mt-1 flex items-center justify-between gap-4">
          <div>
            <Text size="xs" className="text-rose-700">
              Each customer gets one VIP membership. You could have saved{" "}
              <span className="font-semibold">
                ${totalVipSavings.toFixed(2)}
              </span>{" "}
              on this order.
            </Text>
          </div>
          <Sparkles className="h-4 w-4 shrink-0 text-rose-600" />
        </div>
      </div>
    );

    return bannerContent;
  }

  // Non-VIP Banner (Default)
  const bannerContent = (
    <div className="rounded-xl border border-purple-200 bg-linear-to-r from-purple-50 to-pink-50 p-3">
      <div className="flex items-center gap-2">
        <Crown className="h-4 w-4 text-purple-600" />
        <Text size="sm" className="font-semibold text-purple-900">
          Unlock VIP Savings
        </Text>
      </div>

      <div className="mt-1 flex items-center justify-between gap-4">
        <div>
          <Text size="xs" className="text-purple-700">
            Join today and save{" "}
            <span className="font-semibold">${totalVipSavings.toFixed(2)}</span>{" "}
            on this order.
          </Text>
        </div>

        <Sparkles className="h-4 w-4 shrink-0 text-purple-600" />
      </div>
    </div>
  );

  // Wrap in button if no active subscription
  if (!subscriptionStatus && onClickJoinVip) {
    return (
      <button
        type="button"
        className="w-full transition hover:opacity-90"
        onClick={onClickJoinVip}
      >
        {bannerContent}
      </button>
    );
  }

  return bannerContent;
};
