import SuccessContent from "@/components/client/Success/SuccessContent";
import { Suspense } from "react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmation",
  description:
    "Thank you for your order! Your order has been successfully placed. You will receive an email confirmation shortly.",
};
export default async function Success() {
  return (
    <Suspense
      fallback={
        <div className="py-8 flex justify-center w-full">
          <p>Loading your order details...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
