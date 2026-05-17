"use server"
import { RewardActionKey } from "@/types/Rewards";
import { rewardEngine } from "../Rewards/rewardsEngine";
import { getUser } from "../User/getUser";

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