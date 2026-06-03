"use server";

import Stripe from "stripe";
import { handleUpdateSubscription } from "./handleUpdateSubscription";
import { updateUserProfile } from "../User/updateUserProfile";

export const handleShopSubscription = async (
  session: Stripe.Checkout.Session,
) => {
  //sync user profile customer id

  await updateUserProfile({
    user: {
      customer_id: session.customer as string,
      id: session.client_reference_id!,
    },
  });

  return await handleUpdateSubscription({
    user_id: session.client_reference_id!,
    status: "active",
    subscription_id: session.subscription as string,
    next_renewal: new Date(
      new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    cancel_at: null, // Assuming a 30-day subscription for simplicity
  });
};
