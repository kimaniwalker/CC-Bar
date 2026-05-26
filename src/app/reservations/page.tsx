import { ReservationsForm } from "@/components/client/Reservations/ReservationsForm";
import { Suspense } from "react";

export default async function Reservations() {
  return (
    <Suspense>
      <ReservationsForm />
    </Suspense>
  );
}
