"use server";

import { createClient } from "../supabase/server";

export const handleUpdateSubscriptionBySubscriptionId = async ({
  subscriptionId,
  status,
  next_renewal,
  cancel_at,
}: {
  subscriptionId: string;
  status: string;
  next_renewal: string | null;
  cancel_at: string | null;
}) => {
  const supabase = await createClient();

  const updateData: {
    status: string;
    next_renewal?: string;
    cancel_at: string | null;
  } = { status, cancel_at };

  if (next_renewal) {
    updateData.next_renewal = next_renewal;
  }
  if (cancel_at) {
    updateData.cancel_at = cancel_at;
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .update(updateData)
    .eq("subscription_id", subscriptionId)
    .select("*")
    .single();

  if (error) {
    console.error("Error updating subscription by subscription ID:", error);
    return null;
  }

  return data;
};
