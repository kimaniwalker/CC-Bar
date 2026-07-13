"use server";
import Stripe from "stripe";

export async function retrieveCheckoutSession(
  sessionId: string,
): Promise<Stripe.Checkout.Session> {
  // @ts-expect-error - The stripe library expects a config param here which we can ignore.
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "line_items.data.price.product", "shipping.address"],
  });

  return JSON.parse(JSON.stringify(session)) as Stripe.Checkout.Session;
}
