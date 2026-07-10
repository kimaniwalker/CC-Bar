import {
  Categories,
  CategorySkeleton,
} from "@/components/client/Shop/Categories";
import ProductGridSkeleton from "@/components/client/Shop/ProductGridSkeleton";
import { montserrat } from "@/components/ds/Fonts";
import { Text } from "@/components/ds/Text";
import FeaturedProducts from "@/components/server/FeaturedProducts";
import { ProductReviews } from "@/components/server/ProductReviews";
import { getProductDetails } from "@/utils/Shop/getProductDetails";
import { Suspense } from "react";

import { notFound } from "next/navigation";
import { ProductDetailsContent } from "@/components/client/Shop/ProductDetailsContent";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { id: product_id } = await params;
  const productDetails = await getProductDetails(product_id);

  // Handle product not found
  if (!productDetails || productDetails.length === 0) {
    notFound();
  }

  const product = productDetails[0];

  return {
    title: product.name,
    description: product.description,

    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.thumbnail],
    },
  };
}

export default async function ProductDetails({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ category: string }>;
}) {
  const { id: product_id } = await params;
  const { category: selectedCategory } = await searchParams;

  const productDetails = await getProductDetails(product_id);

  // Handle product not found
  if (!productDetails || productDetails.length === 0) {
    notFound();
  }

  const product = productDetails[0];

  return (
    <>
      <Suspense fallback={<CategorySkeleton />}>
        <Categories selectedCategory={selectedCategory} />
      </Suspense>

      <ProductDetailsContent product={product} />

      <div
        className={`w-full max-w-7xl mx-auto p-4 md:p-8 ${montserrat.className}`}
      >
        <Suspense fallback={<ProductGridSkeleton />}>
          <FeaturedProducts heading="You might also like" />
        </Suspense>
      </div>

      <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
        <Text size="lg" className="mb-6">
          Customer Reviews
        </Text>
        <Suspense fallback={<div>Loading reviews...</div>}>
          <ProductReviews product_id={product.id} />
        </Suspense>
      </div>
    </>
  );
}
