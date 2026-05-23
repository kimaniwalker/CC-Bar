"use server";
import { DB_TABLES } from "@/types/Database";
import { createClient } from "../supabase/server";

export const createRewardsAccount = async ({ userId }: { userId: string }) => {
  const supabase = await createClient();

  const { data: existingAccount, error: fetchError } = await supabase
    .from(DB_TABLES.REWARD_ACCOUNTS)
    .select("*")
    .eq("user_id", userId)
    .single();

  if (fetchError) {
    console.error("Error checking existing rewards account:", fetchError);
    throw fetchError;
  }

  if (existingAccount) {
    // Rewards account already exists, return it
    return existingAccount;
  }

  const { data, error } = await supabase
    .from(DB_TABLES.REWARD_ACCOUNTS)
    .insert({
      user_id: userId,
      balance: 0,
    });

  if (error) {
    console.error("Error creating rewards account:", error);
    throw error;
  }

  return data;
};
