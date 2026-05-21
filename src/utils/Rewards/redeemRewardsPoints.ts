"use server";

import { rewardEngine } from "../Rewards/rewardsEngine";
import { getUser } from "../User/getUser";

export const redeemRewardsPoints = async ({
  points_awarded,
}: {
  points_awarded: number;
}) => {
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  return rewardEngine.redeem({
    userId: user.id,
    points_awarded,
  });
};
