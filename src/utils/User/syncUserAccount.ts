"use server";
import type { User } from "@supabase/supabase-js";
import { getProfile } from "./getProfile";
import { createClient } from "../supabase/server";
import getRewardsData from "../Rewards/getRewardsData";

export async function syncUserAccount(user: User) {
  const profile = await getProfile(user.id);
  const rewards = await getRewardsData(user.id);
  const supabase = await createClient();

  if (!profile.length) {
    const { error } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email ?? undefined,
      phone: user.phone ?? undefined,
    });

    if (error) {
      console.error("Error creating profile:", error);
      return { profile: [] };
    }
  }

  if (!rewards?.length) {
    const { data: reward_acct, error: rewardsError } = await supabase
      .from("reward_accounts")
      .insert({ user_id: user.id, balance: 600 })
      .select()
      .single();

    if (rewardsError) {
      console.error("Error creating profile:", rewards);
      return { profile: [] };
    }

    return { profile, reward_acct };
  }
}
