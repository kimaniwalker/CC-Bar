import { josefin } from "@/components/ds/Fonts";
import { OrderItem } from "@/types/Orders";
import { Product } from "@/types/Product";
import Image from "next/image";
import { AddToCartPillButton } from "./AddToCartPillButton";

export const OrderDetailsProducts = ({ products, order_items }: { products: Product[], order_items: OrderItem[] }) => {
    return (
        <section className="rounded-3xl p-6 shadow-sm bg-white flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={`text-xl font-semibold text-neutral-900 ${josefin.className}`}>
                        Purchased Items
                    </h2>

                    <p className="mt-1 text-sm text-neutral-500">
                        Products included in this order.
                    </p>
                </div>
            </div>

            <div className="my-6 space-y-4">
                {products.map((product: Product) => {
                    const orderItem = order_items.find(item => item.product_id === product.id);
                    return (
                        <div
                            key={product.id}
                            className="flex gap-4 rounded-2xl border border-neutral-200 p-5"
                        >
                           <div className="h-24 w-24 shrink-0 rounded-lg overflow-hidden relative">
                                <Image
                                    src={product.thumbnail}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            
                           </div>
                           <div className="min-w-0 flex flex-col flex-1 justify-between gap-4">
                            <div>
                                <p className="font-medium text-neutral-900">
                                    {product.name}
                                </p>
                                <p className="mt-1 text-sm text-neutral-600">
                                    {product.sku}
                                </p>
                                <AddToCartPillButton product={product}  />
                            </div>
                            <div className="flex justify-between">
                                <p className="text-sm font-medium text-neutral-600">
                                    Quantity: {orderItem?.quantity}
                                </p>
                                 <p className="text-sm font-medium text-neutral-600">
                                     ${(orderItem?.price || 0) / 100}
                                 </p>   
                            </div>
                            </div>
                       </div>
                    )
                }

                )}
            </div>
        </section>
    )
}