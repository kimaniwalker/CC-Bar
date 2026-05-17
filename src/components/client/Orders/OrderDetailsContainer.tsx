import { getOrderWithProductDetails } from "@/utils/Orders/getOrderWithProductDetails";
import { Suspense } from "react";
import OrderDetailsPage from "./OrderDetailsPage";

export default async function OrderDetailsContainer({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const orderDetails = await getOrderWithProductDetails(id);

    if (!orderDetails) {
        return <div>Order not found.</div>;
    }
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OrderDetailsPage {...orderDetails} />
        </Suspense>
    )
}
