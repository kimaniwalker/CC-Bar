import { Product } from "@/types/Product"
import { Heart } from "lucide-react"
import Image from "next/image"
import { AddToCartPillButton } from "../Orders/AddToCartPillButton"




export const FavoritesProductCard = ({product}:{product:Product}) => {
   const {id,thumbnail,name,price} = product

    return (
        <div
            key={id}
            className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:shadow-md"
        >
            <button
                type="button"
                className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur transition hover:scale-105"
            >
                <Heart
                    className={`h-5 w-5 transition fill-red-500 text-red-500`}/>
            </button>

            <div className="aspect-square overflow-hidden bg-neutral-100 relative">
                <Image
                    src={thumbnail}
                    alt={name}
                    fill
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
            </div>

            <div className="space-y-1 p-4 flex flex-col ">
                <div>
                <h3 className="line-clamp-1 text-sm font-medium text-neutral-900 ellipsis">
                    {name}
                </h3>
                </div>
                <div className="flex flex-col justify-between mt-1 sm:flex-row gap-2 items-baseline">
                  <p className="text-sm font-semibold text-neutral-700">
                    ${price.toFixed(2)}
                </p>  
                <AddToCartPillButton product={product}/>
                </div>

                
            </div>
        </div>
    )
}