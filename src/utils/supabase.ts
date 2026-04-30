import { ReservationsFormInputs } from "@/types/Reservations";
import { createClient } from "@supabase/supabase-js";

export function supabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
    return createClient(url, key);
  }

export const formatReservationsData = (data: ReservationsFormInputs) => {
    return {
        name: data.name,
        email: data.email,
        phone: data.phone,
        date: data.date,
        time: data.time,
        guests: data.guests,
        special_requests: data.special_requests || null,
    }
}