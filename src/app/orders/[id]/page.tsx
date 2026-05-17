import OrderDetailsPage from "@/components/client/Orders/OrderDetailsPage";
import { getOrderWithProductDetails } from "@/utils/Orders/getOrderWithProductDetails";
import { Suspense } from "react";


export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderDetails = await getOrderWithProductDetails(id);
  if (!orderDetails?.id) return <div>Order not found.</div>;
  return (
    <Suspense fallback={<div>Loading order details...</div>}>
      <OrderDetailsPage {...orderDetails} />
    </Suspense>
  );
}
