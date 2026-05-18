import { Product } from "@/types/Product";
import { getSelectedVariation } from "./getSelectedVariation";

// ...existing code...
export const getProductSku = ({
  product,
  selectedSize,
  selectedColor,
}: {
  product: Product;
  selectedSize?: string;
  selectedColor?: string;
}) => {
  const isVariationProduct =
    product.variations && product.variations.length > 0;
  const selectedVariation = getSelectedVariation({
    product,
    selectedSize,
    selectedColor,
  });

  if (isVariationProduct) {
    return selectedVariation?.sku || product.sku;
  }

  return product.sku;
};
