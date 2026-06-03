"use client";

import { useUser } from "../Auth/AuthContext";
import { useEffect, useState } from "react";
import { getUserSubscription } from "@/utils/Subscriptions/getUserSubscription";
import { Subscription } from "@/types/User";
import { SubscriptionSignup } from "./SubscriptionSignup";
import { SubscriptionDetails } from "./SubscriptionDetails";

export const SubscriptionCard = () => {
  const { user } = useUser();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubscription() {
      if (!user?.id) return;

      setLoading(true);
      try {
        const data = await getUserSubscription(user.id);
        console.log({ data });

        if (data) {
          setSubscription(data[0]);
        }
      } catch (error) {
        console.error("Failed to load subscription:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSubscription();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-full bg-neutral-200" />
          <div className="h-6 w-32 animate-pulse rounded bg-neutral-200" />
        </div>
        <div className="space-y-4">
          <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
        </div>
      </div>
    );
  }

  // No subscription - Show sign up
  if (!subscription) {
    return <SubscriptionSignup user={user} />;
  }

  return <SubscriptionDetails subscription={subscription} user={user} />;
};
