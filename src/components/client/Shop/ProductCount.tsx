"use client";
import { Text } from "@/components/ds/Text";
import { useCart } from "../Cart/CartContext";
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";

export default function ProductCount({ id }: { id: string }) {
  const { getCartProductQuantity, isHydrated } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isHydrated) return null;

  const quantity = getCartProductQuantity(id);
  if (quantity === 0) return null;

  return (
    <div className="flex items-center gap-1 bg-black text-white px-4 py-2 rounded-full shadow-md z-10 absolute top-2 left-2">
      <ShoppingCart className="w-3 h-3" />
      <Text size="xs" className="font-semibold">
        {quantity}
      </Text>
    </div>
  );
}
