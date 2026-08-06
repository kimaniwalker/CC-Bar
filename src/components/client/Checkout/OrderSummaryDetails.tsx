import { Text } from "@/components/ds/Text";
import { ShippingMethod, ShippingRate } from "@/types/Cart";
import { Store, Truck } from "lucide-react";
import React from "react";
import { getEstimatedShipping } from "@/utils/ShipStation/getEstimatedShipping";

export const OrderSummaryDetails = ({
  shippingMethod,
  isVipSubscriptionFlow,
  cartSubtotal,
  setShippingMethod,
  weightOunces,
  selectedRate,
  onRateSelect,
  isVip,
}: {
  shippingMethod: ShippingMethod;
  isVipSubscriptionFlow: boolean;
  cartSubtotal: number;
  setShippingMethod: (deliveryMethod: ShippingMethod) => void;
  weightOunces: number;
  selectedRate: ShippingRate | null;
  onRateSelect: (rate: ShippingRate | null) => void;
  isVip: boolean;
}) => {
  const [zipCode, setZipCode] = React.useState("");
  const [rates, setRates] = React.useState<ShippingRate[]>([]);
  const [ratesLoading, setRatesLoading] = React.useState(false);
  const [ratesError, setRatesError] = React.useState<string | null>(null);

  const showRatePicker =
    shippingMethod === "delivery" && !isVipSubscriptionFlow;

  React.useEffect(() => {
    if (!showRatePicker || zipCode.length !== 5) {
      setRates([]);
      onRateSelect(null);
      return;
    }

    const timer = setTimeout(async () => {
      setRatesLoading(true);
      setRatesError(null);
      try {
        const res = await getEstimatedShipping({
          toPostalCode: zipCode,
          weightOunces,
        });
        setRates(res);
        // Auto-select cheapest option
        if (res.length > 0) {
          const cheapest = res.reduce((a, b) =>
            a.shipmentCost + a.otherCost <= b.shipmentCost + b.otherCost
              ? a
              : b,
          );
          onRateSelect(cheapest);
        }
      } catch {
        setRatesError(
          "Could not load shipping rates. A flat $9 rate will apply.",
        );
      } finally {
        setRatesLoading(false);
      }
    }, 600);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zipCode, showRatePicker, weightOunces]);

  // Reset rates when switching away from delivery
  React.useEffect(() => {
    if (shippingMethod !== "delivery") {
      setZipCode("");
      setRates([]);
      onRateSelect(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shippingMethod]);

  const SERVICE_LABELS: Record<string, { name: string; eta: string }> = {
    usps_ground_advantage: {
      name: "USPS Ground Advantage",
      eta: "2–5 business days",
    },
    usps_priority_mail: {
      name: "USPS Priority Mail",
      eta: "1–3 business days",
    },
    usps_priority_mail_express: {
      name: "USPS Priority Express",
      eta: "1–2 business days",
    },
  };

  return (
    <>
      <div className="space-y-2">
        <Text size="sm" className="font-medium text-neutral-700">
          Fulfillment Method
        </Text>

        <div className="grid grid-cols-2 gap-2">
          {/* Delivery Option */}
          <button
            type="button"
            onClick={() => setShippingMethod("delivery")}
            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition ${
              shippingMethod === "delivery"
                ? "border-purple-600 bg-purple-50"
                : "border-neutral-200 bg-white hover:border-neutral-300"
            }`}
          >
            <Truck
              className={`h-5 w-5 ${
                shippingMethod === "delivery"
                  ? "text-purple-600"
                  : "text-neutral-600"
              }`}
            />
            <div className="text-center">
              <Text
                size="xs"
                className={`font-medium ${
                  shippingMethod === "delivery"
                    ? "text-purple-900"
                    : "text-neutral-900"
                }`}
              >
                Delivery
              </Text>
              <Text
                size="xs"
                className={
                  shippingMethod === "delivery"
                    ? "text-purple-700"
                    : "text-neutral-600"
                }
              >
                {isVip
                  ? selectedRate &&
                    selectedRate.serviceCode !== "usps_ground_advantage"
                    ? `$${(selectedRate.shipmentCost + selectedRate.otherCost).toFixed(2)}`
                    : rates.length > 0
                      ? "Free (Ground)"
                      : "Free"
                  : cartSubtotal >= 75
                    ? "Free"
                    : selectedRate
                      ? `$${(selectedRate.shipmentCost + selectedRate.otherCost).toFixed(2)}`
                      : rates.length > 0
                        ? `From $${Math.min(...rates.map((r) => r.shipmentCost + r.otherCost)).toFixed(2)}`
                        : "Calculated"}
              </Text>
            </div>
          </button>

          {/* Pickup Option */}
          <button
            type="button"
            onClick={() => setShippingMethod("pickup")}
            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition ${
              shippingMethod === "pickup"
                ? "border-purple-600 bg-purple-50"
                : "border-neutral-200 bg-white hover:border-neutral-300"
            }`}
          >
            <Store
              className={`h-5 w-5 ${
                shippingMethod === "pickup"
                  ? "text-purple-600"
                  : "text-neutral-600"
              }`}
            />
            <div className="text-center">
              <Text
                size="xs"
                className={`font-medium ${
                  shippingMethod === "pickup"
                    ? "text-purple-900"
                    : "text-neutral-900"
                }`}
              >
                Pickup
              </Text>
              <Text
                size="xs"
                className={
                  shippingMethod === "pickup"
                    ? "text-purple-700"
                    : "text-neutral-600"
                }
              >
                Free
              </Text>
            </div>
          </button>
        </div>

        {/* Pickup Location Info */}
        {shippingMethod === "pickup" && (
          <div className="rounded-lg bg-purple-50 p-3 border border-purple-100">
            <Text size="xs" className="text-purple-900 font-medium mb-1">
              Pickup Location
            </Text>
            <Text size="xs" className="text-purple-700">
              4052 Helena Rd, Helena, AL 35080
            </Text>
            <Text size="xs" className="text-purple-600 mt-1">
              We&apos;ll email you when your order is ready (typically 3-5
              business days)
            </Text>
          </div>
        )}

        {/* Zip Code + Rate Picker (non-VIP, non-free delivery) */}
        {showRatePicker && (
          <div className="space-y-2">
            <Text size="xs" className="font-medium text-neutral-700">
              Enter your zip code to see shipping options
            </Text>
            <input
              type="text"
              inputMode="numeric"
              maxLength={5}
              placeholder="ZIP code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ""))}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
            />

            {ratesLoading && (
              <Text size="xs" className="text-neutral-500">
                Loading rates...
              </Text>
            )}

            {ratesError && (
              <Text size="xs" className="text-red-600">
                {ratesError}
              </Text>
            )}

            {rates.length > 0 && (
              <div className="space-y-1">
                {rates.map((rate) => {
                  const total = rate.shipmentCost + rate.otherCost;
                  const isSelected =
                    selectedRate?.serviceCode === rate.serviceCode;
                  return (
                    <button
                      key={rate.serviceCode}
                      type="button"
                      onClick={() => onRateSelect(rate)}
                      className={`w-full flex items-center justify-between rounded-lg border px-3 py-2 text-left transition ${
                        isSelected
                          ? "border-purple-600 bg-purple-50"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <div>
                        <Text
                          size="xs"
                          className={`font-medium ${isSelected ? "text-purple-900" : "text-neutral-900"}`}
                        >
                          {SERVICE_LABELS[rate.serviceCode]?.name ??
                            rate.serviceName}
                        </Text>
                        <Text size="xs" className="text-neutral-500">
                          {SERVICE_LABELS[rate.serviceCode]?.eta ?? ""}
                        </Text>
                      </div>
                      <Text
                        size="xs"
                        className={`font-semibold ${isSelected ? "text-purple-700" : "text-neutral-900"}`}
                      >
                        {isVip && rate.serviceCode === "usps_ground_advantage"
                          ? "Free"
                          : `$${total.toFixed(2)}`}
                      </Text>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <hr />

      {/* Pricing Breakdown */}
      <div className="flex justify-between">
        <Text size="sm">Subtotal</Text>
        <Text size="sm">${cartSubtotal.toFixed(2)}</Text>
      </div>

      <div className="flex justify-between">
        <Text size="sm">
          {shippingMethod === "delivery" ? "Shipping" : "Pickup"}
        </Text>
        <Text
          size="sm"
          className={
            shippingMethod === "pickup" ? "text-green-600 font-medium" : ""
          }
        >
          {shippingMethod === "delivery"
            ? isVip
              ? selectedRate &&
                selectedRate.serviceCode !== "usps_ground_advantage"
                ? `$${(selectedRate.shipmentCost + selectedRate.otherCost).toFixed(2)}`
                : "Free"
              : cartSubtotal >= 75
                ? "Free"
                : selectedRate
                  ? `$${(selectedRate.shipmentCost + selectedRate.otherCost).toFixed(2)}`
                  : zipCode.length === 5 && !ratesLoading
                    ? "$9.00"
                    : "—"
            : "Free"}
        </Text>
      </div>
    </>
  );
};
