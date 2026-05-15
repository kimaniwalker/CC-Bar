import { josefin } from "@/components/ds/Fonts";

export const OrderDetailsSummary = ({ total, shipping_total, subtotal }: { total: number; shipping_total: number; subtotal: number }) => {
  return (
    <section className="rounded-3xl p-6 shadow-sm bg-white">
    <h2 className={`text-xl font-semibold text-neutral-900 ${josefin.className}`}>
                                                   Order Summary
                                               </h2>

    <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">Subtotal</span>

            <span className="font-medium text-neutral-900">
                ${(subtotal / 100).toFixed(2)}
            </span>
        </div>

        <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">Shipping</span>

            <span className="font-medium text-neutral-900">
                {shipping_total === 0
                    ? "Free"
                    : `$${(shipping_total / 100).toFixed(2)}`}
            </span>
        </div>

        <div className="border-t border-neutral-200 pt-4">
            <div className="flex items-center justify-between mt-4">
                <span className="font-medium text-neutral-900">
                    Total
                </span>

                <span className="text-lg font-semibold text-neutral-900">
                    ${(total / 100).toFixed(2)}
                </span>
            </div>
        </div>
    </div>
</section>)}