"use client";
import { Text } from "@/components/ds/Text";
import { useCart } from "../Cart/CartContext";
import { useEffect, useState } from "react";

export default function ProductCount({ id }: { id: string }) {
  const { getCartProductQuantity, isHydrated } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (!isHydrated) return null; // Don't render until cart is hydrated
  const quantity = getCartProductQuantity(id);
  if (quantity === 0) return null;
  return (
    <div className="bg-white w-8 h-8 rounded-full absolute top-0 -right-1 flex justify-center z-10">
      <Text size="sm">{getCartProductQuantity(id)}</Text>
    </div>
  );
}
