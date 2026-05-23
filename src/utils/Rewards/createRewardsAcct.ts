import { DB_TABLES } from "@/types/Database";
import { createClient } from "../supabase/server";

export const createRewardsAccount = async ({ userId }: { userId: string }) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(DB_TABLES.REWARD_ACCOUNTS)
    .upsert(
      {
        user_id: userId,
      },
      {
        onConflict: "user_id",
      },
    )
    .select()
    .single();

  if (error) {
    console.error("Error creating rewards account:", error);

    throw error;
  }

  return data;
};
