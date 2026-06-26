"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Order } from "@/types/Orders";

type Reservation = {
  id: string;
  name: string;
  email: string;
  phone: string;
  datetime: string;
  guest: number;
  activities: string[];
  add_ons: string[];
  payment_intent_id: string;
  special_requests?: string;
  orders?: Order; // Related order via FK
};

export function useReservationContext(reservation_id: string | null) {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!reservation_id) {
      setReservation(null);
      setOrder(null);
      return;
    }

    async function fetchReservation() {
      setLoading(true);
      const supabase = createClient();

      try {
        // Fetch reservation with linked order in a single query
        const { data, error } = await supabase
          .from("reservations")
          .select(
            `
                        *,
                        orders!reservations_payment_intent_id_fkey(*)
                    `,
          )
          .eq("id", reservation_id)
          .single();

        if (error) throw error;

        setReservation(data);
        setOrder(data.orders || null);
      } catch (error) {
        console.error("Error fetching reservation context:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReservation();
  }, [reservation_id]);

  return { reservation, order, loading };
}
