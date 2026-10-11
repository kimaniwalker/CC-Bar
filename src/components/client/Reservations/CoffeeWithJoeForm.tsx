"use client";

import { Input } from "@/components/ds/Input";
import { Text } from "@/components/ds/Text";
import { useUser } from "@/components/client/Auth/AuthContext";
import useHandlePayment from "@/hooks/useHandleCheckout";
import { CheckoutType, ReservationsFormInputs } from "@/types/Reservations";
import { checkout } from "@/utils/Reservations/checkout";
import { sendGTMEvent } from "@next/third-parties/google";
import { motion } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Stripe from "stripe";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Mail, Phone, Sparkles, User } from "lucide-react";

const EVENT_PRICE = 55;
const EVENT_DATE = "10/23";
const EVENT_TIME = "7:00 PM - 9:00 PM";
const EVENT_DATE_TIME = "2026-10-23T19:00:00";
const EVENT_TICKET_LIMIT = 20;

type CoffeeWithJoeFormProps = {
  trackingData?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    gclid?: string;
    fbclid?: string;
  };
  theme: string;
};

export function CoffeeWithJoeForm({
  trackingData,
  theme,
}: CoffeeWithJoeFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const { formatReservationsData } = useHandlePayment();

  const methods = useForm<ReservationsFormInputs>({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      date: EVENT_DATE,
      time: EVENT_TIME,
      dateTime: EVENT_DATE_TIME,
      guests: 1,
      activities: [],
      addOns: [],
      special_requests: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    watch,
  } = methods;

  const [name, email, phone] = watch(["name", "email", "phone"]);

  const handleCheckout = async (body: Stripe.Checkout.SessionCreateParams) => {
    sendGTMEvent({
      event: "begin_reservation_checkout",
      theme,
      total_amount: EVENT_PRICE,
      guests: 1,
      is_special_rate: true,
      special_name: "Coffee with Joe Ticket",
      utm_source: trackingData?.utm_source || "direct",
      utm_campaign: trackingData?.utm_campaign || "none",
      gclid: trackingData?.gclid || null,
    });

    const url = await checkout(body);
    if (url) router.push(url);
  };

  const onSubmit: SubmitHandler<ReservationsFormInputs> = async (
    reservation,
  ) => {
    const currentUrl = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    const reservationsData = formatReservationsData({
      redirect_url: currentUrl,
      ReservationsFormData: {
        ...reservation,
        date: EVENT_DATE,
        time: EVENT_TIME,
        dateTime: EVENT_DATE_TIME,
        guests: 1,
        activities: [],
        addOns: [],
      },
      user_id: user?.id,
      total: EVENT_PRICE,
      additionalActivitiesCost: 0,
      addOnsCost: 0,
      basePrice: EVENT_PRICE,
      eventName: "Coffee, No Suga! with Joe @ CC BAR",
      eventType: CheckoutType.COFFEE_WITH_JOE,
    });

    await handleCheckout(reservationsData);
  };

  const canSubmit = isValid && !!name && !!email && !!phone;

  return (
    <div className="w-full">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900">
                <User className="h-5 w-5 text-white" />
              </div>
              <Text size="lg" className="font-bold text-neutral-900">
                Your ticket details
              </Text>
            </div>

            <div className="space-y-4">
              <Input
                leadingIcon={User}
                errorMessage={errors.name?.message}
                type="text"
                id="name"
                placeholder="Your Name"
                required
                className="rounded-xl border-2 border-neutral-200 py-3 pl-12 transition-colors focus:border-neutral-900"
                {...register("name", { required: "Name is required" })}
              />

              <Input
                leadingIcon={Mail}
                errorMessage={errors.email?.message}
                type="email"
                id="email"
                placeholder="Your Email"
                required
                className="rounded-xl border-2 border-neutral-200 py-3 pl-12 transition-colors focus:border-neutral-900"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />

              <Input
                leadingIcon={Phone}
                errorMessage={errors.phone?.message}
                type="tel"
                id="phone"
                placeholder="Your Phone Number"
                required
                className="rounded-xl border-2 border-neutral-200 py-3 pl-12 transition-colors focus:border-neutral-900"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[\d\s()+-]+$/,
                    message: "Invalid phone number",
                  },
                })}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl border border-neutral-200 bg-linear-to-br from-neutral-900 to-neutral-800 p-6 text-white shadow-lg"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <Sparkles className="h-5 w-5 text-amber-300" />
              </div>
              <Text size="lg" className="font-bold text-white">
                Reservation summary
              </Text>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <Text size="sm" className="text-white/70">
                    Coffee with Joe ticket
                  </Text>
                  <Text size="xs" className="text-white/50">
                    1 guest • full experience
                  </Text>
                </div>
                <Text size="md" className="font-semibold text-amber-300">
                  $55
                </Text>
              </div>

              <div className="rounded-xl bg-white/5 p-4">
                <Text size="xs" className="leading-relaxed text-white/70">
                  Date: {EVENT_DATE} • Time: {EVENT_TIME}
                </Text>
                <Text size="xs" className="mt-2 leading-relaxed text-white/70">
                  Only {EVENT_TICKET_LIMIT} tickets available.
                </Text>
                <Text size="xs" className="mt-2 leading-relaxed text-white/70">
                  Includes: candle + refreshments, a relaxed social setting, and
                  a great opportunity to kick back, relax, and mingle.
                </Text>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <button
              disabled={!canSubmit}
              type="submit"
              className="w-full rounded-full bg-neutral-900 px-6 py-4 text-lg font-bold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
            >
              Complete Ticket Purchase - $55
            </button>

            <p className="mt-4 text-center text-xs text-neutral-500">
              By booking, you agree to our{" "}
              <a href="/terms" className="underline hover:text-neutral-700">
                terms
              </a>{" "}
              and{" "}
              <a
                href="/cancellation-policy"
                className="underline hover:text-neutral-700"
              >
                cancellation policy
              </a>
            </p>
          </motion.div>
        </form>
      </FormProvider>
    </div>
  );
}
