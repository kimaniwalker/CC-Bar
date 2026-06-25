"use client";

import { montserrat } from "@/components/ds/Fonts";
import {
  Product,
  ProductAvailabilityStatus,
  ProductOptionGroups,
  ProductOptions,
} from "@/types/Product";
import { useState, useMemo } from "react";
import { useCart } from "../Cart/CartContext";
import { ProductStockStatus } from "./ProductStockStatus";
import { Text } from "@/components/ds/Text";
import { ProductOptionSelector } from "./ProductOptionSelector";
import {
  calculateProductPrice,
  getCartProductKey,
  isSameCartProduct,
} from "@/utils/Cart/normalizeCartProduct";

type ProductWithOptions = Product & {
  product_option_groups?: (ProductOptionGroups & {
    product_options: ProductOptions[];
  })[];
};

type SelectedOption = {
  groupId: string;
  groupName: string;
  optionId: string | string[];
  optionName: string | string[];
  priceAdjustment: number;
};

export const ProductAddToCart = ({
  product,
}: {
  product: ProductWithOptions;
}) => {
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
    <div className="flex flex-col gap-4">
      {optionGroups.map((group) => (
        <ProductOptionSelector
          key={group.id}
          group={group}
          selectedOptionId={selectedOptions[group.id]}
          onSelect={handleOptionSelect}
        />
      ))}

      <AddToCartButton
        product={product}
        selectedOptions={selectedOptions}
        readableOptions={getReadableSelectedOptions()}
        optionGroups={optionGroups}
      />
    </div>
  );
};

export const AddToCartButton = ({
  product,
  selectedOptions,
  readableOptions,
  optionGroups,
}: {
  product: ProductWithOptions;
  selectedOptions: Record<string, string | string[]>;
  readableOptions: Record<string, SelectedOption>;
  optionGroups: (ProductOptionGroups & { product_options: ProductOptions[] })[];
}) => {
  const { addToCart, removeFromCart, cart } = useCart();

  const getStockStatus = (stock: number): ProductAvailabilityStatus => {
    if (stock === null || stock === undefined || stock <= 0) {
      return ProductAvailabilityStatus.OUT_OF_STOCK;
    }
    if (stock <= 10) return ProductAvailabilityStatus.LOW_STOCK;
    return ProductAvailabilityStatus.IN_STOCK;
  };

  const hasRequiredSelections = optionGroups.every((group) => {
    const selection = selectedOptions[group.id];
    if (group.selection_type === "single") {
      return typeof selection === "string" && selection.length > 0;
    }
    if (group.selection_type === "multiple") {
      return Array.isArray(selection) && selection.length > 0;
    }
    return true;
  });

  // Create the cart product with current selections
  const cartProduct = useMemo(
    () => ({
      ...product,
      selected_options: hasRequiredSelections ? readableOptions : undefined,
      quantity: 1,
    }),
    [product, readableOptions, hasRequiredSelections],
  );

  // Find if THIS EXACT product + options combo is in cart
  const existingCartItem = cart.find((item) =>
    isSameCartProduct(item, cartProduct),
  );
  const cartKey = existingCartItem ? getCartProductKey(existingCartItem) : null;
  const cartProductQuantity = existingCartItem?.quantity ?? 0;
  const hasCartQuantity = cartProductQuantity > 0;

  // Calculate price with current selections
  const finalPrice = calculateProductPrice(cartProduct);

  const activeStock = product.stock ?? 0;
  const product_availability_status = getStockStatus(activeStock);
  const canAddMoreToCart = cartProductQuantity < activeStock;
  const canAddToCart =
    hasRequiredSelections &&
    product_availability_status !== ProductAvailabilityStatus.OUT_OF_STOCK &&
    canAddMoreToCart;

  if (
    hasRequiredSelections &&
    product_availability_status === ProductAvailabilityStatus.OUT_OF_STOCK
  ) {
    return (
      <button
        disabled
        className={`mt-4 bg-gray-400 text-white px-4 py-2 rounded-xl cursor-not-allowed ${montserrat.className}`}
      >
        <Text size="sm" as="span">
          Out of Stock
        </Text>
      </button>
    );
  }

  if (hasCartQuantity && cartKey) {
    return (
      <>
        <ProductStockStatus
          stock={activeStock}
          hideStatus={!hasRequiredSelections}
        />
        <div
          className={`mt-2 flex items-center gap-3 ${montserrat.className} p-2 border-2 rounded-full justify-between w-full`}
        >
          <button
            onClick={() => removeFromCart(cartKey)}
            className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-lg hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!hasCartQuantity}
          >
            −
          </button>
          <span className="text-lg font-semibold text-center">
            {cartProductQuantity} {cartProductQuantity === 1 ? "item" : "items"}{" "}
            in cart
          </span>
          <button
            onClick={() => addToCart(cartProduct)}
            className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-lg hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!canAddToCart}
          >
            +
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <ProductStockStatus
        stock={activeStock}
        hideStatus={!hasRequiredSelections}
      />
      <button
        disabled={!canAddToCart}
        onClick={() => addToCart(cartProduct)}
        className={`mt-4 bg-black text-white px-4 py-2 rounded-xl disabled:bg-gray-400 w-full ${montserrat.className}`}
      >
        <Text size="md" as="span" className="font-semibold text-sm">
          Add to Cart - ${finalPrice.toFixed(2)}
        </Text>
      </button>
    </>
  );
};
