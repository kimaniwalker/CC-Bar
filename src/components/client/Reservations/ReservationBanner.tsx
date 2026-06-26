"use client";

import { Text } from "@/components/ds/Text";
import { Order } from "@/types/Orders";
import { Calendar, Users, Sparkles } from "lucide-react";

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
};

export function ReservationBanner({
  reservation,
  order,
  loading,
}: {
  reservation: Reservation;
  order: Order;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="mt-4 animate-pulse rounded-2xl bg-purple-100 p-4">
        <div className="h-6 w-48 bg-purple-200 rounded" />
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-2xl border-2 border-purple-200 bg-linear-to-br from-purple-50 via-pink-50 to-purple-50 p-4">
      <div className="flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-purple-600 mt-0.5" />
        <div className="flex-1">
          <Text size="sm" className="font-semibold text-purple-900">
            🎉 Reservation Check-In
          </Text>
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2">
              <Text size="xs" className="font-medium text-purple-800">
                {reservation.name}
              </Text>
              <span className="text-purple-400">•</span>
              <Text size="xs" className="text-purple-600">
                {reservation.email}
              </Text>
            </div>

            <div className="flex items-center gap-4 text-purple-700">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <Text size="xs">
                  {(new Date(reservation.datetime), "MMM d, h:mm a")}
                </Text>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <Text size="xs">{reservation.guest} guests</Text>
              </div>
            </div>

            {reservation.activities.length > 0 && (
              <Text size="xs" className="text-purple-600">
                Activities: {reservation.activities.join(", ")}
              </Text>
            )}

            <div className="mt-2 rounded-lg bg-white/60 px-2 py-1">
              <Text size="xs" className="font-medium text-purple-800">
                Deposit Paid: ${(order.total / 100).toFixed(2)}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
