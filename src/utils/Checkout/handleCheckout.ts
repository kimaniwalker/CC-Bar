"use server";

import { CheckoutType } from "@/types/Reservations";
import Stripe from "stripe";

export interface CheckoutSessionParams {
  line_items: Stripe.Checkout.SessionCreateParams.LineItem[];
  redirect_url: string;
  metadata?: Record<string, string>;
  shipping_options?: Stripe.Checkout.SessionCreateParams.ShippingOption[];
}

export const handleCheckout = async ({
  line_items,
  redirect_url,
  metadata,
}: CheckoutSessionParams) => {
  // @ts-expect-error - The stripe terminal library expects a config param here which we can ignore.
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    client_reference_id: metadata?.user_id ?? "guest",
    customer_email: metadata?.email,
    customer: metadata?.customer_id,
    metadata: { type: CheckoutType.SHOP, ...metadata },
    success_url: `${process.env.NEXT_PUBLIC_DOMAIN}success/?session_id={CHECKOUT_SESSION_ID}&type=${CheckoutType.SHOP}`,
    discounts: [
      {
        coupon: metadata?.is_vip ? "CCBARVIP20OFF" : undefined, // Apply VIP discount if user is VIP
      },
    ],
    cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}${redirect_url}`,
    payment_method_types: [
      "card",
      "cashapp",
      "klarna",
      "link",
      "afterpay_clearpay",
    ] as Stripe.Checkout.SessionCreateParams.PaymentMethodType[],
    phone_number_collection: {
      enabled: true,
    },
    shipping_address_collection: {
      allowed_countries: [
        "US",
      ] as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
    },
  });

  return JSON.stringify(session.url);
};
