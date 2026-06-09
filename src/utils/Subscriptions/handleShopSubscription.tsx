"use server";

import Stripe from "stripe";
import { handleUpdateSubscription } from "./handleUpdateSubscription";
import { updateUserProfile } from "../User/updateUserProfile";
import { SubscriptionStatus } from "@/types/Subscriptions";
import { calculateNextRenewalDate } from "./calculateNextRenewalDate";

export const handleShopSubscription = async (
  session: Stripe.Checkout.Session,
) => {
  // Sync user profile customer id
  await updateUserProfile({
    user: {
      customer_id: session.customer as string,
      id: session.client_reference_id!,
    },
  });

  return await handleUpdateSubscription({
    user_id: session.client_reference_id!,
    status: SubscriptionStatus.ACTIVE,
    subscription_id: session.subscription as string,
    next_renewal: calculateNextRenewalDate(),
    cancel_at: null,
  });
};
