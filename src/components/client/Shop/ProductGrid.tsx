"use client";

import { Text } from "@/components/ds/Text";
import ProductCard from "./ProductCard";
import { Product } from "@/types/Product";

type ProductList = {
  products: Product[];
  heading?: string;
};

export default function ProductGrid({ products, heading }: ProductList) {
  return (
    <div className="bg-white">
      <div className="w-full mx-auto max-w-2xl px-4  sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>
        {heading && (
          <Text size="lg" className="mb-6">
            {heading}
          </Text>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(240px,calc(25%-1.5rem)))] gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
}
