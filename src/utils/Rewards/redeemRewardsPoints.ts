"use server";

import { rewardEngine } from "../Rewards/rewardsEngine";
import { getUser } from "../User/getUser";

export const redeemRewardsPoints = async ({
  points_awarded,
  user_id,
}: {
  points_awarded: number;
  user_id?: string; // ✅ Optional user_id parameter
}) => {
  if (user_id) {
    return rewardEngine.redeem({
      userId: user_id,
      points_awarded,
    });
  }
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  return rewardEngine.redeem({
    userId: user.id,
    points_awarded,
  });
};
