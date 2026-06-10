"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import { SubscriptionStatus } from "@/types/Subscriptions";
import { Subscription } from "@/types/User";
import { handleManageSubscription } from "@/utils/Subscriptions/handleManageSubscription";
import { handlePauseSubscription } from "@/utils/Subscriptions/handlePauseSubscription";
import { User } from "@supabase/supabase-js";
import { ExternalLink, Pause } from "lucide-react";
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

  const isPendingCancelation =
    subscription.status === SubscriptionStatus.CANCELED;
  const canPause =
    subscription.status === SubscriptionStatus.ACTIVE && !isPendingCancelation;

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

  return (
    <div className="mt-6 space-y-3">
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
              <span>Pause Next Month</span>
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
