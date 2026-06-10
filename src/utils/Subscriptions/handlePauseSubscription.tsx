"use server";
import Stripe from "stripe";
import { SubscriptionStatus } from "@/types/Subscriptions";
import { revalidatePath } from "next/cache";
import { handleUpdateSubscription } from "./handleUpdateSubscription";

export const handlePauseSubscription = async ({
  subscriptionId,
  user_id,
}: {
  subscriptionId: string;
  user_id?: string;
}) => {
  // @ts-expect-error - The stripe terminal library expects a config param here which we can ignore.
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  // Get the subscription
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const now = new Date();
  const billingAnchorDate = new Date(subscription.billing_cycle_anchor * 1000);
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const anchorDay = billingAnchorDate.getDate(); // Should be 5

  // Determine if we've passed the anchor day this month
  const anchorThisMonth = new Date(currentYear, currentMonth, anchorDay);
  const hasPassedAnchor = now > anchorThisMonth;

  // Calculate resume date: next anchor if not passed, anchor after next if passed
  const resumesAtDate = new Date(currentYear, currentMonth, anchorDay);
  if (hasPassedAnchor) {
    // Anchor already passed, skip next month
    resumesAtDate.setMonth(resumesAtDate.getMonth() + 2);
  } else {
    // Anchor hasn't passed, skip current month
    resumesAtDate.setMonth(resumesAtDate.getMonth() + 1);
  }

  const resumesAt = Math.floor(resumesAtDate.getTime() / 1000);

  // Pause the subscription in Stripe
  const pausedSubscription = await stripe.subscriptions.update(subscriptionId, {
    pause_collection: {
      behavior: "void",
      resumes_at: resumesAt,
    },
  });

  // Update your database with pause status
  const response = await handleUpdateSubscription({
    subscription_id: subscriptionId,
    status: SubscriptionStatus.PAUSED,
    next_renewal: new Date(resumesAt * 1000).toISOString(),
    cancel_at: null,
    updated_at: new Date().toISOString(),
    user_id,
  });

  console.log("✅ Subscription paused successfully:", response);

  // Revalidate the profile page to refresh server components
  revalidatePath("/profile/overview", "page");
  revalidatePath("/profile/overview", "layout");

  return JSON.stringify(pausedSubscription);
};
