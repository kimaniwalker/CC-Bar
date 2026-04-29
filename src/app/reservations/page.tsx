import { ReservationsForm } from "@/components/client/Reservations/ReservationsForm";
import { TimeslotSelectorLoadingSkeleton } from "@/components/client/Reservations/TimeslotSelectorLoadingSkeleton";
import AvailableTimeSlots from "@/components/server/AvailableTimeSlots";
import { Suspense } from "react";

export default async function Reservations({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
})  {
  const params = await searchParams;
  const date = params.date ?? "";

  return (
    <ReservationsForm
    date={date}
    available_timeslots={
    <Suspense key={date} fallback={<TimeslotSelectorLoadingSkeleton />}>
      <AvailableTimeSlots date={date} />
    </Suspense>} 
    />  
  );
}