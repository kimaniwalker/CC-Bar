import { NextRequest, NextResponse } from "next/server";
import { handleUpdateOrder } from "@/utils/Orders/handleUpdateOrder";
import { ORDER_STATUS } from "@/types/Orders";
import { createClient } from "@/utils/supabase/server";

// ShipStation webhook event types
type ShipStationWebhookEvent = {
  resource_type: "ORDER" | "SHIPMENT";
  resource_url: string;
};

type ShipStationTrackingEvent = {
  trackingNumber: string;
  carrierCode: string;
  shipDate: string;
  orderId: number;
  orderNumber: string;
  orderKey: string;
  userId: string | null;
  status:
    | "UNKNOWN"
    | "PRE_TRANSIT"
    | "IN_TRANSIT"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "RETURNED"
    | "FAILURE";
};
// Map ShipStation statuses to your order statuses
const mapShipStationStatus = (status: string): ORDER_STATUS => {
  const statusMap: Record<string, ORDER_STATUS> = {
    PRE_TRANSIT: ORDER_STATUS.PROCESSING,
    IN_TRANSIT: ORDER_STATUS.SHIPPED,
    OUT_FOR_DELIVERY: ORDER_STATUS.SHIPPED,
    DELIVERED: ORDER_STATUS.DELIVERED,
    RETURNED: ORDER_STATUS.RETURNED,
    FAILURE: ORDER_STATUS.FAILURE,
    UNKNOWN: ORDER_STATUS.PROCESSING,
  };

  return statusMap[status] || ORDER_STATUS.PROCESSING;
};
export async function POST(request: NextRequest) {
  try {
    // Verify the request is from ShipStation
    const authHeader = request.headers.get("authorization");
    const expectedAuth = `Basic ${Buffer.from(
      `${process.env.SHIPSTATION_API_KEY}:${process.env.SHIPSTATION_API_SECRET}`,
    ).toString("base64")}`;

    if (authHeader !== expectedAuth) {
      console.error("❌ Unauthorized ShipStation webhook request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const event: ShipStationWebhookEvent = await request.json();

    console.log("📦 ShipStation webhook received:", event);

    // Handle different event types
    if (event.resource_type === "SHIPMENT") {
      // Fetch shipment details from ShipStation API
      const shipmentResponse = await fetch(event.resource_url, {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.SHIPSTATION_API_KEY}:${process.env.SHIPSTATION_API_SECRET}`,
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
      });

      if (!shipmentResponse.ok) {
        throw new Error("Failed to fetch shipment details from ShipStation");
      }

      const shipmentData: ShipStationTrackingEvent =
        await shipmentResponse.json();

      console.log("📦 Shipment data:", shipmentData);

      // Extract order key (this should be your Stripe session ID or order ID)
      const orderId = shipmentData.orderKey;

      if (!orderId) {
        console.error("❌ No order key found in shipment data");
        return NextResponse.json(
          { error: "No order key found" },
          { status: 400 },
        );
      }

      // Map ShipStation status to your order status
      const orderStatus = mapShipStationStatus(shipmentData.status);

      // Get existing order to retrieve deposit amount and payment intent
      const supabase = await createClient();
      const { data: existingOrder, error } = await supabase
        .from("orders")
        .select("total, stripe_payment_intent_id")
        .eq("id", orderId)
        .single();

      if (error || !existingOrder) {
        throw new Error("Existing order not found");
      }

      // Update order in database
      await handleUpdateOrder({
        order: {
          stripe_payment_intent_id: orderId,
          status: orderStatus,
          tracking_number: shipmentData.trackingNumber,
          carrier_code: shipmentData.carrierCode,
          shipped_at: shipmentData.shipDate,
          total: existingOrder.total, // Keep the existing total
        },
      });

      console.log(`✅ Order ${orderId} updated to status: ${orderStatus}`);

      return NextResponse.json({
        success: true,
        message: "Order updated successfully",
      });
    }

    // Handle ORDER events if needed
    if (event.resource_type === "ORDER") {
      console.log("📝 Order event received (not processing)");
      return NextResponse.json({
        success: true,
        message: "Order event acknowledged",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Event acknowledged",
    });
  } catch (error) {
    console.error("❌ Error processing ShipStation webhook:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "ShipStation webhook endpoint is active",
  });
}
