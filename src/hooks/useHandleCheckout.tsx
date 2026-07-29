"use client";
import { Cart } from "@/types/Cart";
import { CheckoutType, ReservationsFormInputs } from "@/types/Reservations";
import { UserProfile } from "@/types/User";
import Stripe from "stripe";
import {
  calculateProductPrice,
  formatSelectedOptions,
} from "@/utils/Cart/normalizeCartProduct";
import { getDomain } from "@/utils/Formatters/getDomain";
import { AddOns } from "@/components/client/Reservations/AddOns";

export default function useHandlePayment() {
  return {
    calculateTotal,
    formatBody,
    formatReservationsData,
    formatLineItems,
  };
}

// ==================== RESERVATIONS ====================

function formatReservationsMetadata(data: ReservationsFormInputs) {
  const metaData: Record<string, string> = {
    type: CheckoutType.RESERVATION,
    name: data.name,
    email: data.email,
    phone: data.phone,
    date: data.date,
    dateTime: data.dateTime,
    time: data.time,
    guests: data.guests.toString(),
    activities: data.activities?.join(", ") || "",
    add_ons: data.addOns?.join(", ") || "",
  };

  if (data.special_requests) {
    metaData["special_requests"] = data.special_requests;
  }

  return metaData;
}

function formatReservationsLineItems(
  data: ReservationsFormInputs,
  basePrice: number,
  additionalActivitiesCost: number,
  activities: string[],
  addOns: string[],
) {
  const lineItems = [];

  // Base Package
  lineItems.push({
    price_data: {
      currency: "usd",
      unit_amount: basePrice * 100,
      product_data: {
        name: "CC BAR Creative Experience",
        description: `${data.guests} ${data.guests > 1 ? "guests" : "guest"} • ${data.date} at ${data.time} • Includes 2 activities per person`,
      },
    },
    quantity: 1,
  });

  // Additional Activities
  if (additionalActivitiesCost > 0 && activities.length > 1) {
    lineItems.push({
      price_data: {
        currency: "usd",
        unit_amount: additionalActivitiesCost * 100,
        product_data: {
          name: "Additional Activities",
          description: activities.slice(2).join(", "),
        },
      },
      quantity: 1,
    });
  }

  // Add-Ons (itemized)
  addOns?.forEach((addOnName) => {
    const addOnInfo = AddOns.find((a) => a.label === addOnName);
    if (!addOnInfo) return;

    const quantity = addOnInfo.perPerson ? data.guests : 1;

    lineItems.push({
      price_data: {
        currency: "usd",
        unit_amount: addOnInfo.price * 100,
        product_data: {
          name: addOnInfo.icon ? `${addOnInfo.icon} ${addOnName}` : addOnName,
          description: addOnInfo.perPerson
            ? `${quantity} ${quantity > 1 ? "servings" : "serving"}`
            : "Shared for the group",
        },
      },
      quantity,
    });
  });

  return lineItems;
}

function formatReservationsData({
  redirect_url,
  ReservationsFormData,
  user_id,
  basePrice,
  additionalActivitiesCost,
}: {
  redirect_url: string;
  ReservationsFormData: ReservationsFormInputs;
  user_id?: string | null;
  basePrice: number;
  additionalActivitiesCost: number;
  addOnsCost: number; // ✅ Keep for future use but not needed now
  total: number; // ✅ Keep for future use but not needed now
}) {
  const domain = getDomain();

  return {
    line_items: formatReservationsLineItems(
      ReservationsFormData,
      basePrice,
      additionalActivitiesCost,
      ReservationsFormData.activities || [],
      ReservationsFormData.addOns || [],
    ),
    mode: "payment" as Stripe.Checkout.SessionCreateParams.Mode,
    metadata: formatReservationsMetadata(ReservationsFormData),
    customer_email: ReservationsFormData.email,
    client_reference_id: user_id ?? "guest",
    submit_type: "pay" as Stripe.Checkout.SessionCreateParams.SubmitType,
    success_url: `${domain}/success?session_id={CHECKOUT_SESSION_ID}&type=reservation`,
    cancel_url: `${domain}${redirect_url}`,
    allow_promotion_codes: true,
    payment_method_types: [
      "card",
      "cashapp",
      "klarna",
      "link",
      "afterpay_clearpay",
    ] as Stripe.Checkout.SessionCreateParams.PaymentMethodType[],
    phone_number_collection: { enabled: true },
    consent_collection: {
      terms_of_service: "required",
    } as Stripe.Checkout.SessionCreateParams.ConsentCollection,
    custom_fields: [
      {
        key: "special_request",
        label: { custom: "Special Request", type: "custom" },
        type: "text",
        optional: true,
      },
    ],
    custom_text: {
      terms_of_service_acceptance: {
        message:
          "Late arrivals may result in a shortened experience or forfeiture of your reservation without refund. Cancellations or rescheduling requests must be made in advance and are subject to availability. By completing your booking, you acknowledge and agree to these terms.",
      },
    },
  };
}

// ==================== SHOP ====================

function formatLineItems(cart: Cart) {
  return cart.map((item) => {
    const itemPrice = calculateProductPrice(item);
    const selectedOptionsText = formatSelectedOptions(item);

    const metadata: Record<string, string> = {
      product_id: String(item.id),
      sku: item.sku,
      quantity: String(item.quantity),
    };

    // Add selected options to metadata
    if (item.selected_options) {
      Object.entries(item.selected_options).forEach(([groupName, option]) => {
        const optionName = Array.isArray(option.optionName)
          ? option.optionName.join(", ")
          : option.optionName;
        metadata[groupName.toLowerCase().replace(/\s+/g, "_")] = optionName;
      });
    }

    if (item.custom_message) {
      metadata["custom_message"] = item.custom_message;
    }

    return {
      price_data: {
        currency: "usd",
        unit_amount: Math.round(itemPrice * 100),
        product_data: {
          name: item.name,
          description: selectedOptionsText || undefined,
          images: [item.thumbnail],
          metadata,
        },
      },
      quantity: item.quantity,
    };
  });
}

function calculateTotal(cart: Cart) {
  return cart.reduce((total, item) => {
    const itemPrice = calculateProductPrice(item);
    return total + itemPrice * item.quantity;
  }, 0);
}

function formatBody(
  cart: Cart,
  shipping_total: number,
  redirect_url: string,
  user?: UserProfile | null,
) {
  const domain = getDomain();

  return {
    mode: "payment" as Stripe.Checkout.SessionCreateParams.Mode,
    line_items: formatLineItems(cart),
    client_reference_id: user?.id ?? "guest",
    metadata: { type: CheckoutType.SHOP, user_id: user?.id ?? "guest" },
    submit_type: "pay" as Stripe.Checkout.SessionCreateParams.SubmitType,
    success_url: `${domain}/success?session_id={CHECKOUT_SESSION_ID}&type=${CheckoutType.SHOP}`,
    cancel_url: `${domain}${redirect_url}`,
    allow_promotion_codes: true,
    payment_method_types: [
      "card",
      "cashapp",
      "klarna",
      "link",
      "afterpay_clearpay",
    ] as Stripe.Checkout.SessionCreateParams.PaymentMethodType[],
    phone_number_collection: { enabled: true },
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
            maximum: { unit: "week", value: 2 },
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
        label: { custom: "Special Request", type: "custom" },
        type: "text",
        optional: true,
      },
    ],
  };
}
