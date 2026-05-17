import { DB_TABLES } from "@/types/Database"
import { createClient } from "../Supabase/server"
import { UserRewardsActionsAndAccount } from "@/types/Rewards"

export default async function getUserRewardActions({ user_id }:
    { user_id: string, }) {
    const supabase = await createClient()
    const { data, error } = await supabase.from(DB_TABLES.USER_REWARD_ACTIONS)
    .select(
    `
    *,
    reward_actions (id,key),
    reward_accounts (user_id,id,balance))
    `
    )
        .eq("user_id", user_id)
    .overrideTypes<UserRewardsActionsAndAccount[]>()
    if (error) {
        console.error("Error fetching user reward actions:", error)
        return []
    }
    return data
}