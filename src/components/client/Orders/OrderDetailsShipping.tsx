import { Text } from "@/components/ds/Text";

export const OrderDetailsShipping = ({
  shipping_address,
}: {
  shipping_address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}) => {
  const { line1, line2, city, state, postal_code, country } = shipping_address;
  if (!shipping_address) return null;
  return (
    <section className="rounded-3xl p-6 shadow-sm border border-neutral-200 bg-white flex flex-col">
      <Text size="xl" className={`text-xl font-semibold text-neutral-900`}>
        Shipping Details
      </Text>

      <div className="mt-4 space-y-1 text-sm leading-6 text-neutral-600">
        <Text size="sm">{line1}</Text>

        {line2 && <Text size="sm">{line2}</Text>}

        <Text size="sm">
          {city}, {state} {postal_code}
        </Text>

        <Text size="sm">{country}</Text>
      </div>
    </section>
  );
};
