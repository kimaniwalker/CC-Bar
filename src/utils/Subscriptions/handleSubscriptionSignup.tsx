"use server";

import { CheckoutType } from "@/types/Reservations";
import { getDomain } from "@/utils/Formatters/getDomain";
import Stripe from "stripe";

export const handleSubscriptionSignup = async ({
  metadata,
  redirect_url,
  line_items,
}: {
  metadata?: Record<string, string>;
  redirect_url: string;
  line_items?: Stripe.Checkout.SessionCreateParams.LineItem[];
}) => {
  // @ts-expect-error - The stripe terminal library expects a config param here which we can ignore.
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const domain = getDomain();

  const priceId = process.env.STRIPE_SUBSCRIPTION_PRICE_ID;
  const vipFlowPriceId = process.env.STRIPE_VIP_SUBSCRIPTION_PRICE_ID; // Same price for VIP flow, but could be different if needed

  const priceIdToUse =
    metadata?.is_vip_subscription_flow === "true" ? vipFlowPriceId : priceId;

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
    price: priceIdToUse,
    quantity: 1,
    metadata: {
      product_id: "0ffe0d01-f0d2-492d-a3b4-2f1dd52fa01c", // 👈 must be string
      sku: "SKU-CCBAR-SUB",
      quantity: String(1),
    },
  };

  // Combine subscription with any shop items
  const checkoutLineItems = line_items
    ? [subscriptionLineItem, ...line_items]
    : [subscriptionLineItem];

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    client_reference_id: metadata?.user_id,
    customer_email: metadata?.email,
    metadata: {
      type: CheckoutType.SHOP,
      will_get_current_box: willGetCurrentBox.toString(),
      has_shop_items: line_items && line_items.length > 0 ? "true" : "false",
      ...metadata,
    },
    subscription_data: {
      trial_end: billingCycleAnchor, // Free trial until the 5th, then charge
    },
    discounts: [
      {
        coupon:
          metadata?.is_vip_subscription_flow === "true"
            ? "CCBARVIP20OFF"
            : undefined, // Apply VIP discount if user is VIP
      },
    ],
    payment_method_types: [
      "card",
      "cashapp",
      "klarna",
      "link",
    ] as Stripe.Checkout.SessionCreateParams.PaymentMethodType[],
    ...(metadata?.shippingMethod === "delivery" && {
      shipping_address_collection: {
        allowed_countries: [
          "US",
        ] as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
      },
    }),
    phone_number_collection: {
      enabled: true,
    },
    ...(metadata?.shippingMethod === "pickup" && {
      custom_text: {
        submit: {
          message:
            "We'll begin preparing your order shortly. Once it's ready for pickup, we'll send you a text notification and email with pickup instructions.",
        },
      },
    }),
    ...(metadata?.includes_shipping === "false" && {
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 900, // $9 delivery fee
              currency: "usd",
            },
            display_name: "Delivery",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 2,
              },
              maximum: {
                unit: "business_day",
                value: 5,
              },
            },
          },
        },
      ],
    }),
    line_items: checkoutLineItems,
    success_url: `${domain}/success?session_id={CHECKOUT_SESSION_ID}&type=${CheckoutType.SUBSCRIPTION}`,
    cancel_url: `${domain}${redirect_url}`,
  });

  return session.url;
};
