"use server";

export type ShippingRate = {
  serviceCode: string;
  serviceName: string;
  shipmentCost: number;
  otherCost: number;
  transitDays: number | null;
};

export async function getEstimatedShipping({
  toPostalCode,
  toCountry = "US",
  weightOunces,
}: {
  toPostalCode: string;
  toCountry?: string;
  weightOunces: number;
}): Promise<ShippingRate[]> {
  const PREFERRED_SERVICES = new Set([
    "usps_ground_advantage", // cheapest, 2-5 days
    "usps_priority_mail", // middle, 2-3 days
    "usps_priority_mail_express", // fastest, 1-2 days
  ]);

  function filterRates(rates: ShippingRate[]): ShippingRate[] {
    // Deduplicate by serviceCode (keep cheapest if dupes exist)
    const seen = new Map<string, ShippingRate>();
    for (const rate of rates) {
      const existing = seen.get(rate.serviceCode);
      if (!existing || rate.shipmentCost < existing.shipmentCost) {
        seen.set(rate.serviceCode, rate);
      }
    }

    return [...seen.values()]
      .filter((r) => PREFERRED_SERVICES.has(r.serviceCode))
      .sort(
        (a, b) => a.shipmentCost + a.otherCost - (b.shipmentCost + b.otherCost),
      );
  }
  const response = await fetch(
    `https://ssapi.shipstation.com/shipments/getrates`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.SHIPSTATION_API_KEY}:${process.env.SHIPSTATION_API_SECRET}`,
        ).toString("base64")}`,
      },
      body: JSON.stringify({
        carrierCode: "stamps_com",
        serviceCode: null,
        packageCode: null,
        fromPostalCode: "35080",
        toPostalCode,
        toCountry,
        weight: {
          value: weightOunces,
          units: "ounces",
        },
        confirmation: "delivery",
        residential: true,
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Failed to get shipping rates: ${response.status} ${response.statusText} — ${body}`,
    );
  }

  const data: ShippingRate[] = await response.json();
  console.log("Raw ShipStation rates:", filterRates(data));
  return filterRates(data);
}
