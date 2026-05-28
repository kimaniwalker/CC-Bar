import { completeRewardAction } from "@/utils/Rewards/completeRewardAction";
import { redeemRewardsPoints } from "@/utils/Rewards/redeemRewardsPoints";
import { RewardActionKey } from "@/types/Rewards";

export async function withRewards(
  rewardKey: RewardActionKey,
  operation: () => Promise<void>,
  user_id?: string,
  idempotency_key?: string,
) {
  // Execute main operation first
  await operation();

  // Skip rewards for guest users
  if (user_id === "guest") {
    console.log("⏭️ Skipping rewards for guest user");
    return null;
  }

  // Award points (non-blocking)
  try {
    const rewardData = await completeRewardAction(rewardKey, {
      user_id,
      idempotency_key,
    });
    console.log({ rewardData });
    if (rewardData.data?.success && !rewardData.data?.already_completed) {
      await redeemRewardsPoints({
        points_awarded: rewardData.data.reward_amount,
        user_id,
      });
      console.log(`✅ Awarded ${rewardData.data.reward_amount} points`);
    }
    if (rewardData.data?.already_completed) {
      console.log(
        `⚠️ Reward action "${rewardKey}" already completed for user ${user_id}`,
      );
    } else if (!rewardData.data?.success) {
      console.warn(
        `⚠️ Reward action "${rewardKey}" did not complete successfully for user ${user_id}. There was a error - ${rewardData.error?.message}`,
      );
    }
    return rewardData;
  } catch (error) {
    console.error("⚠️ Failed to award points:", error);
    return null;
  }
}
