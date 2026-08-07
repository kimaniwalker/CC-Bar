"use client";

import { Stack } from "@/components/ds/Stack";
import { useState, useMemo, useCallback } from "react";
import { ProductOptionSelector } from "./ProductOptionSelector";
import { AddToCartButton } from "./ProductAddToCart";
import { Product, ProductOptionGroups, ProductOptions } from "@/types/Product";
import { Text } from "@/components/ds/Text";
import { montserrat } from "@/components/ds/Fonts";
import Image from "next/image";
import { calculateProductPrice } from "@/utils/Cart/normalizeCartProduct";

type ProductWithOptions = Product & {
  product_option_groups?: (ProductOptionGroups & {
    product_options: ProductOptions[];
  })[];
};

type ProductVariationsModalProps = {
  product: ProductWithOptions;
};

type SelectedOption = {
  groupId: string;
  groupName: string;
  optionId: string | string[];
  optionName: string | string[];
  priceAdjustment: number;
};

export default function ProductVariationsModal({
  product,
}: ProductVariationsModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string | string[]>
  >({});

  const optionGroups = useMemo(
    () =>
      product.product_option_groups?.filter((group) =>
        group.product_options.some((opt) => opt.active),
      ) ?? [],
    [product.product_option_groups],
  );

  const handleOptionSelect = (groupId: string, optionId: string | string[]) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [groupId]: optionId,
    }));
  };

  // Convert selected option IDs to readable format
  const getReadableSelectedOptions = useCallback((): Record<
    string,
    SelectedOption
  > => {
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
  }, [selectedOptions, optionGroups]);

  // Calculate current price with selected options
  const currentPrice = useMemo(() => {
    const readableOptions = getReadableSelectedOptions();
    return calculateProductPrice({
      ...product,
      selected_options: readableOptions,
      quantity: 1,
    });
  }, [product, getReadableSelectedOptions]);

  // Generate dynamic heading based on option groups
  const getModalHeading = () => {
    if (optionGroups.length === 0) return "Customize Your Order";

    if (optionGroups.length === 1) {
      return `Select ${optionGroups[0].name}`;
    }

    if (optionGroups.length === 2) {
      return `Select ${optionGroups[0].name} & ${optionGroups[1].name}`;
    }

    // For 3+ option groups
    return "Customize Your Order";
  };

  return (
    <div className="w-full flex flex-col max-h-[80vh]">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-4">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-start gap-4 mb-4">
            {/* Product Image */}
            {product.thumbnail && (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                <Image
                  src={product.thumbnail}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Product Info */}
            <div className="flex-1">
              <Text
                size="xl"
                className={`font-bold mb-1 ${montserrat.className}`}
              >
                {product.name}
              </Text>
              <div className="flex items-baseline gap-2">
                {product.brand && (
                  <Text size="sm" className="text-gray-600">
                    {product.brand}
                  </Text>
                )}
                <Text size="lg" className={`font-bold ${montserrat.className}`}>
                  ${currentPrice.toFixed(2)}
                </Text>
              </div>
            </div>
          </div>

          {/* Modal Title */}
          <div className="border-b border-gray-200 pb-3">
            <Text
              size="lg"
              className={`font-semibold text-gray-900 ${montserrat.className}`}
            >
              {getModalHeading()}
            </Text>
          </div>
        </div>

        {/* Options Section */}
        <Stack direction="col" gap="lg" justify="start" className="w-full mb-2">
          {optionGroups.map((group) => (
            <ProductOptionSelector
              key={group.id}
              group={group}
              selectedOptionId={selectedOptions[group.id]}
              onSelect={handleOptionSelect}
            />
          ))}
        </Stack>
      </div>

      {/* Add to Cart Button - pinned footer */}
      <div className="-mx-6 -mb-6 p-6 bg-white border-t border-gray-200 rounded-b-3xl shrink-0">
        <AddToCartButton
          product={product}
          selectedOptions={selectedOptions}
          readableOptions={getReadableSelectedOptions()}
          optionGroups={optionGroups}
        />
      </div>
    </div>
  );
}
