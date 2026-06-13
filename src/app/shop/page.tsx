import {
  Categories,
  CategorySkeleton,
} from "@/components/client/Shop/Categories";
import {
  CategoryBanner,
  CategoryBannerSkeleton,
} from "@/components/client/Shop/CategoryBanner";
import ProductGrid from "@/components/client/Shop/ProductGrid";
import ProductGridSkeleton from "@/components/client/Shop/ProductGridSkeleton";
import { ProductFilters } from "@/components/client/Shop/ProductFilters";
import { getProducts } from "@/utils/Shop/getProducts";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    category?: string;
    sort?: string;
    price?: string;
    scent?: string;
    size?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params.query ?? "";
  const selectedCategory = params.category ?? "";
  const sort = params.sort ?? "";

  const products = await getProducts(query, sort, {
    price: params.price,
    scent: params.scent,
    size: params.size,
  });

  return (
    <>
      <Suspense fallback={<CategorySkeleton />}>
        <Categories selectedCategory={selectedCategory} />
      </Suspense>
      <Suspense fallback={<CategoryBannerSkeleton />}>
        <CategoryBanner
          product_count={products.length}
          selectedCategory={selectedCategory || query || "All Products"}
        />
      </Suspense>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter + Product Grid Layout */}
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8 xl:gap-12">
          {/* Filters Sidebar */}
          <aside className="mb-8 lg:mb-0">
            <ProductFilters />
          </aside>

          {/* Products */}
          <main className="min-w-0">
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid products={products} />
            </Suspense>
          </main>
        </div>
      </div>
    </>
  );
}
