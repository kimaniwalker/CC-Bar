import { getUser } from "@/utils/User/getUser"
import getUserFavorites from "@/utils/Favorites/getUserFavorites"
import getUserOrders from "@/utils/Orders/getUserOrders"
import { FavoritesCount } from "./FavoritesCount"
import { Text } from "@/components/ds/Text"
import { BadgeDollarSign } from 'lucide-react';
import { RewardsTracker } from "./RewardsTracker"
import { Suspense } from "react"

export const ProfileHeader = async () => {

  const user = await getUser()
  const recentOrders = await getUserOrders(user?.id)
  const favorites = await getUserFavorites(user?.id)
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex justify-between flex-col gap-2">
          <Text size="lg" className="text-3xl font-semibold tracking-tight">
            Member Perks
          </Text>

          <Text size="sm" className=" max-w-lg text-sm leading-7 text-neutral-500">
            Welcome Back {user?.email} As a member, enjoy thoughtfully curated rewards and exclusive offers.
          </Text>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-neutral-200 bg-[#F8F5F1] px-5 py-4 text-center">
            <Text size="xl" className="text-2xl font-semibold">{recentOrders.length ?? 0}</Text>
            <Text size="sm" className="mt-1 text-xs text-neutral-500">Orders</Text>
          </div>

          <FavoritesCount count={favorites.length} />

          <Suspense fallback={<div className="rounded-2xl border border-neutral-200 bg-[#F8F5F1] px-5 py-4 text-center relative animate-pulse flex flex-col items-center justify-center">
            <div className="h-[36px] w-[54px] bg-neutral-300 rounded mb-2 mx-auto"></div>
            <div className="h-[16px] w-[54px] bg-neutral-300 rounded mx-auto"></div>
            <BadgeDollarSign fill="#d6e232" className="absolute top-0 -right-2" />
          </div>}>

            <RewardsTracker user_id={user?.id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}