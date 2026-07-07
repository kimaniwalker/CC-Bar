import { Suspense } from "react";
import CheckoutWrapper from "@/components/client/Checkout/CheckoutWrapper";
import { CheckoutLoadingState } from "@/components/client/Checkout/CheckoutLoadingState";

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
