"use server";
import { RewardActionKey } from "@/types/Rewards";
import { rewardEngine } from "../Rewards/rewardsEngine";
import { getUser } from "../User/getUser";

export async function completeRewardAction(
  actionKey: RewardActionKey,
  options?: { user_id?: string },
) {
  // Early return if user_id is provided
  if (options?.user_id) {
    console.log(
      `✅ Completing reward action "${actionKey}" for user ${options.user_id}`,
    );
    return rewardEngine.completeAction({
      userId: options.user_id,
      actionKey,
    });
  }

  // Otherwise, get authenticated user
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  console.log(
    `✅ Completing reward action "${actionKey}" for authenticated user ${user.id}`,
  );
  return rewardEngine.completeAction({
    userId: user.id,
    actionKey,
  });
}
