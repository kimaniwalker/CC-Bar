"use server";

import { createClient } from "../supabase/server";

export const validateAvailableTimeslots = async ({
  selected_date,
  selected_slot,
  guests,
}: {
  selected_date: string;
  selected_slot: string;
  guests: number;
}) => {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("validate_available_timeslots", {
    selected_date: selected_date, // e.g. "2026-05-26"
    slot_start_utc: selected_slot, // a Date object or ISO string for the slot start
    requested_guests: Number(guests),
    max_capacity: 4, // optional if your function default is 4
  });

  if (error) {
    console.error(error);
    return;
  }

  if (data?.available) {
    return data;
  } else {
    // data.reason, data.remaining_capacity, etc.
    console.warn("Selected timeslot is not available:", data?.reason);
    return {
      available: false,
      reason:
        data.remaining_capacity < guests
          ? `Not enough capacity for the selected time slot. Only ${data.remaining_capacity} left`
          : "Selected time slot is fully booked.",
    };
  }
};
