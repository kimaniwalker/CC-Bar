"use server";

import { createClient } from "@/utils/supabase/server";
import { RewardActionKey } from "@/types/Rewards";
import type Stripe from "stripe";
import { withRewards } from "../Rewards/withRewards";

export async function handleReservationCheckout(
  session: Stripe.Checkout.Session,
) {
  const supabase = await createClient();
  const metadata = session.metadata;

  if (!metadata) {
    throw new Error("No metadata found in session");
  }

  const { name, email, guests, activities, phone, dateTime } = metadata;

  const special_requests =
    session.custom_fields?.find((field) => field.key === "special_request")
      ?.text?.value || null;

  try {
    await withRewards(
      RewardActionKey.MAKE_RESERVATION,
      async () => {
        // Create reservation record
        const { error: reservationError } = await supabase
          .from("reservations")
          .insert({
            name,
            email,
            datetime: dateTime,
            guest: Number(guests),
            activities: activities.split(",").map((a) => a.trim()),
            phone,
            stripe_session_id: session.id,
            special_requests,
          });

        if (reservationError) {
          // Handle duplicate webhooks gracefully
          if (
            reservationError.code === "23505" &&
            reservationError.message?.includes("stripe_session_id")
          ) {
            console.log(
              "⚠️ Duplicate webhook - Reservation already exists for session:",
              session.id,
            );
            throw new Error("DUPLICATE_HANDLED");
          }
          console.error("❌ Failed to create reservation:", reservationError);
          throw reservationError;
        }
        console.log(
          "✅ Reservation created successfully for session:",
          session.id,
        );
      },
      session.client_reference_id ?? "guest",
    );
  } catch (error) {
    if (error instanceof Error && error.message === "DUPLICATE_HANDLED") {
      return; // Exit gracefully, no rewards awarded
    }
    console.error("Error processing reservation rewards:", error);
    throw error;
  }
}
