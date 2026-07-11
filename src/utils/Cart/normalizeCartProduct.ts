import {
  CartProduct,
  Product,
  ProductOptionGroups,
  ProductOptions,
} from "@/types/Product";

type SelectedOption = {
  groupId: string;
  groupName: string;
  optionId: string | string[];
  optionName: string | string[];
  priceAdjustment: number;
};

type NormalizeOptions = {
  quantity?: number;
  selected_options?: Record<string, SelectedOption>;
  product_option_groups?: (ProductOptionGroups & {
    product_options: ProductOptions[];
  })[];
};

export const normalizeCartProduct = (
  product: Product | CartProduct,
  options?: NormalizeOptions,
): CartProduct => {
  const isCartProduct = "quantity" in product;

  return {
    ...product,
    quantity: options?.quantity ?? (isCartProduct ? product.quantity : 1),
    selected_options:
      options?.selected_options ??
      (isCartProduct ? product.selected_options : undefined),
    product_option_groups:
      options?.product_option_groups ??
      (isCartProduct ? product.product_option_groups : undefined),
  } as CartProduct;
};

// Helper to check if a product has options selected
export const hasSelectedOptions = (product: CartProduct): boolean => {
  return !!(
    product.selected_options && Object.keys(product.selected_options).length > 0
  );
};

// Helper to calculate final price with option adjustments
export const calculateProductPrice = (product: CartProduct): number => {
  const basePrice =
    product.on_sale && product.sale_price ? product.sale_price : product.price;

  if (!product.selected_options) {
    return basePrice / 100; // Convert from cents
  }

  const optionAdjustments = Object.values(product.selected_options).reduce(
    (total, option) => total + option.priceAdjustment,
    0,
  );

  return (basePrice + optionAdjustments) / 100; // Convert from cents
};

// Helper to generate a unique cart key for products with different options
export const getCartProductKey = (product: CartProduct): string => {
  if (!product.selected_options) {
    return product.sku;
  }

  // Create a unique key based on SKU + selected options
  const optionsKey = Object.entries(product.selected_options)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([groupName, option]) => {
      const optionIds = Array.isArray(option.optionId)
        ? option.optionId.sort().join(",")
        : option.optionId;
      return `${groupName}:${optionIds}`;
    })
    .join("|");

  return `${product.sku}__${optionsKey}`;
};

// Helper to format selected options for display
export const formatSelectedOptions = (product: CartProduct): string => {
  // Helper function to format group names
  const formatName = (name: string): string => {
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  if (!product.selected_options) {
    return "";
  }

  return Object.values(product.selected_options)
    .map((option) => {
      const names = Array.isArray(option.optionName)
        ? option.optionName.join(", ")
        : option.optionName;
      return `${formatName(option.groupName)}: ${names}`;
    })
    .join(" • ");
};

// Helper to check if two cart products are the same (including options)
export const isSameCartProduct = (
  product1: CartProduct,
  product2: CartProduct,
): boolean => {
  if (product1.sku !== product2.sku) return false;

  const options1 = product1.selected_options || {};
  const options2 = product2.selected_options || {};

  const keys1 = Object.keys(options1).sort();
  const keys2 = Object.keys(options2).sort();

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) => {
    const opt1 = options1[key];
    const opt2 = options2[key];

    if (!opt2) return false;

    // Compare option IDs
    const ids1 = Array.isArray(opt1.optionId)
      ? opt1.optionId.sort()
      : [opt1.optionId];
    const ids2 = Array.isArray(opt2.optionId)
      ? opt2.optionId.sort()
      : [opt2.optionId];

    return (
      ids1.length === ids2.length && ids1.every((id, idx) => id === ids2[idx])
    );
  });
};
