"use server";

import { CheckoutType } from "@/types/Reservations";
import Stripe from "stripe";

export const handleSubscriptionSignup = async ({
  user_id,
  email,
  redirect_url,
}: {
  user_id: string;
  email: string;
  redirect_url: string;
}) => {
  // @ts-expect-error - The stripe terminal library expects a config param here which we can ignore.
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const priceId = "price_1TcSveHqeKE5XTo5yFbPSmfa";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    client_reference_id: user_id,
    customer_email: email,
    metadata: {
      type: CheckoutType.SHOP,
    },
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
    // the actual Session ID is returned in the query parameter when your customer
    // is redirected to the success page.
    success_url: `${process.env.NEXT_PUBLIC_DOMAIN}success/?session_id={CHECKOUT_SESSION_ID}&type=${CheckoutType.SHOP}`,
    cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}${redirect_url}`,
  });

  return session.url;
};
