import { Text } from "@/components/ds/Text"
import getRewardsData from "@/utils/server/getRewardsData"
import { BadgeDollarSign } from "lucide-react"
import { cacheTag } from "next/cache"

export const RewardsTracker = async({user_id}:{ user_id: string | undefined}) => {
    const rewardsData = await getRewardsData(user_id)
    const balance = rewardsData && (rewardsData[0]?.balance ?? 0)
    return (
        <div className="rounded-2xl border border-neutral-200 bg-[#F8F5F1] px-5 py-4 text-center relative">
            <Text size="xl" className="text-2xl font-semibold">{balance}</Text>
            <Text size="sm" className="mt-1 text-xs text-neutral-500">Points</Text>
            <BadgeDollarSign fill="#d6e232" className="absolute top-0 -right-2" />
        </div>
    )
}