"use server";
import { Timeslot } from "@/types/Reservations";
import { createClient } from "../supabase/server";
import { BLOCKED_AVAILABILITY } from "@/components/client/Reservations/BlockedAvailability";
import { isBlocked } from "./isAvailable";

// ✅ Helper to get correct day of week
function getDayOfWeek(dateString: string): number {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getDay();
}

export default async function fetchAvailableTimeSlots({
  date,
}: {
  date: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_available_timeslots", {
    selected_date: date,
  });

  if (error) {
    console.error(error);
    return null;
  }

  const timeslots = (data ?? []) as Timeslot[];

  console.log("🔍 Checking blocks for date:", date);
  console.log("📅 Day of week:", getDayOfWeek(date)); // ✅ Use same function

  // ✅ Filter out blocked times
  const availableSlots = timeslots.filter((slot) => {
    const blocked = isBlocked(date, slot.value, BLOCKED_AVAILABILITY);

    if (blocked) {
      console.log(`🚫 BLOCKED: ${slot.label} (${slot.value})`);
    }

    return !blocked;
  });

  console.log(
    `✅ Available slots for ${date}:`,
    availableSlots.length,
    "of",
    timeslots.length,
  );
  return availableSlots;
}
