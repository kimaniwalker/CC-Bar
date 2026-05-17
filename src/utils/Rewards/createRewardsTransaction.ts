"use server"

import { RewardsTransactionInsert } from "@/types/Rewards"
import { createClient } from "../Supabase/server"
import { DB_TABLES } from "@/types/Database"

export const createRewardsTransaction = async (rewardsData: RewardsTransactionInsert) => {
    const supabase = await createClient()

    const { data, error } = await supabase.from(DB_TABLES.REWARD_TRANSACTIONS).insert({...rewardsData})

    if (error) throw error;
    return data
}