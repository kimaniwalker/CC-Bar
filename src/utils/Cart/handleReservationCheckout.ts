"use server";

import { createClient } from "@/utils/supabase/server";
import { RewardActionKey } from "@/types/Rewards";

import { withRewards } from "../Rewards/withRewards";
import Stripe from "stripe";
import { ORDER_STATUS } from "@/types/Orders";
import { CheckoutType } from "@/types/Reservations";
import { handleUpdateOrder } from "../Orders/handleUpdateOrder";
import { sendEmail } from "../Notifications/sendEmail";
import { reservationEmailTemplate } from "../Notifications/reservationEmailTemplate";

export async function handleReservationCheckout(
  session: Stripe.Checkout.Session & {
    custom_fields?: { key: string; text?: { value: string } }[];
  },
) {
  const supabase = await createClient();
  const metadata = session.metadata;

  if (!metadata) {
    throw new Error("No metadata found in session");
  }

  const { name, email, guests, activities, phone, dateTime, add_ons } =
    metadata;

  // Extract special requests from custom fields, type mismatch in Stripe types, so we need to do some manual parsing
  const special_requests = session.custom_fields?.find(
    (field) => field.key === "special_request",
  )?.text?.value;

  try {
    await withRewards(
      RewardActionKey.MAKE_RESERVATION,
      async () => {
        //once user arrives , we can check if they have an order with the same payment intent id, if so we can update that order & order_items to include the reservation details and mark it as confirmed
        await handleUpdateOrder({
          order: {
            stripe_payment_intent_id: session.payment_intent as string,
            status: ORDER_STATUS.PARTIALLY_PAID,
            total: session.amount_total ?? 0,
            ...(session.client_reference_id !== "guest" && {
              user_id: session.client_reference_id ?? "",
            }),
            order_source: CheckoutType.RESERVATION,
            stripe_customer_id: session.customer as string,
          },
        });

        // Create reservation record
        const { error: reservationError } = await supabase
          .from("reservations")
          .insert({
            name,
            email,
            datetime: dateTime,
            guest: Number(guests),
            activities: activities?.split(",")?.map((a) => a.trim()),
            phone,
            payment_intent_id: session.payment_intent as string,
            add_ons: add_ons?.split(",")?.map((a) => a.trim()),
            special_requests,
          });

        if (reservationError) {
          // Handle duplicate webhooks gracefully
          if (
            reservationError.code === "23505" &&
            reservationError.message?.includes("payment_intent_id")
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

        await sendEmail({
          to: email,
          subject: "Your Reservation is Confirmed — Candle Cowbar",
          html: reservationEmailTemplate({
            name,
            date: metadata.date,
            time: metadata.time,
            guests: Number(guests),
            isReminder: false,
          }),
        });

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
