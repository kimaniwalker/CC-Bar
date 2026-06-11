import { Text } from "@/components/ds/Text";
import { ShippingMethod } from "@/types/Cart";
import { Store, Truck } from "lucide-react";

export const OrderSummaryDetails = ({
  shippingMethod,
  isVipSubscriptionFlow,
  cartSubtotal,
  setShippingMethod,
}: {
  shippingMethod: ShippingMethod;
  isVipSubscriptionFlow: boolean;
  cartSubtotal: number;
  setShippingMethod: (deliveryMethod: ShippingMethod) => void;
}) => {
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
                {cartSubtotal < 75 && !isVipSubscriptionFlow ? "$9.00" : "Free"}
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
          {shippingMethod === "delivery" &&
          cartSubtotal < 75 &&
          !isVipSubscriptionFlow
            ? "$9.00"
            : "Free"}
        </Text>
      </div>
    </>
  );
};
