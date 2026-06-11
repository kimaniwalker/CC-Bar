"use server";

import { createClient } from "../supabase/server";

export const getSubscriptionUserId = async (subscriptionId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("subscription_id", subscriptionId)
    .single();

  if (error) {
    console.error("Error fetching subscription user ID:", error);
    return null;
  }

  return data?.user_id || null;
};
