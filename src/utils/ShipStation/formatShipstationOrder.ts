import {
  CreateShipStationOrderParams,
  StripeSessionWithShipping,
} from "@/types/Shiptstation";
import type Stripe from "stripe";

export const formatShipStationOrder = (
  session: StripeSessionWithShipping,
  orderId: string,
): CreateShipStationOrderParams => {
  const lineItems = session?.line_items?.data as Stripe.LineItem[];

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

  const shipstationOrder: CreateShipStationOrderParams = {
    orderNumber: orderId,
    orderKey: session.id,
    orderDate: new Date().toISOString(),
    paymentDate: new Date().toISOString(),
    orderStatus: "awaiting_shipment" as const,
    customerEmail:
      session.customer_email || session.customer_details?.email || "",
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

  return shipstationOrder;
};
