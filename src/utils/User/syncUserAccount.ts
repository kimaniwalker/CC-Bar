"use server";
import type { User } from "@supabase/supabase-js";
import { getProfile } from "./getProfile";
import { createNewStripeUser } from "@/hooks/useStripe";
import { updateUserProfile } from "./updateUserProfile";

export async function syncUserAccount(user: User) {
  const profile = await getProfile(user.id);

  if (!profile) {
    //profile = await createProfile(user)
  }

  if (!profile[0].customer_id) {
    const { customer } = await createNewStripeUser({
      id: user.id,
      email: user.email ?? undefined,
      phone: user.phone ?? undefined,
    });

    await updateUserProfile({
      id: user.id,
      customer_id: customer.id,
    });
  }

  return { profile };
}
