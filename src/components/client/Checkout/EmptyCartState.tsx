"use client";

import { Text } from "@/components/ds/Text";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../Cart/CartContext";

export const EmptyCartState = ({
  isVipSubscriptionFlow,
}: {
  isVipSubscriptionFlow: boolean;
}) => {
  const { cart } = useCart();

  if (cart.length > 0 || isVipSubscriptionFlow) {
    return null;
  }

  return (
    <div className="rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 p-12 text-center">
      <ShoppingBag className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
      <Text size="lg" className="font-semibold text-neutral-700 mb-2">
        Your cart is empty
      </Text>
      <Text size="sm" className="text-neutral-600">
        Add some items to get started
      </Text>
    </div>
  );
};
