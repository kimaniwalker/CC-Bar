import HomeBanner from "@/components/client/Home/HomeBanner";
import ProductGridSkeleton from "@/components/client/Shop/ProductGridSkeleton";
import FeaturedProducts from "@/components/server/FeaturedProducts";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <HomeBanner />
      <Suspense fallback={<ProductGridSkeleton />}>
        <FeaturedProducts />
      </Suspense>
    </>
  );
}
