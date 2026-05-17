import OrderDetailsContainer from "@/components/client/Orders/OrderDetailsContainer";
import OrderDetailsPage from "@/components/client/Orders/OrderDetailsPage";
import { getOrderWithProductDetails } from "@/utils/Orders/getOrderWithProductDetails";
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
