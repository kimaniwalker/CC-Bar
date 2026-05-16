import { josefin, montserrat } from "@/components/ds/Fonts"
import { Text } from "@/components/ds/Text";
const statusStyles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    preparing: "bg-orange-100 text-orange-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    refunded: "bg-red-100 text-red-800",
};

export const OrderDetailsHeader = ({id, date, status}: {id: string, date: string, status: string}) => {
    return (
   
                                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between rounded-3xl bg-white p-6 shadow-sm my-4">
                                    <div>
                                        <Text size="xl" className={`text-xl font-medium tracking-wide`}>
                                            Order Details
                                        </Text>

                                        <Text size="sm" className={`mt-2 text-sm font-semibold text-neutral-500`}>
                                            Order: {id.slice(0, 8)}
                                        </Text>

                                        <Text size="sm" className="mt-3 text-sm text-neutral-500">
                                            Placed on {date}
                                        </Text>
                                        <div>
                                            <Text as="span" size="sm" className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium uppercase ${statusStyles[status] || "bg-gray-100 text-gray-800 uppercase"}`}>
                                                {status}
                                            </Text>
                                        </div>
                                        
                                    </div>

                                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">


                                        <button className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-100">
                                            <Text size="sm" as="span">Reorder</Text>
                                        </button>
                                    </div>
                                </div>
                          
    )
}