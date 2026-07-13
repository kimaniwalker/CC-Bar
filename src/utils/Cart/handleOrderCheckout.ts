"use server";

import { handleAddNewOrder } from "@/utils/Orders/handleAddNewOrder";
import { ORDER_STATUS } from "@/types/Orders";
import type Stripe from "stripe";
import { retrieveCheckoutSession } from "./retrieveCheckoutSession";

// Extended type to include collected_information (not in Stripe's official types)
type StripeSessionWithShipping = Stripe.Checkout.Session & {
  collected_information?: {
    shipping_details?: {
      address?: {
        line1?: string | null;
        line2?: string | null;
        city?: string | null;
        state?: string | null;
        postal_code?: string | null;
        country?: string | null;
      };
    };
  };
};

export async function handleOrderCheckout(
  stripeSession: Stripe.Checkout.Session,
) {
  const session = (await retrieveCheckoutSession(
    stripeSession.id,
  )) as StripeSessionWithShipping;
  const lineItems = session?.line_items?.data as Stripe.LineItem[];

  console.log(session);

  const { orderId } = await handleAddNewOrder({
    order: {
      id: session.id,
      user_id: stripeSession.client_reference_id ?? "guest",
      stripe_payment_intent_id: String(session.payment_intent),
      stripe_customer_id: String(session.customer),
      total: session.amount_total ?? 0,
      subtotal: session.amount_subtotal ?? 0,
      shipping_total: session.total_details?.amount_shipping ?? 0,
      status: ORDER_STATUS.CONFIRMED,
      lineItems,
    },
  });

  // Map lineItems to ShipStation items format
  const items =
    lineItems?.map((lineItem) => {
      const price = lineItem.price as Stripe.Price;
      const product = price?.product as Stripe.Product;

      return {
        sku: product?.metadata?.sku || product?.id || "UNKNOWN-SKU",
        name: lineItem.description || product?.name || "Unknown Product",
        quantity: lineItem.quantity || 1,
        unitPrice:
          (lineItem.amount_total || 0) / 100 / (lineItem.quantity || 1),
        weight: {
          value: Number(product?.metadata?.weight || 8), // Default to 8oz if not set
          units: "ounces" as const,
        },
        imageUrl: product?.images?.[0] || null,
        options: Object.entries(product?.metadata || {})
          .filter(([key]) => !["sku", "weight"].includes(key))
          .map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value: String(value),
          })),
      };
    }) || [];

  const shipstationOrder = {
    orderNumber: orderId,
    orderKey: session.id,
    orderDate: new Date().toISOString(),
    paymentDate: new Date().toISOString(),
    orderStatus: "awaiting_shipment" as const,
    customerEmail: session.customer_email || session.customer_details?.email,
    billTo: {
      name: "Candle Cow Bar",
      street1: "4052 Helena Rd",
      city: "Helena",
      state: "AL",
      postalCode: "35080",
      country: "US",
    },
    shipTo: {
      name: session.customer_details?.name || "Customer",
      street1: session.collected_information?.shipping_details?.address?.line1,
      street2: session.collected_information?.shipping_details?.address?.line2,
      city: session.collected_information?.shipping_details?.address?.city,
      state: session.collected_information?.shipping_details?.address?.state,
      postalCode:
        session.collected_information?.shipping_details?.address?.postal_code,
      country:
        session.collected_information?.shipping_details?.address?.country ||
        "US",
      phone: session.customer_details?.phone,
      residential: true,
    },
    items,
    amountPaid: (session.amount_total || 0) / 100,
    taxAmount: (session.total_details?.amount_tax || 0) / 100,
    shippingAmount: (session.total_details?.amount_shipping || 0) / 100,
    paymentMethod: "Credit Card",
  };

  console.log(
    "📦 ShipStation Order:",
    JSON.stringify(shipstationOrder, null, 2),
  );

  if (orderId === null) {
    console.log("⚠️ Guest checkout - ⏭️ skipping order creation");
    return;
  }

  console.log("✅ Order created successfully:", orderId);
}
