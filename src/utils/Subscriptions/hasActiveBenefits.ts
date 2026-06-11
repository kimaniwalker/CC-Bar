import { Subscription } from "@/types/User";
import { SubscriptionStatus } from "@/types/Subscriptions";

export const hasActiveBenefits = (
  subscription: Subscription | null,
): boolean => {
  if (!subscription) return false;

  const isActive = subscription.status === SubscriptionStatus.ACTIVE;
  const isTrialing = subscription.status === SubscriptionStatus.TRIALING;
  const hasScheduledCancellation =
    !!subscription.cancel_at && new Date(subscription.cancel_at) > new Date();

  return isActive || isTrialing || hasScheduledCancellation;
};
