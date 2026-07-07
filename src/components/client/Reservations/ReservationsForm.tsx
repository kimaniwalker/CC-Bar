"use client";

import { Input } from "@/components/ds/Input";
import { MultiSelectField } from "@/components/ds/MultiSelect";
import { Text } from "@/components/ds/Text";
import useHandlePayment from "@/hooks/useHandleCheckout";
import { ReservationsFormInputs, Timeslot } from "@/types/Reservations";
import Stripe from "stripe";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import {
  SubmitHandler,
  useForm,
  FormProvider,
  useWatch,
} from "react-hook-form";
import { TimeslotSelectorLoadingSkeleton } from "./TimeslotSelectorLoadingSkeleton";
import fetchAvailableTimeSlots from "@/utils/Reservations/fetchAvailableTimeSlots";
import { TimeslotSelector } from "./TimeslotSelector";
import { useUser } from "../Auth/AuthContext";
import { Activities } from "./Activities";
import { AddOns } from "./AddOns";
import { validateAvailableTimeslots } from "@/utils/Reservations/validateAvailableTimeslots";
import {
  Calendar,
  Clock,
  Mail,
  Phone,
  User,
  Users,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { checkout } from "@/utils/Reservations/checkout";

export const ReservationsForm = () => {
  const date = useSearchParams().get("date") ?? undefined;
  const methods = useForm<ReservationsFormInputs>({
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const {
    register,
    handleSubmit,
    setError,
    formState: { isValid, errors },
  } = methods;

  const selectedActivities =
    useWatch({ control: methods.control, name: "activities" }) ?? [];
  const selectedAddOns =
    useWatch({ control: methods.control, name: "addOns" }) ?? [];

  const router = useRouter();
  const { formatReservationsData } = useHandlePayment();
  const [timeSlots, setTimeSlots] = React.useState<Timeslot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = React.useState(false);
  const { user } = useUser();

  const getAvaialableTimeslots = async (date: string) => {
    setIsLoadingSlots(true);
    const slots = await fetchAvailableTimeSlots({ date });
    setTimeSlots(slots ?? []);
    setIsLoadingSlots(false);
  };

  useEffect(() => {
    if (date) getAvaialableTimeslots(date);
    else {
      setTimeSlots([]);
      setIsLoadingSlots(false);
    }
  }, [date]);

  const handleCheckout = async (body: Stripe.Checkout.SessionCreateParams) => {
    const url = await checkout(body);
    if (url) router.push(url);
  };

  const onSubmit: SubmitHandler<ReservationsFormInputs> = async (
    reservation,
  ) => {
    const data = await validateAvailableTimeslots({
      selected_date: reservation.date,
      selected_slot: reservation.dateTime,
      guests: Number(reservation.guests),
    });
    if (!data.available) {
      setError("time", {
        type: "manual",
        message: data.reason,
      });
      return;
    }
    const reservationsData = formatReservationsData({
      redirect_url: "/",
      ReservationsFormData: reservation,
      user_id: user?.id,
    });
    handleCheckout(reservationsData);
  };

  const handleSelectDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    router.push(`?date=${selectedDate}`);
  };

  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const maxDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

  const calculateEstimatedTotal = ({
    activities,
    addOns,
  }: {
    activities: string[];
    addOns: string[];
  }) => {
    const activityTotal = activities.slice(1).reduce((total, activity) => {
      const activityInfo = Activities.find((a) => a.label === activity);
      return total + (activityInfo?.price ?? 0);
    }, 0);

    const addOnTotal = addOns.reduce((total, addOn) => {
      const addOnInfo = AddOns.find((a) => a.label === addOn);
      return total + (addOnInfo?.price ?? 0);
    }, 0);

    return activityTotal + addOnTotal;
  };

  const estimatedActivitiesAndAddOns = calculateEstimatedTotal({
    activities: selectedActivities ?? [],
    addOns: selectedAddOns ?? [],
  });
  const basePrice = 65;
  const estimatedTotal = basePrice + estimatedActivitiesAndAddOns;
  const remainingBalance = estimatedTotal - basePrice;

  return (
    <div className="min-h-screen bg-linear-to-b from-neutral-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-full border border-neutral-200 mb-6">
            <Sparkles className="w-4 h-4 text-neutral-900" />
            <Text size="sm" className="text-neutral-700 font-medium">
              Reserve Your Experience
            </Text>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-neutral-900 mb-4 tracking-tight">
            Your Experience{" "}
            <span className="relative inline-block">
              <span className="text-neutral-900">Awaits</span>
              <div className="absolute bottom-1 left-0 right-0 h-3 bg-yellow-300 -z-10" />
            </span>
          </h1>

          <Text size="lg" className="text-neutral-600 max-w-2xl mx-auto">
            An intimate, hands-on experience designed for creativity and
            relaxation.
          </Text>

          <Text size="sm" className="mt-3 text-neutral-500">
            Reservations available up to 30 days in advance
          </Text>
        </motion.div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <Text size="lg" className="font-bold text-neutral-900">
                  Your Information
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
                  className="pl-12 py-3 rounded-xl border-2 border-neutral-200 focus:border-neutral-900 transition-colors"
                  {...register("name", { required: "This field is required" })}
                />

                <Input
                  leadingIcon={Mail}
                  errorMessage={errors.email?.message}
                  type="email"
                  id="email"
                  placeholder="Your Email"
                  required
                  className="pl-12 py-3 rounded-xl border-2 border-neutral-200 focus:border-neutral-900 transition-colors"
                  {...register("email", { required: "This field is required" })}
                />

                <Input
                  leadingIcon={Phone}
                  errorMessage={errors.phone?.message}
                  type="tel"
                  id="phone"
                  placeholder="Your Phone Number"
                  required
                  className="pl-12 py-3 rounded-xl border-2 border-neutral-200 focus:border-neutral-900 transition-colors"
                  {...register("phone", { required: "This field is required" })}
                />
              </div>
            </motion.div>

            {/* Date & Time Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <Text size="lg" className="font-bold text-neutral-900">
                  Select Date & Time
                </Text>
              </div>

              <div className="space-y-6">
                <Input
                  hideLabel
                  leadingIcon={Calendar}
                  errorMessage={errors.date?.message}
                  defaultValue={date}
                  min={today}
                  max={maxDate}
                  type="date"
                  id="date"
                  required
                  className="pl-12 py-3 rounded-xl border-2 border-neutral-200 focus:border-neutral-900 transition-colors appearance-none"
                  {...register("date", {
                    required: "This field is required",
                    validate: (value) => {
                      if (value < today) return "Date cannot be in the past";
                      if (value > maxDate) return "Date must be within 30 days";
                      return true;
                    },
                  })}
                  onChange={handleSelectDate}
                />

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-neutral-700" />
                    <Text size="sm" className="font-medium text-neutral-700">
                      Available Timeslots
                    </Text>
                  </div>

                  {isLoadingSlots ? (
                    <TimeslotSelectorLoadingSkeleton />
                  ) : date ? (
                    <TimeslotSelector available_timeslots={timeSlots} />
                  ) : (
                    <div className="bg-neutral-50 rounded-xl p-6 text-center border-2 border-dashed border-neutral-200">
                      <Clock className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                      <Text className="text-sm text-neutral-500">
                        Select a date to view available timeslots
                      </Text>
                    </div>
                  )}
                </div>

                <Input
                  leadingIcon={Users}
                  errorMessage={errors.guests?.message}
                  defaultValue={1}
                  max={8}
                  min={1}
                  type="number"
                  id="guests"
                  placeholder="Number of Guests"
                  className="pl-12 py-3 rounded-xl border-2 border-neutral-200 focus:border-neutral-900 transition-colors"
                  {...register("guests", {
                    required: "This field is required",
                  })}
                />
              </div>
            </motion.div>

            {/* Activities & Add-Ons Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <Text size="lg" className="font-bold text-neutral-900">
                  Customize Your Experience
                </Text>
              </div>

              <div className="space-y-6">
                <div>
                  <Text size="sm" className="font-medium text-neutral-700 mb-3">
                    Select Activities
                  </Text>
                  <MultiSelectField
                    fieldName="activities"
                    options={Activities.map((activity) => activity.label)}
                  />
                </div>

                <div>
                  <Text size="sm" className="font-medium text-neutral-700 mb-3">
                    Add-Ons (Optional)
                  </Text>
                  <MultiSelectField
                    fieldName="addOns"
                    options={AddOns.map((addOn) => addOn.label)}
                  />
                </div>
              </div>
            </motion.div>

            {/* Pricing Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-linear-to-br from-neutral-900 to-neutral-800 rounded-3xl p-6 sm:p-8 shadow-lg text-white sticky top-4"
            >
              <Text size="lg" className="font-bold mb-6">
                Reservation Summary
              </Text>

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <Text size="sm" className="text-white/70">
                    Base Experience
                  </Text>
                  <Text size="md" className="font-semibold">
                    ${basePrice}
                  </Text>
                </div>

                {selectedActivities.map((activity, index) => {
                  const activityInfo = Activities.find(
                    (a) => a.label === activity,
                  );
                  return (
                    <div
                      key={activity}
                      className="flex items-center justify-between"
                    >
                      <Text size="sm" className="text-white/70">
                        {activity}
                      </Text>
                      <Text size="sm" className="font-semibold">
                        {index === 0 ? `Included` : `+$${activityInfo?.price}`}
                      </Text>
                    </div>
                  );
                })}

                {selectedAddOns.length > 0 && (
                  <div className="pt-4 border-t border-white/10">
                    <Text size="sm" className="font-semibold mb-3">
                      Add-Ons
                    </Text>
                    {selectedAddOns.map((addOn) => {
                      const addOnInfo = AddOns.find((a) => a.label === addOn);
                      return (
                        <div
                          key={addOn}
                          className="flex items-center justify-between mb-2"
                        >
                          <Text size="sm" className="text-white/70">
                            {addOn}
                          </Text>
                          <Text size="sm" className="font-semibold">
                            +${addOnInfo?.price}
                          </Text>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <Text size="md" className="font-semibold">
                      Estimated Total
                    </Text>
                    <Text size="lg" className="font-bold">
                      ${estimatedTotal}
                    </Text>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Text size="sm" className="font-semibold">
                        Due Today
                      </Text>
                      <Text size="md" className="font-bold text-yellow-300">
                        $65 Deposit
                      </Text>
                    </div>
                    <Text size="xs" className="text-white/60">
                      Secures your reservation
                    </Text>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Text size="sm" className="text-white/70">
                        Remaining Balance
                      </Text>
                      <Text size="xs" className="text-white/50">
                        Paid during your visit
                      </Text>
                    </div>
                    <Text size="md" className="font-semibold">
                      ~${remainingBalance} + tax
                    </Text>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 mt-4">
                  <Text size="xs" className="text-white/60 leading-relaxed">
                    Your reservation deposit secures your experience and will be
                    applied toward your final balance. Additional costs may vary
                    based on selected activities, add-ons, and in-store
                    upgrades.
                  </Text>
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <button
                disabled={!isValid}
                type="submit"
                className="w-full py-4 bg-neutral-900 text-white rounded-full font-bold text-lg hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Reserve with $65 Deposit
              </button>
            </motion.div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};
