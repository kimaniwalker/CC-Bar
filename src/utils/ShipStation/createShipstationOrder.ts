"use server";

import { CreateShipStationOrderParams } from "@/types/Shiptstation";

export const createShipstationOrder = async (
  params: CreateShipStationOrderParams,
): Promise<{ success: boolean; orderId?: number; error?: string }> => {
  try {
    const apiKey = process.env.SHIPSTATION_API_KEY;
    const apiSecret = process.env.SHIPSTATION_API_SECRET;

    if (!apiKey || !apiSecret) {
      throw new Error("ShipStation API credentials not configured");
    }

    // Create Basic Auth header
    const authString = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

    const response = await fetch(
      "https://ssapi.shipstation.com/orders/createorder",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${authString}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ShipStation API Error:", errorText);
      throw new Error(
        `ShipStation API error: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();
    console.log("ShipStation order created successfully:", data);

    return {
      success: true,
      orderId: data.orderId,
    };
  } catch (error) {
    console.error("Error creating ShipStation order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
