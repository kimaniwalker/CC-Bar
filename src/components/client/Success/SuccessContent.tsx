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
  Package,
  CheckCircle,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import Stripe from "stripe";

import Link from "next/link";
import { SubscriptionSignupInfo } from "@/utils/Subscriptions/SubscriptionSignUpInfo";

export default function SuccessContent() {
  const params = useSearchParams();
  const session_id = params.get("session_id") ?? "";
  const type = (params.get("type") as CheckoutType) ?? "";

  const [session, setSession] = useState<Stripe.Checkout.Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSessionData = useCallback(async () => {
    if (!session_id) {
      setLoading(false);
      return;
    }

    try {
      const sessionData = await retreiveCheckoutSession(session_id);
      setSession(sessionData as Stripe.Checkout.Session);
    } catch (error) {
      console.error("Error fetching session:", error);
    } finally {
      setLoading(false);
    }
  }, [session_id]);

  useEffect(() => {
    fetchSessionData();
  }, [fetchSessionData]);

  const handleConfetti = useCallback(() => {
    const origins = [
      { x: 0.5, y: 0 },
      { x: 0.2, y: 0 },
      { x: 0.8, y: 0 },
    ];

    [0, 360, 600].forEach((delay, i) => {
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
      }, delay);
    });
  }, []);

  useEffect(() => {
    if (type === CheckoutType.RESERVATION) {
      handleConfetti();
    }
  }, [type, handleConfetti]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-900" />
      </div>
    );
  }

  const orderInfo = session?.metadata as Record<string, string>;

  // Render based on checkout type
  switch (type) {
    case CheckoutType.RESERVATION:
      return <ReservationSuccess orderInfo={orderInfo} />;
    case CheckoutType.SUBSCRIPTION:
      return <SubscriptionSuccess />;
    case CheckoutType.SHOP:
      return <ShopSuccess />;
    case CheckoutType.IN_STORE:
      return <InStoreSuccess />;
    default:
      return <DefaultSuccess />;
  }
}

// Reservation Success Component
const ReservationSuccess = ({
  orderInfo,
}: {
  orderInfo: Record<string, string>;
}) => {
  return (
    <div className="flex w-full justify-center py-8">
      <div className="flex w-full max-w-3xl flex-col justify-center p-4">
        <Text size="xxl" className="mb-4 text-center text-2xl font-bold">
          Reservation Confirmed
        </Text>
        <Text size="md" className="text-md">
          Thank you {orderInfo?.name}. Your Candle Cow Bar experience has been
          reserved, and we look forward to welcoming you.
        </Text>

        {/* Location Section */}
        <Section icon={<MapPin className="mr-2" />} title="Location">
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
        </Section>

        {/* What to Expect Section */}
        <Section icon={<Sparkles className="mr-2" />} title="What to Expect">
          <Text size="md" className="text-md mb-2">
            Your reservation includes a <b>$25 deposit</b>, which will be
            applied toward your experience. Depending on the activities
            you&apos;ve selected, there may be an additional balance due at the
            time of your visit.
          </Text>
          <Text size="md">
            Our team will guide you through your chosen activities to ensure a
            seamless and memorable experience.
          </Text>
        </Section>

        {/* Cancellation Policy Section */}
        <Section
          icon={<TriangleAlert className="mr-2" />}
          title="Cancellation Policy"
        >
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
        </Section>

        {/* Final Note Section */}
        <Section icon={<NotebookPen className="mr-2" />} title="A Final Note">
          <Text size="md" className="text-md mb-2">
            We&apos;ve thoughtfully prepared your session, and your time has
            been set aside just for you. Arriving early helps us begin your
            experience smoothly and without interruption.
          </Text>
          <Text size="md" className="text-md mb-2">
            We look forward to hosting you.
          </Text>
        </Section>

        {/* Reservation Details Section */}
        <Section
          icon={<CalendarDays className="mr-2" />}
          title="Reservation Details"
        >
          <DetailRow label="Name" value={orderInfo?.name} />
          <DetailRow label="Email" value={orderInfo?.email} />
          <DetailRow label="Phone" value={orderInfo?.phone} />
          <DetailRow label="Reservation Date" value={orderInfo?.date} />
          <DetailRow label="Reservation Time" value={orderInfo?.time} />
          <DetailRow label="Guests" value={orderInfo?.guests} />
          <DetailRow label="Activities" value={orderInfo?.activities} />
          {orderInfo?.add_ons && (
            <DetailRow label="Add Ons" value={orderInfo.add_ons} />
          )}
          {orderInfo?.special_requests && (
            <DetailRow
              label="Special Requests"
              value={orderInfo.special_requests}
            />
          )}
        </Section>
      </div>
    </div>
  );
};

