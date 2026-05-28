"use server";

import { createClient } from "../supabase/server";
import { DB_TABLES } from "@/types/Database";
import { UserProfile } from "@/types/User";

export const updateUserProfile = async ({ user }: { user: UserProfile }) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(DB_TABLES.PROFILES)
    .upsert({ ...user }, { onConflict: "id" })
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating order:", error);
    throw new Error("Failed to update order");
  }

  console.log("✅ User updated:", data);
  return { user_id: data.id };
};
