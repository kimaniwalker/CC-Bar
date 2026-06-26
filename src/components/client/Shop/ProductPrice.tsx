import { Text } from "@/components/ds/Text";
import { ProductOptionGroups, ProductOptions } from "@/types/Product";

type ProductPriceProps = {
  price: number;
  sale_price?: number;
  on_sale: boolean;
  product_option_groups?: (ProductOptionGroups & {
    product_options: ProductOptions[];
  })[];
};

export const ProductPrice = ({
  price,
  sale_price,
  on_sale,
  product_option_groups,
}: ProductPriceProps) => {
  // Calculate base price
  const basePrice = on_sale && sale_price ? sale_price : price;

  // Get all price adjustments from product options
  const priceAdjustments =
    product_option_groups?.flatMap((group) =>
      group.product_options
        .filter((opt) => opt.active)
        .map((opt) => opt.price_adjustment),
    ) ?? [];

  // If there are price adjustments, show range
  if (
    priceAdjustments.length > 0 &&
    priceAdjustments.some((adj) => adj !== 0)
  ) {
    const minPrice = basePrice + Math.min(...priceAdjustments, 0);
    const maxPrice = basePrice + Math.max(...priceAdjustments, 0);

    if (minPrice !== maxPrice) {
      // Show range when there are different prices
      return (
        <div className="flex items-baseline gap-1">
          <Text size="md" className="font-bold">
            Starting at ${minPrice / 100}
          </Text>
          {on_sale && (
            <Text size="sm" className="text-gray-500 line-through ml-2">
              ${price / 100}
            </Text>
          )}
        </div>
      );
    }
  }

  // Single price (on sale)
  if (on_sale && sale_price) {
    return (
      <div className="flex items-center gap-2">
        <Text size="md" className="text-gray-500 line-through">
          ${price / 100}
        </Text>
        <Text size="md" className="text-red-500 font-bold">
          ${sale_price / 100}
        </Text>
      </div>
    );
  }

  // Single price (regular)
  return (
    <Text size="md" className="font-bold">
      ${price / 100}
    </Text>
  );
};
