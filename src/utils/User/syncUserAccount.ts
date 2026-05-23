"use server";
import type { User } from "@supabase/supabase-js";
import { getProfile } from "./getProfile";
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
        // Only fetch what we need
        const [profile] = await Promise.all([
          getProfile(user.id),
          createRewardsAccount({ userId: user.id }),
        ]);

        // Create or update profile
        if (!profile.length) {
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
        } else {
          // Update phone if it changed
          if (user.phone && profile[0].phone !== user.phone) {
            const { error: updateError } = await supabase
              .from(DB_TABLES.PROFILES)
              .update({ phone: user.phone })
              .eq("id", user.id);

            if (updateError) {
              console.error("Error updating phone:", updateError);
            }
          }
        }
      },
      user.id ?? "guest",
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
