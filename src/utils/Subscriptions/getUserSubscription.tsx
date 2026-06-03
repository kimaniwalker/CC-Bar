"use server";

import { Subscription } from "@/types/User";
import { createClient } from "../supabase/server";

export const getUserSubscription = async (userId: string) => {
  const supabase = await createClient();

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .overrideTypes<Subscription[]>();

  if (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }

  console.log("Fetched subscription from database:", subscription);

  return subscription;
};
