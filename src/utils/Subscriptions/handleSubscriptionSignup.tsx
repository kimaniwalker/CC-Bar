"use server";

import { CheckoutType } from "@/types/Reservations";
import Stripe from "stripe";

export const handleSubscriptionSignup = async ({
  user_id,
  email,
  redirect_url,
  line_items,
}: {
  user_id: string;
  email: string;
  redirect_url: string;
  line_items?: Stripe.Checkout.SessionCreateParams.LineItem[];
}) => {
  // @ts-expect-error - The stripe terminal library expects a config param here which we can ignore.
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const priceId = "price_1TcSveHqeKE5XTo5yFbPSmfa";

  // Calculate billing cycle anchor for the 5th of the month
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Create a date for the 5th of the current month
  const anchorDate = new Date(currentYear, currentMonth, 5);

  // Determine if they'll get the current month's box
  const willGetCurrentBox = currentDay < 5; // Sign up before the 5th = get this month's box

  // If we've already passed the 5th this month, use the 5th of next month
  if (currentDay >= 5) {
    anchorDate.setMonth(anchorDate.getMonth() + 1);
  }

  // Convert to Unix timestamp (seconds)
  const billingCycleAnchor = Math.floor(anchorDate.getTime() / 1000);

  // Subscription line item
  const subscriptionLineItem = {
    price: priceId,
    quantity: 1,
    metadata: {
      product_id: "0ffe0d01-f0d2-492d-a3b4-2f1dd52fa01c", // 👈 must be string
      sku: "SKU-CCBAR-SUB",
      quantity: String(1),
      isVariationProduct: String(false),
    },
  };

  // Combine subscription with any shop items
  const checkoutLineItems = line_items
    ? [subscriptionLineItem, ...line_items]
    : [subscriptionLineItem];

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    client_reference_id: user_id,
    customer_email: email,
    metadata: {
      type: CheckoutType.SHOP,
      will_get_current_box: willGetCurrentBox.toString(),
      has_shop_items: line_items && line_items.length > 0 ? "true" : "false",
    },
    subscription_data: {
      trial_end: billingCycleAnchor, // Free trial until the 5th, then charge
    },
    line_items: checkoutLineItems,
    success_url: `${process.env.NEXT_PUBLIC_DOMAIN}success/?session_id={CHECKOUT_SESSION_ID}&type=${CheckoutType.SUBSCRIPTION}`,
    cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}${redirect_url}`,
  });

  return session.url;
};
