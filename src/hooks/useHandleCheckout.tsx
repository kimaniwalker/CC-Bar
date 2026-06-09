"use client";
import { Cart } from "@/types/Cart";
import { CheckoutType, ReservationsFormInputs } from "@/types/Reservations";
import { UserProfile } from "@/types/User";
import { round } from "lodash";
import Stripe from "stripe";

export default function useHandlePayment() {
  return {
    calculateTotal,
    formatBody,
    formatReservationsData,
    formatLineItems,
  };
}

function formatReservationsMetadata(data: ReservationsFormInputs) {
  const metaData: Record<string, string> = {};
  metaData["type"] = CheckoutType.RESERVATION;
  metaData["name"] = data.name;
  metaData["email"] = data.email;
  metaData["phone"] = data.phone;
  metaData["date"] = data.date;
  metaData["dateTime"] = data.dateTime;
  metaData["time"] = data.time;
  metaData["guests"] = data.guests.toString();
  metaData["activities"] = data.activities?.join(", ");
  metaData["add_ons"] = data.addOns?.join(", ");
  if (data.special_requests) {
    metaData["special requests"] = data.special_requests;
  }

  return metaData;
}
function formatLineItems(cart: Cart) {
  return cart.map((item) => ({
    price_data: {
      currency: "usd",
      unit_amount: Math.round(item.price * 100),
      product_data: {
        name: item.name,
        description:
          [item.size, item.color].filter(Boolean).join(" | ") || undefined,
        images: [item.thumbnail],
        metadata: {
          product_id: String(item.id), // 👈 must be string
          sku: item.sku,
          quantity: String(item.quantity),
          isVariationProduct: String(item.isVariationProduct),
          ...(item.color && { color: item.color }),
          ...(item.size && { size: item.size }),
          ...(item.custom_messsage && { custom_message: item.custom_messsage }),
        },
      },
    },
    quantity: item.quantity,
  }));
}

function calculateTotal(cart: Cart) {
  let total = 0;

  if (cart.length >= 1) {
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      const price = item.price;
      const quantity = item.quantity;

      total += price * quantity;
    }
  }

  return round(total, 2);
}

function formatBody(
  cart: Cart,
  shipping_total: number,
  redirect_url: string,
  user?: UserProfile | null,
) {
  const body = {
    mode: "payment" as Stripe.Checkout.SessionCreateParams.Mode,
    line_items: formatLineItems(cart),
    client_reference_id: user?.id ?? "guest",
    metadata: { type: CheckoutType.SHOP, user_id: user?.id ?? "guest" },
    submit_type: "pay" as Stripe.Checkout.SessionCreateParams.SubmitType,
    success_url: `${process.env.NEXT_PUBLIC_DOMAIN}success?session_id={CHECKOUT_SESSION_ID}&type=${CheckoutType.SHOP}`,
    cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}${redirect_url}`,
    allow_promotion_codes: true,
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
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Candlelicious Priority Shipping",
          type: "fixed_amount",
          delivery_estimate: {
            maximum: {
              unit: "week",
              value: 2,
            },
          },
          fixed_amount: {
            amount: shipping_total,
            currency: "usd",
          },
        },
      } as Stripe.Checkout.SessionCreateParams.ShippingOption,
    ],
    custom_fields: [
      {
        key: "special_request",
        label: {
          custom: "Special Request",
          type: "custom",
        },
        type: "text",
        optional: true,
      },
    ],
  };
  return body;
}
function formatReservationsLineItems(data: ReservationsFormInputs) {
  const lineItems = [];
  const body = {
    price_data: {
      currency: "usd",
      unit_amount: 2500,
      product_data: {
        name: "CC BAR Creative Experience",
        description: `Date: ${data.date} Time: ${data.time} Guests: ${data.guests}`,
      },
    },
    quantity: data.guests,
  };

  lineItems.push(body);

  console.log(lineItems);
  return lineItems;
}

function formatReservationsData({
  redirect_url,
  ReservationsFormData,
  user_id,
}: {
  redirect_url: string;
  ReservationsFormData: ReservationsFormInputs;
  user_id?: string | null;
}) {
  const metadata = formatReservationsMetadata(ReservationsFormData);
  const line_items = formatReservationsLineItems(ReservationsFormData);
  const body = {
    line_items,
    mode: "payment" as Stripe.Checkout.SessionCreateParams.Mode,
    metadata,
    customer_email: ReservationsFormData.email,
    client_reference_id: user_id ?? "guest",
    submit_type: "pay" as Stripe.Checkout.SessionCreateParams.SubmitType,
    success_url: `${process.env.NEXT_PUBLIC_DOMAIN}success/?session_id={CHECKOUT_SESSION_ID}&type=${CheckoutType.RESERVATION}`,
    cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}${redirect_url}`,
    allow_promotion_codes: true,
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
    consent_collection: {
      terms_of_service: "required",
    } as Stripe.Checkout.SessionCreateParams.ConsentCollection,
    custom_fields: [
      {
        key: "special_request",
        label: {
          custom: "Special Request",
          type: "custom",
        },
        type: "text",
        optional: true,
      },
    ],
    custom_text: {
      terms_of_service_acceptance: {
        message:
          "Your reservation includes a $25 deposit, which will be applied toward your experience. Additional services or selected activities may result in a remaining balance due upon arrival. Late arrivals may result in a shortened experience or forfeiture of your reservation without refund. Cancellations or rescheduling requests must be made in advance and are subject to availability. By completing your booking, you acknowledge and agree to these terms.",
      },
    },
  };

  return body;
}
