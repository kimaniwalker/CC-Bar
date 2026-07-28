import PosContent from "@/components/client/Pos/PosContent";
import { getProducts } from "@/utils/Shop/getProducts";
import { Suspense } from "react";

async function PosData() {
  const products = await getProducts(undefined, undefined, {
    excludeTypes: ["byo"],
  });
  return <PosContent products={products} />;
}

export default function Page() {
  return (
    <Suspense fallback={<PosLoadingSkeleton />}>
      <PosData />
    </Suspense>
  );
}

function PosLoadingSkeleton() {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-neutral-100 lg:grid-cols-[1fr_400px]">
      <div className="flex flex-col p-6">
        <div className="h-8 w-48 bg-neutral-200 rounded animate-pulse mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-64 bg-neutral-200 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
      <div className="bg-white p-6 border-l border-neutral-200">
        <div className="h-8 w-32 bg-neutral-200 rounded animate-pulse mb-4" />
      </div>
    </div>
  );
}
