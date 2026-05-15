import { Product } from "@/types/Product"
import Image from "next/image"
import { AddToCartPillButton } from "../Orders/AddToCartPillButton"
import { ProductHeartButton } from "./ProductHeartButton"





export const FavoritesProductCard = ({product}:{product:Product}) => {
   const {id,thumbnail,name,price} = product
  

    return (
        <div
            key={id}
            className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:shadow-md"
        >

            <div className="aspect-square overflow-hidden bg-neutral-100 relative">
            <ProductHeartButton product_id={id} />
                <Image
                    src={thumbnail}
                    alt={name}
                    fill
                    sizes="(min-width:1280px) 25vw, (min-width:1024px) 33.33vw, (min-width:640px) 50vw, 50vw"
                    className="h-full w-full object-cover transition duration-300 
                    group-hover:scale-105"
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