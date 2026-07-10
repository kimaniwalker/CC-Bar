import { Suspense } from "react";
import CheckoutWrapper from "@/components/client/Checkout/CheckoutWrapper";
import { CheckoutLoadingState } from "@/components/client/Checkout/CheckoutLoadingState";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Proceed to checkout and complete your purchase of luxury candles, soaps, body care, and home fragrances.",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ flow?: string }>;
}) {
  return (
    <Suspense fallback={<CheckoutLoadingState />}>
      <CheckoutPageContent searchParams={searchParams} />
    </Suspense>
  );
}

async function CheckoutPageContent({
  searchParams,
}: {
  searchParams: Promise<{ flow?: string }>;
}) {
  const { flow } = await searchParams;
  console.log("CheckoutPageContent", { flow });

  return <CheckoutWrapper />;
}
