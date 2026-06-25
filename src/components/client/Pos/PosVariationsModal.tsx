"use client";
import { Stack } from "@/components/ds/Stack";
import { useState } from "react";
import { CartProduct, ProductWithOptions } from "@/types/Product";
import { Text } from "@/components/ds/Text";
import { ProductOptionSelector } from "../Shop/ProductOptionSelector";
import { PosAddToCartButton } from "./PosAddToCartButton";

type SelectedOption = {
  groupId: string;
  groupName: string;
  optionId: string | string[];
  optionName: string | string[];
  priceAdjustment: number;
};

type PosVariationsModalProps = {
  product: ProductWithOptions;
  cart: CartProduct[];
  onAddToCart: (item: CartProduct) => void;
};

export default function PosVariationsModal({
  product,
  cart,
  onAddToCart,
}: PosVariationsModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string | string[]>
  >({});

  const optionGroups =
    product.product_option_groups?.filter((group) =>
      group.product_options.some((opt) => opt.active),
    ) ?? [];

  const handleOptionSelect = (groupId: string, optionId: string | string[]) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [groupId]: optionId,
    }));
  };

  // Convert selected option IDs to readable format
  const getReadableSelectedOptions = (): Record<string, SelectedOption> => {
    const readable: Record<string, SelectedOption> = {};

    Object.entries(selectedOptions).forEach(([groupId, optionIds]) => {
      const group = optionGroups.find((g) => g.id === groupId);
      if (!group) return;

      const ids = Array.isArray(optionIds) ? optionIds : [optionIds];
      const options = ids
        .map((id) => group.product_options.find((o) => o.id === id))
        .filter(Boolean);

      const optionNames = options.map((o) => o!.name);
      const totalAdjustment = options.reduce(
        (sum, o) => sum + (o?.price_adjustment ?? 0),
        0,
      );

      readable[group.name] = {
        groupId: group.id,
        groupName: group.name,
        optionId: optionIds,
        optionName: Array.isArray(optionIds) ? optionNames : optionNames[0],
        priceAdjustment: totalAdjustment,
      };
    });

    return readable;
  };

  return (
    <Stack direction="col" gap="md" className="w-full">
      <div className="w-full">
        <Text size="lg" className="font-semibold uppercase md:text-2xl">
          Customize Your Order
        </Text>
      </div>

      <Stack direction="col" gap="md" justify="start" className="w-full">
        {optionGroups.map((group) => (
          <ProductOptionSelector
            key={group.id}
            group={group}
            selectedOptionId={selectedOptions[group.id]}
            onSelect={handleOptionSelect}
          />
        ))}
      </Stack>

      <PosAddToCartButton
        product={product}
        selectedOptions={selectedOptions}
        readableOptions={getReadableSelectedOptions()}
        optionGroups={optionGroups}
        cart={cart}
        onAddToCart={onAddToCart}
      />
    </Stack>
  );
}
