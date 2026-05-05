import { CategorySkeleton } from "@/components/client/Shop/Categories";
import { CategoryBannerSkeleton } from "@/components/client/Shop/CategoryBanner";
import ProductGridSkeleton from "@/components/client/Shop/ProductGridSkeleton";

export default function Loading() {
  return (<>
  <CategorySkeleton />
  <CategoryBannerSkeleton />
  <ProductGridSkeleton />
  
  </>
  );
}
