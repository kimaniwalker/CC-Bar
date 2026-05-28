"use client";
import { Stack } from "@/components/ds/Stack";
import { useEffect, useState } from "react";
import { CartProduct, Product } from "@/types/Product";
import { Text } from "@/components/ds/Text";
import { ProductVariationTag } from "../Shop/ProductVariationTag";
import { PosAddToCartButton } from "./PosAddToCartButton";

type ProductVariationsModal = {
  product: Product;
  cart: CartProduct[];
  onAddToCart: (item: CartProduct) => void;
};
export default function PosVariationsModal({
  product,
  cart,
  onAddToCart,
}: ProductVariationsModal) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    setSelectedSize("");
    setSelectedColor("");
  }, [product.id]);

  const { available_colors, available_sizes } = product;

  const getModalHeading = () => {
    if (available_colors && available_sizes) {
      return "Select Size and Color";
    } else if (available_sizes) {
      return "Select Size";
    } else if (available_colors) {
      return "Select Color";
    } else {
      return "Product Details";
    }
  };

  return (
    <Stack direction="col" gap="md" className={`w-full`}>
      <div className="w-full">
        <Text size="lg" className={`font-semibold uppercase md:text-2xl`}>
          {getModalHeading()}
        </Text>
      </div>
      <Stack direction="col" gap="md" justify="start" className="w-full">
        <ProductVariationTag
          variation={available_sizes ?? []}
          heading="Available Sizes"
          selectedVariant={selectedSize}
          handleOnClick={(value) => setSelectedSize(value)}
        />
        <ProductVariationTag
          variation={available_colors ?? []}
          heading="Available Colors"
          selectedVariant={selectedColor}
          handleOnClick={(value) => setSelectedColor(value)}
        />
      </Stack>
      {/* Add to Cart Button can go here, but for POS we might want a different flow, like "Add to Order" */}
      <PosAddToCartButton
        product={product}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        cart={cart}
        onAddToCart={onAddToCart}
      />
    </Stack>
  );
}
