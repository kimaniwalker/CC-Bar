"use client";

import { Text } from "@/components/ds/Text";
import { CheckoutType } from "@/types/Reservations";
import { retreiveCheckoutSession } from "@/utils/Cart/retrieveCheckoutSession";
import confetti from "canvas-confetti";
import {
  CalendarDays,
  MapPin,
  NotebookPen,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import Stripe from "stripe";

export default function SuccessContent() {
  const params = useSearchParams();
  const session_id = params.get("session_id") ?? "";
  const type = params.get("type") ?? "";

  const [data, setData] = React.useState({});

  const fetchSessionData = React.useCallback(async () => {
    if (!session_id) return;
    const sessionData = await retreiveCheckoutSession(session_id);
    setData(sessionData);
  }, [session_id]);

  React.useEffect(() => {
    fetchSessionData();
  }, [session_id, fetchSessionData]);

  const session = data as Stripe.Checkout.Session;
  //const lineItems = session?.line_items?.data as Stripe.LineItem[]
  const orderInfo = session.metadata;

  const handleConfetti = () => {
    const origins = [
      { x: 0.5, y: 0 },
      { x: 0.2, y: 0 },
      { x: 0.8, y: 0 },
    ];

    [0, 360, 600].forEach((delay, i) =>
      setTimeout(() => {
        const origin = origins[i] ?? origins[0];
        confetti({
          particleCount: 500,
          startVelocity: 20,
          spread: 2000,
          origin,
          gravity: 1.2,
          ticks: 3000,
          zIndex: 9999,
        });
      }, delay),
    );
  };

  useEffect(() => {
    if (type === CheckoutType.RESERVATION) {
      handleConfetti();
    }
  }, []);

  if (type === CheckoutType.RESERVATION) {
    return (
      <div className="py-8 flex justify-center w-full">
        <div className="flex flex-col p-4 w-full max-w-3xl justify-center">
          <Text size="xxl" className="text-2xl font-bold mb-4 text-center">
            Reservation Confirmed
          </Text>
          <Text size="md" className="text-md">
            Thank you {orderInfo?.name}. Your Candle Cow Bar experience has been
            reserved, and we look forward to welcoming you.
          </Text>

          <Text size="xl" as="div" className="text-xl font-semibold my-4 flex">
            <MapPin className="mr-2" />
            Location
          </Text>
          <Text size="md" className="text-md mb-2">
            4052 Helena Rd.
          </Text>
          <Text size="md" className="text-md mb-2">
            Helena, AL 35080
          </Text>
          <Text size="md" className="text-md mb-2">
            Please plan to arrive{" "}
            <b className="font-semibold">
              10–15 minutes prior to your scheduled time
            </b>{" "}
            so you can settle in and fully enjoy your experience.
          </Text>

          <Text size="xl" as="div" className="text-xl font-semibold my-4 flex">
            <Sparkles className="mr-2" /> What to Expect
          </Text>
          <Text size="md" className="text-md mb-2">
            Your reservation includes a <b>$25 deposit</b>, which will be
            applied toward your experience. Depending on the activities you’ve
            selected, there may be an additional balance due at the time of your
            visit.
          </Text>
          <Text size="md">
            Our team will guide you through your chosen activities to ensure a
            seamless and memorable experience.
          </Text>

          <Text size="xl" as="div" className="text-xl font-semibold my-4 flex">
            {" "}
            <TriangleAlert className="mr-2" />
            Cancellation Policy
          </Text>
          <Text size="md" className="text-md mb-2">
            Cancellations made at least 24 hours in advance will receive a full
            refund. Cancellations made within 24 hours of the scheduled time
            will forfeit the deposit.
          </Text>
          <Text size="md">
            If you need to reschedule, please contact us at least 24 hours in
            advance, and we will do our best to accommodate your request based
            on availability.
          </Text>

          <Text size="xl" as="div" className="text-xl font-semibold my-4 flex">
            <NotebookPen className="mr-2" />A Final Note
          </Text>
          <Text size="md" className="text-md mb-2">
            We’ve thoughtfully prepared your session, and your time has been set
            aside just for you. Arriving early helps us begin your experience
            smoothly and without interruption.
          </Text>
          <Text size="md" className="text-md mb-2">
            We look forward to hosting you.{" "}
          </Text>

          <Text size="xl" className="text-xl font-semibold my-4 flex">
            <CalendarDays className="mr-2" /> Reservation Details
          </Text>
          <Text size="md" className="text-md mb-2">
            Name: {orderInfo?.name}
          </Text>
          <Text size="md" className="text-md mb-2">
            Email: {orderInfo?.email}
          </Text>
          <Text size="md" className="text-md mb-2">
            Phone: {orderInfo?.phone}
          </Text>
          <Text size="md" className="text-md mb-2">
            Reservation Date: {orderInfo?.date}
          </Text>
          <Text size="md" className="text-md mb-2">
            Reservation Time: {orderInfo?.time}
          </Text>

          <Text size="md" className="text-md mb-2">
            Guests: {orderInfo?.guests}
          </Text>
          <Text size="md" className="text-md mb-2">
            Activities: {orderInfo?.activities}
          </Text>
          {orderInfo?.add_ons && (
            <Text size="md" className="text-md mb-2">
              Add Ons: {orderInfo?.add_ons}
            </Text>
          )}
          {orderInfo?.special_requests && (
            <Text size="md" className="text-md mb-2">
              Special Requests: {orderInfo.special_requests}
            </Text>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 flex justify-center w-full">
      <div className="flex flex-col p-4 w-full max-w-3xl justify-center items-center">
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-lg mb-6">
          Thank you for your purchase. Your payment has been processed
          successfully.
        </p>
      </div>
    </div>
  );
}
