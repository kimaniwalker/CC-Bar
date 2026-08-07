"use client";

import {
  CartProduct,
  ProductWithOptions,
  ProductOptionGroups,
  ProductOptions,
} from "@/types/Product";
import { montserrat } from "@/components/ds/Fonts";
import { Text } from "@/components/ds/Text";
import { useModal } from "../ModalContext";
import { useMemo } from "react";
import {
  calculateProductPrice,
  isSameCartProduct,
} from "@/utils/Cart/normalizeCartProduct";

type SelectedOption = {
  groupId: string;
  groupName: string;
  optionId: string | string[];
  optionName: string | string[];
  priceAdjustment: number;
};

type PosAddToCartButtonProps = {
  product: ProductWithOptions;
  selectedOptions: Record<string, string | string[]>;
  readableOptions: Record<string, SelectedOption>;
  optionGroups: (ProductOptionGroups & { product_options: ProductOptions[] })[];
  cart: CartProduct[];
  onAddToCart: (item: CartProduct) => void;
};

export const PosAddToCartButton = ({
  product,
  selectedOptions,
  readableOptions,
  optionGroups,
  cart,
  onAddToCart,
}: PosAddToCartButtonProps) => {
  const { close } = useModal();

  const hasRequiredSelections = optionGroups.every((group) => {
    if (group.required === false) return true;
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
  const cartProductQuantity = existingCartItem?.quantity ?? 0;
  const hasCartQuantity = cartProductQuantity > 0;

  // Calculate price with current selections
  const finalPrice = calculateProductPrice(cartProduct);

  const canAddToCart = hasRequiredSelections && product.stock > 0;

  const handleAddToCart = () => {
    if (!canAddToCart) return;

    onAddToCart(cartProduct);
    close();
  };

  if (product.stock === 0) {
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

  return (
    <button
      disabled={!canAddToCart}
      onClick={handleAddToCart}
      className={`mt-4 bg-black text-white px-4 py-2 rounded-xl disabled:bg-gray-400 w-full hover:bg-gray-800 transition ${montserrat.className}`}
    >
      <Text size="md" as="span" className="font-semibold text-sm">
        {hasCartQuantity
          ? `Add Another - $${finalPrice.toFixed(2)}`
          : `Add to Order - $${finalPrice.toFixed(2)}`}
      </Text>
    </button>
  );
};
