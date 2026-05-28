"use server";
import { createClient } from "@/utils/supabase/server";
import { UserProfile } from "@/types/User";

export const getProfile = async (id: string): Promise<UserProfile[]> => {
  if (id === "guest") {
    return [];
  }
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .overrideTypes<UserProfile[]>();

  if (error) {
    console.error("Error fetching profile:", error);
    return [];
  }

  return data ?? [];
};
