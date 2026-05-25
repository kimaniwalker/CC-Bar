import { Text } from "@/components/ds/Text";

export const OrderDetailsSummary = ({
  total,
  shipping_total = 0,
  subtotal = 0,
}: {
  total: number;
  shipping_total?: number;
  subtotal?: number;
}) => {
  return (
    <section className="rounded-3xl p-6 shadow-sm bg-white">
      <Text size="xl" className={`text-xl font-semibold text-neutral-900`}>
        Order Summary
      </Text>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <Text size="sm" className="text-neutral-500">
            Subtotal
          </Text>

          <Text size="sm" className="font-medium text-neutral-900">
            ${(subtotal / 100).toFixed(2)}
          </Text>
        </div>

        <div className="flex items-center justify-between text-sm">
          <Text size="sm" className="text-neutral-500">
            Shipping
          </Text>

          <Text size="sm" className="font-medium text-neutral-900">
            {shipping_total === 0
              ? "Free"
              : `$${(shipping_total / 100).toFixed(2)}`}
          </Text>
        </div>

        <div className="border-t border-neutral-200 pt-4">
          <div className="flex items-center justify-between mt-4">
            <Text size="lg" className="font-medium text-neutral-900">
              Total
            </Text>

            <Text size="lg" className="text-lg font-semibold text-neutral-900">
              ${(total / 100).toFixed(2)}
            </Text>
          </div>
        </div>
      </div>
    </section>
  );
};
