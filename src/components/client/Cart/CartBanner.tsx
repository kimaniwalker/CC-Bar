import { Text } from "@/components/ds/Text";
import { SubscriptionStatus } from "@/types/Subscriptions";
import { Crown, Sparkles } from "lucide-react";

interface CartBannerProps {
  totalVipSavings: number;
  onClickJoinVip?: () => void;
  subscriptionStatus?: string | null;
}

export const CartBanner = ({
  totalVipSavings,
  onClickJoinVip,
  subscriptionStatus,
}: CartBannerProps) => {
  // Active VIP Member Banner
  if (subscriptionStatus === SubscriptionStatus.ACTIVE) {
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
      </div>
    );
  }

  if (subscriptionStatus === SubscriptionStatus.PAUSED) {
    return (
      <div className="rounded-xl border border-purple-200 bg-linear-to-r from-purple-50 to-pink-50 p-3">
        <div className="flex items-center gap-2">
          <Crown className="h-4 w-4 text-purple-600" />

          <Text size="sm" className="font-semibold text-purple-900">
            Your VIP Savings Are Paused
          </Text>
        </div>

        <div className="mt-1 flex items-center justify-between gap-4">
          <div>
            <Text size="xs" className="text-purple-700">
              Resume today and save{" "}
              <span className="font-semibold">
                ${totalVipSavings.toFixed(2)}
              </span>{" "}
              on this order.
            </Text>
          </div>

          <Sparkles className="h-4 w-4 shrink-0 text-purple-600" />
        </div>
      </div>
    );
  }

  // Non-VIP Banner (Clickable or Static)
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

  // Wrap in button if clickable
  if (subscriptionStatus !== SubscriptionStatus.ACTIVE && onClickJoinVip) {
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

  // Return static banner
  return bannerContent;
};
