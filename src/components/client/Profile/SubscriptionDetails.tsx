import { Text } from "@/components/ds/Text";
import { SubscriptionStatus } from "@/types/Subscriptions";
import { Subscription } from "@/types/User";
import { User } from "@supabase/supabase-js";
import { Calendar, CreditCard, DollarSign, AlertCircle } from "lucide-react";
import { SubscriptionActions } from "./SubscriptionActions";
import { hasActiveBenefits } from "@/utils/Subscriptions/hasActiveBenefits";
import { SubscriptionStatusBadge } from "./SubscriptionStatusBadge";

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
  const cancelAtDate = subscription.cancel_at
    ? new Date(subscription.cancel_at)
    : null;
  const pauseScheduledDate = subscription.pause_scheduled_at
    ? new Date(subscription.pause_scheduled_at)
    : null;

  const isPaused = subscription.status === SubscriptionStatus.PAUSED;
  const isCanceled = subscription.status === SubscriptionStatus.CANCELED;
  const isScheduledToCancel = cancelAtDate && cancelAtDate > new Date();
  const isScheduledToPause =
    pauseScheduledDate && pauseScheduledDate > new Date();
  const userHasActiveBenefits = hasActiveBenefits(subscription);

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
            <SubscriptionStatusBadge
              status={subscription.status}
              isScheduledToCancel={isScheduledToCancel}
              isScheduledToPause={isScheduledToPause}
            />
          </div>
        </div>
      </div>

      {/* Scheduled Pause Warning */}
      {isScheduledToPause && pauseScheduledDate && periodEndDate && (
        <div className="mb-4 rounded-xl bg-blue-50 border border-blue-200 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
            <div className="space-y-2">
              <div>
                <Text size="sm" className="text-blue-900 font-semibold mb-1">
                  Pause Scheduled for Next Billing Cycle
                </Text>
                <Text size="xs" className="text-blue-700 mb-2">
                  Your subscription will pause on{" "}
                  <span className="font-semibold">
                    {pauseScheduledDate.toLocaleDateString()}
                  </span>
                  . You&apos;ll continue to enjoy VIP benefits until then.
                </Text>
              </div>

              {/* Skipped Period - Simple inline display */}
              <div className="pt-2 border-t border-blue-200/60">
                <Text size="xs" className="text-blue-600 font-medium">
                  📅 Skipped Period: {pauseScheduledDate.toLocaleDateString()} -{" "}
                  {periodEndDate.toLocaleDateString()}
                </Text>
                <Text size="xs" className="text-blue-600 mt-1">
                  Billing resumes automatically on{" "}
                  {periodEndDate.toLocaleDateString()}
                </Text>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scheduled Cancellation Warning */}
      {isScheduledToCancel && cancelAtDate && (
        <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <Text size="sm" className="text-amber-900 font-semibold mb-1">
                Subscription Scheduled to Cancel
              </Text>
              <Text size="xs" className="text-amber-700">
                Your VIP benefits remain active until{" "}
                <span className="font-semibold">
                  {cancelAtDate.toLocaleDateString()}
                </span>
                . You can continue to enjoy all membership perks until then.
              </Text>
            </div>
          </div>
        </div>
      )}

      {/* Paused Notice */}
      {isPaused && periodEndDate && (
        <div className="mb-4 rounded-xl bg-yellow-50 border border-yellow-200 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
            <div>
              <Text size="sm" className="text-yellow-900 font-semibold mb-1">
                Membership Paused
              </Text>
              <Text size="xs" className="text-yellow-700">
                Your subscription will automatically resume on{" "}
                <span className="font-semibold">
                  {periodEndDate.toLocaleDateString()}
                </span>
              </Text>
            </div>
          </div>
        </div>
      )}

      {/* Canceled Notice */}
      {isCanceled && (
        <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-rose-600 mt-0.5 shrink-0" />
            <div>
              <Text size="sm" className="text-rose-900 font-semibold mb-1">
                VIP Membership Ended
              </Text>
              <Text size="xs" className="text-rose-700">
                Your subscription has been canceled. Each customer can only have
                one VIP membership. If you would like to renew your subscription
                please contact our support team.
              </Text>
            </div>
          </div>
        </div>
      )}

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
          <Text size="xs" className="mt-1 text-neutral-600">
            {userHasActiveBenefits
              ? "✅ VIP benefits active"
              : "❌ VIP benefits inactive"}
          </Text>
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

        {/* Next Charge / End Date */}
        {(periodEndDate || cancelAtDate) && (
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
              {isScheduledToCancel
                ? "Benefits End On"
                : isScheduledToPause
                  ? "Benefits Continue Until"
                  : isPaused
                    ? "Resumes On"
                    : isCanceled
                      ? "Ended On"
                      : "Next Charge"}
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-neutral-400" />
              <Text size="md" className="font-medium">
                {isScheduledToCancel
                  ? cancelAtDate?.toLocaleDateString()
                  : isScheduledToPause
                    ? pauseScheduledDate?.toLocaleDateString()
                    : periodEndDate?.toLocaleDateString()}
              </Text>
            </div>
          </div>
        )}

        {/* Resumption Date for Scheduled Pause */}
        {isScheduledToPause && periodEndDate && (
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
              Billing Resumes On
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
