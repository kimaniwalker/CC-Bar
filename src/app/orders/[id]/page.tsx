import OrderDetailsContainer from "@/components/client/Orders/OrderDetailsContainer";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderDetailsContainer params={params} />
    </Suspense>
  );
}
