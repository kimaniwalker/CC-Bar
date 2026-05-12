import { UserProfile } from "@/types/User";
import { createClient } from "../supabase/server";

export const updateUserProfile = async (data: UserProfile) => {
    const supabase = await createClient()
    const { error } = await supabase.from("profiles").update({ ...data }).eq("id", data.id);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}