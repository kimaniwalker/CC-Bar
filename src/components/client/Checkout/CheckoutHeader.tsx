import { Text } from "@/components/ds/Text";
import { ShoppingBag } from "lucide-react";

export const CheckoutHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900">
          <ShoppingBag className="h-6 w-6 text-white" />
        </div>
        <div>
          <Text size="xl" className="font-bold text-neutral-900">
            Checkout
          </Text>
          <Text size="sm" className="text-neutral-600">
            Review your order before completing checkout
          </Text>
        </div>
      </div>
    </div>
  );
};
