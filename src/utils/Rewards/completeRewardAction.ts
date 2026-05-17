"use server"
import { RewardActionKey } from "@/types/Rewards";
import { getUser } from "./getUser";
import { rewardEngine } from "../Rewards/rewardsEngine";

export const completeRewardAction = async (actionKey:RewardActionKey) => { 
    const user = await getUser()
    if (!user) {
        throw new Error("User not authenticated")
    }
    return rewardEngine.completeAction({
        userId: user.id,
        actionKey
    })
}