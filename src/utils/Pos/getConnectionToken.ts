"use server";

import Stripe from "stripe";

export const getConnectionToken = async () => {
  // @ts-expect-error - The stripe terminal library expects a config param here which we can ignore.
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    const connectionToken = await stripe.terminal.connectionTokens.create();
    return connectionToken.secret;
  } catch (err) {
    console.error("Error fetching connection token:", err);
    throw new Error("Failed to fetch connection token");
  }
};
