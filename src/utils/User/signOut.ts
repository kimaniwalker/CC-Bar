"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Sign out error:", error);
    throw error;
  }

  // Revalidate all paths to clear server cache
  revalidatePath("/", "layout");

  // Redirect to login
  redirect("/auth/login");
}
