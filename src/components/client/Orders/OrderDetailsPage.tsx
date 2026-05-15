"use client"
import { OrderWithProducts } from "@/types/Orders";
import { Suspense } from "react";
import { OrderDetailsHeader } from "./OrderDetailsHeader";
import { OrderDetailsSummary } from "./OrderDetailsSummary";
import { OrderDetailsShipping } from "./OrderDetailsShipping";
import { OrderDetailsSupport } from "./OrderDetailsSupport";
import { OrderDetailsProducts} from "./OrderDetailsProducts";



export default function OrderDetailsPage({ products, status, created_at, id, total, shipping_address, shipping_total, subtotal, order_items }: OrderWithProducts) {
    const formattedDate = new Date(created_at).toLocaleDateString(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric",
        }
    );

    return (
        <Suspense fallback={<div>Loading...</div>}>

<div className="min-h-screen bg-neutral-100">
  {/* Header */}
  {/* Main Layout */}
  <div className="mx-auto max-w-7xl flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 justify-center">
  <main className="px-4 py-6">
  <OrderDetailsHeader id={id} status={status} date={formattedDate} />
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-2">
      {/* Left Column - 2/3 */}
      <OrderDetailsProducts products={products} order_items={order_items} />

      {/* Right Column - 1/3 */}
      <aside className="space-y-6 md:col-span-1 lg:col-span-1 xl:col-span-1">
        
      <div className="rounded-2xl bg-white p-6 shadow-sm">
          <OrderDetailsSummary total={total} shipping_total={shipping_total} subtotal={subtotal} />
        </div>

        {shipping_address && (<div className="rounded-2xl bg-white p-6 shadow-sm">
          
            <OrderDetailsShipping shipping_address={shipping_address} />
       
        </div>)}

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          
            <OrderDetailsSupport  />
        
        </div>
      </aside>
    </div>
  </main>
</div>
</div>
        </Suspense>

    );
}