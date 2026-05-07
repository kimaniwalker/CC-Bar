import About from "@/components/client/Home/About";
import ProductGridSkeleton from "@/components/client/Shop/ProductGridSkeleton";
import FeaturedProducts from "@/components/server/FeaturedProducts";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <About />
      <Suspense fallback={<ProductGridSkeleton />}>
        <FeaturedProducts />
      </Suspense>
      <About />
    </>
  );
}
