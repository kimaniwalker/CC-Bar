"use server";
import Stripe from "stripe";

export async function checkout(body: Stripe.Checkout.SessionCreateParams) {
  // @ts-expect-error - The stripe terminal library expects a config param here which we can ignore.
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const session = await stripe.checkout.sessions.create(body);

  return session.url;
}
