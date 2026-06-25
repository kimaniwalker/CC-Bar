"use client";

import { ImagePicker } from "./ImagePicker";
import { ProductPrice } from "./ProductPrice";
import { ProductTags } from "./ProductTags";
import { ProductAddToCart } from "./ProductAddToCart";
import { Text } from "@/components/ds/Text";
import { ProductWithOptions } from "@/types/Product";

type ProductDetailsContentProps = {
  product: ProductWithOptions;
};

export function ProductDetailsContent({ product }: ProductDetailsContentProps) {
  const {
    name,
    description,
    images,
    tags,
    thumbnail,
    on_sale,
    price,
    sale_price,
    brand,
    id,
    product_option_groups,
  } = product;

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* left col — image */}
        <ImagePicker id={id} images={images || [thumbnail]} alt={name} />

        {/* right col — details */}
        <div className="flex flex-col gap-4">
          <Text size="xl">
            {name} {brand && `- ${brand}`}
          </Text>
          <ProductPrice
            price={price}
            sale_price={sale_price}
            on_sale={on_sale}
            product_option_groups={product_option_groups}
          />
          <ProductTags tags={tags ?? []} />
          <Text size="md">{description}</Text>

          <ProductAddToCart product={product} />
        </div>
      </div>
    </div>
  );
}
