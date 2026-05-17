
import { createClient } from "@/utils/Supabase/server";
import { UserProfile } from "@/types/User";


export const getProfile = async (id:string): Promise<UserProfile[]> => {
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