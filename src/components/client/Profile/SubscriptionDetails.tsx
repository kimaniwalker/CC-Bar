import { Text } from "@/components/ds/Text";
import { SubscriptionStatus } from "@/types/Subscriptions";
import { Subscription } from "@/types/User";
import { User } from "@supabase/supabase-js";
import { Calendar, CreditCard, DollarSign } from "lucide-react";
import { SubscriptionActions } from "./SubscriptionActions";

export const SubscriptionDetails = ({
  subscription,
  user,
}: {
  subscription: Subscription | null;
  user: User | null;
}) => {
  if (!subscription) {
    return null;
  }

  const periodEndDate = subscription.next_renewal
    ? new Date(subscription.next_renewal)
    : null;
  const isPendingCancelation =
    subscription.status === SubscriptionStatus.CANCELED;
  const isPaused = subscription.status === SubscriptionStatus.PAUSED;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      [SubscriptionStatus.ACTIVE]: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Active",
      },
      [SubscriptionStatus.PAUSED]: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        label: "Paused",
      },
      [SubscriptionStatus.TRIALING]: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        label: "Trial",
      },
      [SubscriptionStatus.PAST_DUE]: {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Past Due",
      },
      [SubscriptionStatus.INCOMPLETE]: {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Incomplete",
      },
      [SubscriptionStatus.INCOMPLETE_EXPIRED]: {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Expired",
      },
      [SubscriptionStatus.UNPAID]: {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Unpaid",
      },
      [SubscriptionStatus.CANCELED]: {
        bg: "bg-neutral-100",
        text: "text-neutral-700",
        label: "Canceled",
      },
      [SubscriptionStatus.ENDED]: {
        bg: "bg-neutral-100",
        text: "text-neutral-700",
        label: "Ended",
      },
    };

    const config = statusConfig[status as SubscriptionStatus];
    if (!config) return null;

    return (
      <span
        className={`inline-flex rounded-full ${config.bg} px-2.5 py-1 text-xs font-medium ${config.text} uppercase`}
      >
        {config.label}
      </span>
    );
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
            {getStatusBadge(subscription.status)}
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
          {isPendingCancelation && periodEndDate && (
            <Text size="sm" className="mt-1 text-yellow-700">
              Your subscription is set to cancel on{" "}
              {periodEndDate.toLocaleDateString()}.
            </Text>
          )}
          {isPaused && periodEndDate && (
            <Text size="sm" className="mt-1 text-yellow-700">
              Your subscription is paused and will resume on{" "}
              {periodEndDate.toLocaleDateString()}.
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
              $25/month
            </Text>
          </div>
        </div>

        {/* Next Charge / Resume Date */}
        {periodEndDate && (
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
              {isPendingCancelation
                ? "Ends On"
                : isPaused
                  ? "Resumes On"
                  : "Next Charge"}
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-neutral-400" />
              <Text size="md" className="font-medium">
                {periodEndDate.toLocaleDateString()}
              </Text>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <SubscriptionActions subscription={subscription} user={user} />

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
