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

  try {
    // Get the subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const now = new Date();
    const billingAnchorDate = new Date(
      subscription.billing_cycle_anchor * 1000,
    );
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const anchorDay = billingAnchorDate.getDate(); // Should be 5

    // Determine if we've passed the anchor day this month
    const anchorThisMonth = new Date(currentYear, currentMonth, anchorDay);
    const hasPassedAnchor = now > anchorThisMonth;

    // Calculate when pause will take effect (when benefits end)
    const pauseScheduledDate = new Date(currentYear, currentMonth, anchorDay);
    if (hasPassedAnchor) {
      // Anchor already passed, pause starts next month
      pauseScheduledDate.setMonth(pauseScheduledDate.getMonth() + 1);
    }
    // If anchor not passed, pause starts this month (no change needed)

    // Calculate resume date: one month after pause starts
    const resumesAtDate = new Date(pauseScheduledDate);
    resumesAtDate.setMonth(resumesAtDate.getMonth() + 1);

    const pauseScheduledAt = Math.floor(pauseScheduledDate.getTime() / 1000);
    const resumesAt = Math.floor(resumesAtDate.getTime() / 1000);

    // Pause the subscription in Stripe
    const pausedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        pause_collection: {
          behavior: "void",
          resumes_at: resumesAt,
        },
      },
    );

    // Determine current status
    const nowTimestamp = Math.floor(now.getTime() / 1000);
    const isPausedImmediately = nowTimestamp >= pauseScheduledAt;

    // Update database with pause schedule
    await handleUpdateSubscription({
      subscription_id: subscriptionId,
      status: isPausedImmediately
        ? SubscriptionStatus.PAUSED
        : SubscriptionStatus.ACTIVE, // Keep active until pause date
      next_renewal: new Date(resumesAt * 1000).toISOString(),
      pause_scheduled_at: isPausedImmediately
        ? null
        : new Date(pauseScheduledAt * 1000).toISOString(), // Track when pause starts
      cancel_at: null,
      updated_at: new Date().toISOString(),
      user_id,
    });

    console.log("✅ Subscription pause scheduled:", {
      pauseScheduledAt: new Date(pauseScheduledAt * 1000).toISOString(),
      resumesAt: new Date(resumesAt * 1000).toISOString(),
      isPausedImmediately,
    });

    // Revalidate the profile page to refresh server components
    revalidatePath("/profile/overview", "page");
    revalidatePath("/profile/overview", "layout");

    return {
      success: true,
      subscription: {
        id: pausedSubscription.id,
        status: pausedSubscription.status,
      },
      pauseScheduledAt: new Date(pauseScheduledAt * 1000).toISOString(), // ✅ ISO string
      resumesAt: new Date(resumesAt * 1000).toISOString(), // ✅ ISO string
      isPausedImmediately,
    };
  } catch (error) {
    console.error("❌ Error pausing subscription:", error);
    throw error;
  }
};
