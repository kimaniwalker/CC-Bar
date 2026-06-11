"use server";

import { handleUpdateSubscription } from "./handleUpdateSubscription";
import { SubscriptionStatus } from "@/types/Subscriptions";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";

export const handleReactivateSubscription = async ({
  subscriptionId,
  user_id,
}: {
  subscriptionId: string;
  user_id?: string;
}) => {
  // @ts-expect-error - The stripe terminal library expects a config param here which we can ignore.
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  try {
    // Remove the scheduled cancellation in Stripe
    const reactivatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        cancel_at_period_end: false,
        cancel_at: null,
      },
    );

    // Update database - clear cancel_at
    const response = await handleUpdateSubscription({
      subscription_id: subscriptionId,
      status: SubscriptionStatus.ACTIVE,
      cancel_at: null,
      updated_at: new Date().toISOString(),
      user_id,
    });

    console.log("✅ Subscription reactivated successfully:", response);

    // Revalidate the profile page
    revalidatePath("/profile/overview", "page");
    revalidatePath("/profile/overview", "layout");

    return {
      success: true,
      subscription: {
        id: reactivatedSubscription.id,
        status: reactivatedSubscription.status,
      },
    };
  } catch (error) {
    console.error("❌ Error reactivating subscription:", error);
    throw error;
  }
};
