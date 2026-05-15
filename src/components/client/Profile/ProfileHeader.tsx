import { getUser } from "@/utils/server/getUser"
import getUserFavorites from "@/utils/server/getUserFavorites"
import getUserOrders from "@/utils/server/getUserOrders"
import { FavoritesCount } from "./FavoritesCount"

export const ProfileHeader = async() => {

    const user = await getUser()
    const recentOrders = await getUserOrders(user?.id)
    const favorites = await getUserFavorites(user?.id)
    return (
        <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
                    Welcome Back {user?.email}
                  </p>
  
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                    My Account
                  </h2>
  
                  <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-500">
                    Track orders, save your favorite products, and manage your
                    account details.
                  </p>
                </div>
  
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-neutral-200 bg-[#F8F5F1] px-5 py-4 text-center">
                    <p className="text-2xl font-semibold">{recentOrders.length ?? 0}</p>
                    <p className="mt-1 text-xs text-neutral-500">Orders</p>
                  </div>
  
                  <FavoritesCount count={favorites.length} />
  
                  <div className="rounded-2xl border border-neutral-200 bg-[#F8F5F1] px-5 py-4 text-center">
                    <p className="text-2xl font-semibold">1</p>
                    <p className="mt-1 text-xs text-neutral-500">In Transit</p>
                  </div>
                </div>
              </div>
            </div>
    )
}