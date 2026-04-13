"use client";
import { Text } from "@/components/ds/Text";
import React from "react";
import { useCart } from "../Cart/CartContext";

export default function ProductCount({ id }: { id: number }) {
  const { getCartProductQuantity } = useCart();
  if (!getCartProductQuantity(id)) return;
  return (
    <div className="bg-white w-8 h-8 rounded-full absolute top-0 -right-1 flex justify-center z-10">
      <Text size="sm">{getCartProductQuantity(id)}</Text>
    </div>
  );
}
