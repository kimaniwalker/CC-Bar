"use client";

import { Text } from "@/components/ds/Text";
import ProductCard from "./ProductCard";
import { Product } from "@/types/Product";
import { PackageOpen, Search } from "lucide-react";

type ProductList = {
  products: Product[];
  heading?: string;
};

export default function ProductGrid({ products, heading }: ProductList) {
  // Empty state
  if (products.length === 0) {
    return (
      <div className="bg-white">
        <div className="w-full">
          {heading && (
            <Text size="lg" className="mb-6">
              {heading}
            </Text>
          )}

          <div className="flex flex-col items-center justify-center py-16 sm:py-24">
            <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
              <PackageOpen className="w-10 h-10 text-neutral-400" />
            </div>

            <Text size="lg" className="font-bold text-neutral-900 mb-2">
              No Products Found
            </Text>

            <Text
              size="sm"
              className="text-neutral-600 text-center max-w-md mb-6"
            >
              We couldn&apos;t find any products matching your criteria. Try
              adjusting your filters or search terms.
            </Text>

            <button
              onClick={() => (window.location.href = "/shop")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition"
            >
              <Search className="w-4 h-4" />
              Browse All Products
            </button>
          </div>
        </div>
      </div>
    );
  }

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
