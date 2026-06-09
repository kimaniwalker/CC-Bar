import CheckoutContent from "@/components/client/Checkout/CheckoutContent";
import { Suspense } from "react";

export default async function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Suspense>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
