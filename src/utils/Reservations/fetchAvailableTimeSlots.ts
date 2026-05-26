"use server";
import { Timeslot } from "@/types/Reservations";
import { createClient } from "../supabase/client";

export default async function fetchAvailableTimeSlots({
  date,
}: {
  date: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_available_timeslots", {
    selected_date: date,
  });

  if (error) {
    console.error(error);
    return null;
  }

  console.log(data);

  return (data ?? []) as Timeslot[];
}
