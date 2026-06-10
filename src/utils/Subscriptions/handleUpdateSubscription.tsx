"use server";

import { SubscriptionInsert } from "@/types/User";
import { createClient } from "../supabase/server";

export const handleUpdateSubscription = async (
  subscription: SubscriptionInsert,
) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .upsert(subscription, {
      onConflict: "subscription_id",
      ignoreDuplicates: false,
    })
    .select("*")
    .single();

  if (error) {
    console.error("Error updating subscription:", error);
    return null;
  }

  console.log("✅ Subscription upserted successfully:", data.id);
  return data;
};
