"use server";

import Stripe from "stripe";
import { SubscriptionStatus } from "@/types/Subscriptions";
import { revalidatePath } from "next/cache";
import { handleUpdateSubscription } from "./handleUpdateSubscription";
import { calculateNextRenewalDate } from "./calculateNextRenewalDate";

export const handleCancelPauseSchedule = async ({
  subscriptionId,
  user_id,
}: {
  subscriptionId: string;
  user_id?: string;
}) => {
  // @ts-expect-error - The stripe terminal library expects a config param here which we can ignore.
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    // Remove the pause schedule by clearing pause_collection
    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        pause_collection: "", // Empty string removes the pause
      },
    );

    // Update database - clear pause_scheduled_at
    const response = await handleUpdateSubscription({
      subscription_id: subscriptionId,
      status: SubscriptionStatus.ACTIVE,
      pause_scheduled_at: null, // Clear the scheduled pause
      updated_at: new Date().toISOString(),
      user_id,
      next_renewal: calculateNextRenewalDate(),
    });

    console.log("✅ Pause schedule canceled successfully:", response);

    // Revalidate the profile page
    revalidatePath("/profile/overview", "page");
    revalidatePath("/profile/overview", "layout");

    // ✅ Only includes what you explicitly choose
    return {
      success: true,
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
      },
    };
  } catch (error) {
    console.error("❌ Error canceling pause schedule:", error);
    throw error;
  }
};
