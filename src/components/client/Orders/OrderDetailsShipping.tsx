import { josefin } from "@/components/ds/Fonts";

export const OrderDetailsShipping = ({ shipping_address }: { shipping_address: { line1: string, line2?: string, city: string, state: string, postal_code: string, country: string } }) => {
    const { line1, line2, city, state, postal_code, country } = shipping_address;
    if (!shipping_address) return null;
    return (<section className="rounded-3xl p-6 shadow-sm border border-neutral-200 bg-white flex flex-col">
        <h2 className={`text-xl font-semibold text-neutral-900 ${josefin.className}`}>
            Shipping Details
        </h2>

        <div className="mt-4 space-y-1 text-sm leading-6 text-neutral-600">
            <p>{line1}</p>

            {line2 && (
                <p>{line2}</p>
            )}

            <p>
                {city},{" "}
                {state}{" "}
                {postal_code}
            </p>

            <p>{country}</p>
        </div>
    </section>)
}