"use server";

import { Subscription } from "@/types/User";
import { createClient } from "../supabase/server";

export const handleUpdateSubscription = async (
  subscription: Omit<Subscription, "id" | "created_at" | "updated_at">,
) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .upsert(subscription)
    .eq("user_id", subscription.user_id)
    .select("*")
    .single()
    .overrideTypes<Subscription>();

  if (error) {
    console.error("Error updating subscription:", error);
    return null;
  }

  return data;
};
