import { Product, ProductVariation } from "@/types/Product";

export const getSelectedVariation = ({
  product,
  selectedSize,
  selectedColor,
}: {
  product: Product;
  selectedSize?: string;
  selectedColor?: string;
}): ProductVariation | null => {
  const isVariationProduct =
    product.variations && product.variations.length > 0;

  if (!isVariationProduct) {
    return null;
  }

  const selectedVariation = product.variations?.find((variation) => {
    // If both are selected, both must match
    if (selectedSize && selectedColor) {
      return (
        variation.size === selectedSize && variation.color === selectedColor
      );
    }
    // If only size is selected, match by size
    if (selectedSize) {
      return variation.size === selectedSize;
    }
    // If only color is selected, match by color
    if (selectedColor) {
      return variation.color === selectedColor;
    }
    // If neither is selected, return first variation
    return true;
  });

  return selectedVariation || null;
};
