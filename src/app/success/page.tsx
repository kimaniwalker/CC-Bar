
import SuccessContent from "@/components/client/Success/SuccessContent";
import { Suspense } from "react";


export default async function Success() {

    return (
        <Suspense fallback={<div className="py-8 flex justify-center w-full"><p>Loading your order details...</p></div>}>
            <SuccessContent />
        </Suspense>
    );
}