"use server";

import { getDomain } from "@/utils/Formatters/getDomain";
import Stripe from "stripe";

export const handleManageSubscription = async (customer_id: string) => {
  // @ts-expect-error - The stripe terminal library expects a config param here which we can ignore.
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const domain = getDomain();

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customer_id,
    return_url: `${domain}/profile/overview?section=profile`,
  });

  if (!portalSession.url) {
    throw new Error("Failed to create billing portal session");
  }

  return portalSession.url;
};
