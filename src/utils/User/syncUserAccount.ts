"use server";
import type { User } from "@supabase/supabase-js";
import { createClient } from "../supabase/server";
import { RewardActionKey } from "@/types/Rewards";
import { withRewards } from "../Rewards/withRewards";
import { DB_TABLES } from "@/types/Database";
import { createRewardsAccount } from "../Rewards/createRewardsAcct";

export async function syncUserAccount(user: User) {
  const supabase = await createClient();

  try {
    const rewardsData = await withRewards(
      RewardActionKey.SIGNUP,
      async () => {
        // Create or update profile
        const { error: profileError } = await supabase
          .from(DB_TABLES.PROFILES)
          .upsert(
            {
              id: user.id,
              email: user.email ?? undefined,
              phone: user.phone ?? undefined,
            },
            { onConflict: "id" },
          );

        if (profileError) {
          console.error("Error creating profile:", profileError);
          throw profileError;
        }

        await createRewardsAccount({ userId: user.id });
      },
      user.id,
    );

    return {
      success: true,
      isNewUser: rewardsData?.data?.already_completed === false,
    };
  } catch (error) {
    console.error("Error syncing user account:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
