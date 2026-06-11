import { Suspense } from "react";
import CheckoutWrapper from "@/components/client/Checkout/CheckoutWrapper";

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

  return <CheckoutWrapper flow={flow} />;
}

function CheckoutLoadingState() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="animate-pulse">
        <div className="h-12 w-48 bg-neutral-200 rounded-lg mb-8" />
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-4">
            <div className="h-32 bg-neutral-200 rounded-2xl" />
            <div className="h-32 bg-neutral-200 rounded-2xl" />
          </div>
          <div className="h-64 bg-neutral-200 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
