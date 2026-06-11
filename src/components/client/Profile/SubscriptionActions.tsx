"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import { SubscriptionStatus } from "@/types/Subscriptions";
import { Subscription } from "@/types/User";
import { handleCancelPauseSchedule } from "@/utils/Subscriptions/handleCancelPauseSchedule";
import { handleManageSubscription } from "@/utils/Subscriptions/handleManageSubscription";
import { handlePauseSubscription } from "@/utils/Subscriptions/handlePauseSubscription";
import { handleReactivateSubscription } from "@/utils/Subscriptions/handleReactivateSubscription";
import { User } from "@supabase/supabase-js";
import { ExternalLink, Pause, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const SubscriptionActions = ({
  subscription,
  user,
}: {
  subscription: Subscription;
  user: User | null;
}) => {
  const router = useRouter();
  const { userProfile } = useUserProfile(user?.id ?? null);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [loadingPause, setLoadingPause] = useState(false);
  const [loadingReactivate, setLoadingReactivate] = useState(false);
  const [loadingCancelPause, setLoadingCancelPause] = useState(false);

  const cancelAtDate = subscription.cancel_at
    ? new Date(subscription.cancel_at)
    : null;
  const pauseScheduledDate = subscription.pause_scheduled_at
    ? new Date(subscription.pause_scheduled_at)
    : null;

  const isScheduledToCancel = cancelAtDate && cancelAtDate > new Date();
  const isScheduledToPause =
    pauseScheduledDate && pauseScheduledDate > new Date();

  // Button visibility logic
  const canPause =
    subscription.status === SubscriptionStatus.ACTIVE &&
    !isScheduledToCancel &&
    !isScheduledToPause;
  const canReactivate =
    isScheduledToCancel && subscription.status === SubscriptionStatus.ACTIVE;
  const canCancelPause =
    isScheduledToPause && subscription.status === SubscriptionStatus.ACTIVE;

  const handleManageUserSubscription = async () => {
    if (!userProfile?.customer_id) return;

    setLoadingPortal(true);
    try {
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

  const handlePause = async () => {
    if (!subscription.subscription_id) return;

    setLoadingPause(true);
    try {
      await handlePauseSubscription({
        subscriptionId: subscription.subscription_id,
        user_id: user?.id,
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to pause subscription:", error);
    } finally {
      setLoadingPause(false);
    }
  };

  const handleReactivate = async () => {
    if (!subscription.subscription_id) return;

    setLoadingReactivate(true);
    try {
      await handleReactivateSubscription({
        subscriptionId: subscription.subscription_id,
        user_id: user?.id,
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to reactivate subscription:", error);
    } finally {
      setLoadingReactivate(false);
    }
  };

  const handleCancelPause = async () => {
    if (!subscription.subscription_id) return;

    setLoadingCancelPause(true);
    try {
      // Reactivate removes the pause schedule
      await handleCancelPauseSchedule({
        subscriptionId: subscription.subscription_id,
        user_id: user?.id,
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to cancel pause:", error);
    } finally {
      setLoadingCancelPause(false);
    }
  };

  return (
    <div className="mt-6 space-y-3">
      {/* Cancel Scheduled Pause Button */}
      {canCancelPause && (
        <button
          onClick={handleCancelPause}
          disabled={loadingCancelPause}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-blue-500 bg-blue-50 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingCancelPause ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-700 border-t-transparent" />
              <span>Canceling...</span>
            </>
          ) : (
            <>
              <RotateCcw className="h-4 w-4" />
              <span>Cancel Scheduled Pause</span>
            </>
          )}
        </button>
      )}

      {/* Reactivate Button - Shows when scheduled to cancel */}
      {canReactivate && (
        <button
          onClick={handleReactivate}
          disabled={loadingReactivate}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-green-500 bg-green-50 py-3 text-sm font-medium text-green-700 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingReactivate ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-700 border-t-transparent" />
              <span>Reactivating...</span>
            </>
          ) : (
            <>
              <RotateCcw className="h-4 w-4" />
              <span>Cancel Pending Cancellation</span>
            </>
          )}
        </button>
      )}

      {/* Pause Button */}
      {canPause && (
        <button
          onClick={handlePause}
          disabled={loadingPause}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-neutral-200 bg-white py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingPause ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
              <span>Pausing...</span>
            </>
          ) : (
            <>
              <Pause className="h-4 w-4" />
              <span>Pause Next Cycle</span>
            </>
          )}
        </button>
      )}

      {/* Manage Button */}
      <button
        onClick={handleManageUserSubscription}
        disabled={loadingPortal}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
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
    </div>
  );
};
