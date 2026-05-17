"use server"

import { RewardAccount, RewardTransaction } from "@/types/Rewards";
import { createClient } from "../Supabase/server"

type RewardsData = RewardAccount & {
    reward_transactions: RewardTransaction[]
}
export default async function getRewardsData(userId?: string): Promise<RewardsData[] | null> {
    if (!userId) return null;
    const supabase = await createClient()

    const { data, error } = await supabase
  .from("reward_accounts")
  .select(`
    *,
    reward_transactions (*)
  `)
  .eq("user_id", userId)
  .overrideTypes<RewardsData[]>()

if (error) throw error;


    if (error) {
        console.error("Error fetching reward account:", error);
        return null;
    }
    return data
}

