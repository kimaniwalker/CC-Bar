import HomePageBanner from "@/components/client/Home/HomePageBanner";
import HowItWorks from "@/components/client/Home/HowItWorks";
import SignUpBanner from "@/components/client/Home/SignUpBanner";
import { TrustBanner } from "@/components/client/Home/TrustBanner";
import ProductGridSkeleton from "@/components/client/Shop/ProductGridSkeleton";
import FeaturedProducts from "@/components/server/FeaturedProducts";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <HomePageBanner />
      <TrustBanner />
      <Suspense fallback={<ProductGridSkeleton />}>
        <div className="my-12">
          <FeaturedProducts heading="(BYO) - Build Your Own" />
        </div>
      </Suspense>
      <HowItWorks />
      <SignUpBanner />
    </>
  );
}
