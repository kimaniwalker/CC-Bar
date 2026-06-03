import { Text } from "@/components/ds/Text";
import { useUserProfile } from "@/hooks/useUserProfile";
import { SubscriptionStatus } from "@/types/Subscriptions";
import { Subscription } from "@/types/User";
import { handleManageSubscription } from "@/utils/Subscriptions/handleManageSubscription";
import { User } from "@supabase/supabase-js";
import { Calendar, CreditCard, DollarSign, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const SubscriptionDetails = ({
  subscription,
  user,
}: {
  subscription: Subscription | null;
  user: User | null;
}) => {
  const router = useRouter();
  const { userProfile } = useUserProfile(user?.id ?? null);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const periodEndDate =
    subscription && !subscription.cancel_at
      ? new Date(subscription.next_renewal)
      : null;
  const isPendingCancelation =
    subscription?.status === SubscriptionStatus.CANCELED;

  const handleManageUserSubscription = async () => {
    setLoadingPortal(true);
    try {
      if (!userProfile?.customer_id) {
        throw new Error("No customer ID found for user");
      }
      const url = await handleManageSubscription(userProfile.customer_id);

      if (url) {
        router.push(url);
      }
    } catch (error) {
      console.error("Failed to create portal session:", error);
    } finally {
      setLoadingPortal(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return (
        <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
          Active
        </span>
      );
    }
    if (status === "past_due") {
      return (
        <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
          Past Due
        </span>
      );
    }
    if (status === "canceled") {
      return (
        <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
          Canceled
        </span>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
            <CreditCard className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <Text size="lg" className="font-semibold">
              Subscription
            </Text>
            {getStatusBadge(subscription?.status ?? "")}
          </div>
        </div>
      </div>

      {/* Subscription Details */}
      <div className="space-y-4">
        {/* Plan Name */}
        <div className="rounded-xl bg-neutral-50 p-4">
          <Text
            size="xs"
            className="mb-1 uppercase tracking-wide text-neutral-500"
          >
            Current Plan
          </Text>
          <Text size="md" className="font-semibold">
            CC VIP Monthly
          </Text>
          {isPendingCancelation && (
            <Text size="sm" className="mt-1 text-yellow-700">
              Your subscription is set to cancel on{" "}
              {periodEndDate?.toLocaleDateString()}.
            </Text>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
            Amount
          </label>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-neutral-400" />
            <Text size="md" className="font-medium">
              25/month
            </Text>
          </div>
        </div>

        {/* Next Charge */}
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
            {subscription?.status === SubscriptionStatus.CANCELED
              ? "Ends On"
              : "Next Charge"}
          </label>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-neutral-400" />
            <Text size="md" className="font-medium">
              {periodEndDate?.toLocaleDateString()}
            </Text>
          </div>
        </div>
      </div>

      {/* Manage Button */}
      <button
        onClick={handleManageUserSubscription}
        disabled={loadingPortal}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-black py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loadingPortal ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            <span>Manage Subscription</span>
            <ExternalLink className="h-4 w-4" />
          </>
        )}
      </button>

      {/* Info */}
      <div className="mt-4 rounded-xl bg-blue-50 p-3">
        <Text size="xs" className="leading-relaxed text-blue-900">
          💳 Manage payment methods, update billing info, or cancel your
          subscription in the billing portal.
        </Text>
      </div>
    </div>
  );
};
