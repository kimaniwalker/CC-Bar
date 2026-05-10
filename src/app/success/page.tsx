import SuccessContent from "@/components/client/Success/SuccessContent";
import { CheckoutType } from "@/types/Reservations";
import { Suspense } from "react";


export default async function Success({
    searchParams,
}: {
    searchParams: Promise<{ session_id: string, type: CheckoutType }>;
}) {
    const params = await searchParams;

    return (
        <Suspense fallback={<div className="py-8 flex justify-center w-full"><p>Loading your order details...</p></div>}>
            <SuccessContent searchParams={params} />
        </Suspense>
    );
}