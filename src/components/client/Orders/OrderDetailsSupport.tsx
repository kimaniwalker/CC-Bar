import { Text } from "@/components/ds/Text";

export const OrderDetailsSupport = () => {
  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-6 flex flex-col items-start gap-1">
      <Text className={`text-xl font-semibold text-neutral-900`}>
        Need Help ?
      </Text>

      <Text size="sm" className="mt-2 text-sm leading-6 text-neutral-600">
        Questions about your order or shipment? Reach out and we’ll be happy to
        help.
      </Text>

      <button className="mt-5 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90">
        <Text size="sm">Contact Support</Text>
      </button>
    </section>
  );
};
