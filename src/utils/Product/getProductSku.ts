import { Product } from "@/types/Product";


export const getProductSku= ({
product,
selectedSize,
selectedColor,
}: {
product: Product
selectedSize?: string;
selectedColor?: string;
}) => {
  const isVariationProduct = product.variations && product.variations.length > 0;
  const selectedVariation = isVariationProduct
    ? product.variations?.find((variation) => {
        const sizeMatch = variation.size ? variation.size === selectedSize : true;
        const colorMatch = variation.color ? variation.color === selectedColor : true;
        return sizeMatch && colorMatch;
      })
    : null;

  if (isVariationProduct) {
    return selectedVariation?.sku || product.sku; // fallback to product SKU if no variation match is found
  }

  return product.sku
};
