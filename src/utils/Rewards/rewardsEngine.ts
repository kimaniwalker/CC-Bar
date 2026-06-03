import { RewardActionKey } from "@/types/Rewards";
import { createClient } from "../supabase/server";

export const rewardEngine = {
  async completeAction({
    userId,
    actionKey,
    idempotency_key,
  }: {
    userId: string;
    actionKey: RewardActionKey;
    idempotency_key?: string;
  }) {
    const supabase = await createClient();
    return supabase.rpc("complete_reward_action", {
      p_user_id: userId,
      p_action_key: actionKey,
      p_webhook_event_id: idempotency_key ?? null,
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
