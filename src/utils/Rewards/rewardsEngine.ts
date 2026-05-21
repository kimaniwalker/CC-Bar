import { RewardActionKey } from "@/types/Rewards";
import { createClient } from "../supabase/server";

export const rewardEngine = {
  async completeAction({
    userId,
    actionKey,
  }: {
    userId: string;
    actionKey: RewardActionKey;
  }) {
    const supabase = await createClient();
    return supabase.rpc("complete_reward_action", {
      p_user_id: userId,
      p_action_key: actionKey,
    });
  },
  async redeem({
    userId,
    points_awarded,
  }: {
    userId: string;
    points_awarded: number;
  }) {
    const supabase = await createClient();
    return supabase.rpc("increment_reward_balance", {
      p_user_id: userId,
      p_amount: points_awarded,
    });
  },
  async getBalance() {},
  async getProgress() {},
};