// Subscription Success Component
const SubscriptionSuccess = () => {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-white p-8 shadow-lg">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-purple-100">
          <Sparkles className="h-16 w-16 text-purple-600" />
        </div>

        <h1 className="mb-4 text-center text-3xl font-bold text-neutral-900">
          Welcome to the Club! 🎉
        </h1>

        <p className="mb-8 text-center text-neutral-600">
          You&apos;re now a VIP member! Check your email for subscription
          details.
        </p>

        <div className="mb-8">
          <SubscriptionSignupInfo />
        </div>

        <ActionButtons
          primaryText="View Subscription Details"
          primaryHref="/profile/overview"
        />
      </div>
    </div>
  );
};

// Shop Success Component
const ShopSuccess = () => {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-white p-8 shadow-lg">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <Package className="h-16 w-16 text-green-600" />
        </div>

        <h1 className="mb-4 text-center text-3xl font-bold text-neutral-900">
          Order Confirmed! 🎉
        </h1>

        <p className="mb-8 text-center text-neutral-600">
          Thank you for your purchase! We&apos;ll send you tracking information
          once your order ships.
        </p>

        <div className="mb-8 rounded-2xl border-2 border-green-100 bg-green-50 p-6">
          <h3 className="mb-3 text-lg font-semibold text-green-900">
            📦 What&apos;s Next?
          </h3>
          <div className="space-y-3 text-sm text-green-800">
            <InfoRow
              icon="📧"
              text="You'll receive an order confirmation email shortly."
            />
            <InfoRow
              icon="📦"
              text="Your order will be processed within 1-2 business days."
            />
            <InfoRow
              icon="🚚"
              text="We'll send you tracking information once your order ships."
            />
          </div>
        </div>

        <ActionButtons
          primaryText="View Order Details"
          primaryHref="/profile/overview"
        />
      </div>
    </div>
  );
};

// In-Store Success Component
const InStoreSuccess = () => {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-white p-8 shadow-lg">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-16 w-16 text-emerald-600" />
        </div>

        <h1 className="mb-4 text-center text-3xl font-bold text-neutral-900">
          Payment Successful! 🎉
        </h1>

        <p className="mb-8 text-center text-neutral-600">
          Your in-store purchase has been completed. Thank you for shopping with
          us!
        </p>

        <ActionButtons primaryText="Continue Shopping" primaryHref="/" />
      </div>
    </div>
  );
};

// Default Success Component
const DefaultSuccess = () => {
  return (
    <div className="flex w-full justify-center py-8">
      <div className="flex w-full max-w-3xl flex-col items-center justify-center p-4">
        <h1 className="mb-4 text-2xl font-bold">Payment Successful!</h1>
        <p className="mb-6 text-lg">
          Thank you for your purchase. Your payment has been processed
          successfully.
        </p>
        <Link
          href="/"
          className="rounded-2xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

// Reusable Components
const Section = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <Text size="xl" as="div" className="my-4 flex text-xl font-semibold">
        {icon}
        {title}
      </Text>
      {children}
    </>
  );
};

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  return (
    <Text size="md" className="text-md mb-2">
      {label}: {value}
    </Text>
  );
};

const InfoRow = ({ icon, text }: { icon: string; text: string }) => {
  return (
    <p className="flex items-start gap-2">
      <span className="text-lg">{icon}</span>
      <span>{text}</span>
    </p>
  );
};

const ActionButtons = ({
  primaryText,
  primaryHref,
}: {
  primaryText: string;
  primaryHref: string;
}) => {
  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href={primaryHref}
          className="rounded-2xl bg-black px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          {primaryText}
        </Link>
        <Link
          href="/"
          className="rounded-2xl border-2 border-neutral-200 bg-white px-6 py-3 text-center text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
        >
          Back to Home
        </Link>
      </div>

      <div className="mt-8 text-center text-sm text-neutral-500">
        Need help?{" "}
        <Link
          href="/contact"
          className="font-medium text-neutral-900 underline hover:no-underline"
        >
          Contact Support
        </Link>
      </div>
    </>
  );
};
