import { createClient } from "@/hooks/supabase/server";
import { TimeslotSelector } from "../client/Reservations/TimeslotSelector";
import { Timeslot } from "@/types/Reservations";

export default async function AvailableTimeSlots({date}:{date?: string}) {
    console.log({date})

    const supabase = await createClient()

    const { data, error } = await supabase.rpc(
      "get_available_timeslots",
      { selected_date: date }
    );

    if (error) {
      console.error(error);
      return null;
    }
  
    console.log(data);


    // Simulate fetching available time slots from an API
    const timeSlots = await new Promise<Timeslot[]>((resolve) => {
        setTimeout(() => {
            resolve([{ label: "10:00 AM", value: "2026-04-28T22:00:00+00:00" }, { label: "2:00 PM", value: "2026-04-28T14:00:00+00:00" }]
              );;
        }, 2000);
    });

    return <TimeslotSelector available_timeslots={data} />;
    ;
}