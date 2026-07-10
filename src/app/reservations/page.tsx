import { ReservationsForm } from "@/components/client/Reservations/ReservationsForm";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reservations",
  description:
    "Reserve your seat at Candle Cow Bar and create your own luxury candles and fragrances.",
};

export default async function Reservations() {
  return (
    <Suspense>
      <ReservationsForm />
    </Suspense>
  );
}
