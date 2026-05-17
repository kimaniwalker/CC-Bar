import { ReservationsFormInputs } from "@/types/Reservations";

export const formatReservationsData = (data: ReservationsFormInputs) => {
    return {
        name: data.name,
        email: data.email,
        phone: data.phone,
        date: data.date,
        time: data.time,
        guests: data.guests,
        activites: data.activities || [],
        special_requests: data.special_requests || null,
    }
}