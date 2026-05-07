
import { Categories, CategorySkeleton } from "@/components/client/Shop/Categories";
import { CategoryBanner, CategoryBannerSkeleton } from "@/components/client/Shop/CategoryBanner";
import ProductGrid from "@/components/client/Shop/ProductGrid";
import ProductGridSkeleton from "@/components/client/Shop/ProductGridSkeleton";
import { getProducts } from "@/utils/server/getProducts";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string, category?: string }>;
}) {
  const params = await searchParams;
  const query = params.query ?? "";
  const selectedCategory = params.category ?? "";
  const products = await getProducts(query);

  return (
    <>
      <Suspense fallback={<CategorySkeleton />}>
        <Categories selectedCategory={selectedCategory} />
      </Suspense>
      <Suspense fallback={<CategoryBannerSkeleton />}>
        <CategoryBanner product_count={products.length} selectedCategory={selectedCategory || query || 'All Products'} />
      </Suspense>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid products={products} />
      </Suspense>
    </>
  );
}