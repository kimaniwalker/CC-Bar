"use server";

import Stripe from "stripe";

export const handleManageSubscription = async (customer_id: string) => {
  // @ts-expect-error - The stripe terminal library expects a config param here which we can ignore.
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customer_id,
    return_url: `${process.env.NEXT_PUBLIC_DOMAIN}profile/overview?section=profile`,
  });

  if (!portalSession.url) {
    throw new Error("Failed to create billing portal session");
  }

  return portalSession.url;
};
