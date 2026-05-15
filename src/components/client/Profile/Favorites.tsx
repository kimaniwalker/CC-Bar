import { getUser } from "@/utils/server/getUser"
import getUserFavorites from "@/utils/server/getUserFavorites"
import Image from "next/image"
import { AddToCartPillButton } from "../Orders/AddToCartPillButton"
import { ProductHeartButton } from "../Favorites/ProductHeartButton"

export const Favorites = async () => {
  const user = await getUser()
  const favorites = await getUserFavorites(user?.id)
      
    return(<section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <div className="flex justify-between">
            <h3 className="text-xl font-semibold">Favorites</h3>
            <button className="text-sm font-medium text-neutral-900 hover:underline">
              View All
            </button>
            </div>
            <p className="mt-1 text-sm text-neutral-500">
              Products you’ve saved for later.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {favorites.slice(0,4).map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-2xl border border-neutral-200 p-4"
            >
              <div className="h-16 w-16 rounded-2xl bg-neutral-100 relative overflow-hidden">
                <Image fill src={item.products.thumbnail} alt={item.products.name} style={{ objectFit: "cover" }} sizes="64px" />
                <ProductHeartButton product_id={item.products.id} className="-top-1 -right-1"/>
              </div>

              <div className="flex-1">
                <p className="font-medium text-neutral-900 line-clamp-2 overflow-ellipsis">
                  {item.products.name}
                </p>

                <p className="mt-1 text-sm text-neutral-500">
                  {item.products.price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
              </div>

             <AddToCartPillButton product={item.products} />
          
            </div>
          ))}
        </div>
      </section>)
}