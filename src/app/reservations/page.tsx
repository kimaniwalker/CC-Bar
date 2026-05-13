import { ReservationsForm } from "@/components/client/Reservations/ReservationsForm";
import { Suspense } from "react";

export default async function Reservations()  {

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            </div>
      </div>
    }>
       <ReservationsForm />  
    </Suspense>
    
  );
}