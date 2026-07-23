"use client";

import { Input } from "@/components/ds/Input";
import { MultiSelectField } from "@/components/ds/MultiSelect";
import { Text } from "@/components/ds/Text";
import useHandlePayment from "@/hooks/useHandleCheckout";
import { ReservationsFormInputs, Timeslot } from "@/types/Reservations";
import Stripe from "stripe";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  Heart,
} from "lucide-react";
import { motion } from "motion/react";
import { checkout } from "@/utils/Reservations/checkout";
import { sendGTMEvent } from "@next/third-parties/google";
import { THEME_CONFIGS } from "./ThemeConfigs";
import { getColorClasses } from "@/utils/Reservations/getColorClasses";

type LandingPageFormProps = {
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

export const LandingPageForm = ({
  trackingData,
  theme,
}: LandingPageFormProps) => {
  const themeConfig = THEME_CONFIGS[theme] ?? {
    defaultGuests: 1,
  };
  const date = useSearchParams().get("date") ?? undefined;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const methods = useForm<ReservationsFormInputs>({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      guests: themeConfig.defaultGuests,
      activities: [],
      addOns: [],
    },
  });

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { isValid, errors },
  } = methods;

  const selectedActivities =
    useWatch({
      control: methods.control,
      name: "activities",
      defaultValue: [], // ✅ Fallback to empty array
    }) ?? [];

  const selectedAddOns =
    useWatch({
      control: methods.control,
      name: "addOns",
      defaultValue: [], // ✅ Fallback to empty array
    }) ?? [];

  const router = useRouter();
  const { formatReservationsData } = useHandlePayment();
  const [timeSlots, setTimeSlots] = React.useState<Timeslot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = React.useState(false);
  const { user } = useUser();

  const getAvailableTimeslots = async (date: string) => {
    setIsLoadingSlots(true);
    const slots = await fetchAvailableTimeSlots({ date });
    setTimeSlots(slots ?? []);
    setIsLoadingSlots(false);
  };

  useEffect(() => {
    if (date) getAvailableTimeslots(date);
    else {
      setTimeSlots([]);
      setIsLoadingSlots(false);
    }
  }, [date]);

  const guestsCount =
    useWatch({ control: methods.control, name: "guests" }) ??
    themeConfig.defaultGuests;
  const numberOfGuests = Number(guestsCount);

  // ✅ UNIVERSAL PRICING LOGIC
  const calculatePricing = () => {
    // Check if special rate applies
    const hasSpecialRate =
      themeConfig.specialRate &&
      numberOfGuests === themeConfig.specialRate.guestCount;

    if (hasSpecialRate) {
      return {
        basePrice: themeConfig.specialRate!.price,
        pricePerPerson: themeConfig.specialRate!.price / numberOfGuests,
        isSpecial: true,
        specialName: themeConfig.specialRate!.name,
      };
    }

    // 2 People
    if (numberOfGuests === 2) {
      return {
        basePrice: 40 * numberOfGuests,
        pricePerPerson: 40,
        isSpecial: true,
        specialName: "Couples Experience",
      };
    }

    // Group rate (5+ people)
    if (numberOfGuests >= 5) {
      return {
        basePrice: 50 * numberOfGuests,
        pricePerPerson: 50,
        isSpecial: true,
        specialName: "Group Rate",
      };
    }

    // Standard rate
    return {
      basePrice: 65 * numberOfGuests,
      pricePerPerson: 65,
      isSpecial: false,
      specialName: null,
    };
  };

  const pricing = calculatePricing();

  // ✅ FIRST ACTIVITY ALWAYS INCLUDED
  const calculateAdditionalActivitiesCost = () => {
    // Ensure selectedActivities is an array
    if (!Array.isArray(selectedActivities) || selectedActivities.length <= 1) {
      return 0;
    }

    // Exclude first activity (always included)
    const additionalActivities = selectedActivities.slice(1);

    return additionalActivities.reduce((total, activity) => {
      const activityInfo = Activities.find((a) => a.label === activity);
      return total + (activityInfo?.price ?? 0);
    }, 0);
  };

  const calculateAddOnsCost = () => {
    // Ensure selectedAddOns is an array
    if (!Array.isArray(selectedAddOns) || selectedAddOns.length === 0) {
      return 0;
    }

    return selectedAddOns.reduce((total, addOn) => {
      const addOnInfo = AddOns.find((a) => a.label === addOn);
      const price = addOnInfo?.price ?? 0;
      // If add-on is per person, multiply by number of guests
      return total + (addOnInfo?.perPerson ? price * numberOfGuests : price);
    }, 0);
  };

  const additionalActivitiesCost = calculateAdditionalActivitiesCost();
  const addOnsCost = calculateAddOnsCost();

  // ✅ TOTAL AMOUNT CHARGED UPFRONT
  const totalAmount = pricing.basePrice + additionalActivitiesCost + addOnsCost;

  const handleCheckout = async (body: Stripe.Checkout.SessionCreateParams) => {
    sendGTMEvent({
      event: "begin_reservation_checkout",
      theme: theme,
      total_amount: totalAmount,
      guests: numberOfGuests,
      is_special_rate: pricing.isSpecial,
      special_name: pricing.specialName || "standard",
      add_ons: selectedAddOns.join(", "),
      activities: selectedActivities.join(", "),
      utm_source: trackingData?.utm_source || "direct",
      utm_campaign: trackingData?.utm_campaign || "none",
      gclid: trackingData?.gclid || null,
    });

    const url = await checkout(body);
    if (url) router.push(url);
    setIsSubmitting(false);
  };

  const onSubmit: SubmitHandler<ReservationsFormInputs> = async (
    reservation,
  ) => {
    setIsSubmitting(true);
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
      setIsSubmitting(false);
      return;
    }

    const currentUrl = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    const reservationsData = formatReservationsData({
      redirect_url: currentUrl,
      ReservationsFormData: reservation,
      user_id: user?.id,
      total: totalAmount,
      additionalActivitiesCost: additionalActivitiesCost,
      addOnsCost: addOnsCost,
      basePrice: pricing.basePrice,
    });

    handleCheckout(reservationsData);
  };

  const handleSelectDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", selectedDate);
    router.push(`?${params.toString()}`, { scroll: false });
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

  // ✅ Watch only required fields to trigger re-render
  const [name, email, phone, selectedDate, dateTime] = watch([
    "name",
    "email",
    "phone",
    "date",
    "dateTime",
  ]);

  // ✅ Simple check: form is valid AND has required values
  const canSubmit =
    isValid &&
    name &&
    email &&
    phone &&
    selectedDate &&
    dateTime &&
    !isSubmitting;

  const hasActiveSpecial =
    pricing.isSpecial && themeConfig.specialRate?.guestCount === numberOfGuests;
  const SpecialIcon = themeConfig.specialRate?.icon || Heart;
  const colorClasses = themeConfig.specialRate
    ? getColorClasses(themeConfig.specialRate.color)
    : getColorClasses("rose");

  return (
    <div className="w-full">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm"
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
                {...register("name", { required: "Name is required" })}
              />

              <Input
                leadingIcon={Mail}
                errorMessage={errors.email?.message}
                type="email"
                id="email"
                placeholder="Your Email"
                required
                className="pl-12 py-3 rounded-xl border-2 border-neutral-200 focus:border-neutral-900 transition-colors"
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
                className="pl-12 py-3 rounded-xl border-2 border-neutral-200 focus:border-neutral-900 transition-colors"
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

          {/* Date & Time Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <Text size="lg" className="font-bold text-neutral-900">
                Select Date & Time
              </Text>
            </div>

            <div className="space-y-6 w-full max-w-full">
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
                className="py-3 rounded-xl border-2 border-neutral-200 focus:border-neutral-900 transition-colors w-full"
                {...register("date", {
                  required: "Date is required",
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
                    Available Time Slots
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
                      Select a date to view available times
                    </Text>
                  </div>
                )}
              </div>

              <div>
                <Input
                  leadingIcon={Users}
                  errorMessage={errors.guests?.message}
                  defaultValue={themeConfig.defaultGuests}
                  max={20}
                  min={1}
                  type="number"
                  id="guests"
                  placeholder="Number of Guests"
                  className="pl-12 py-3 rounded-xl border-2 border-neutral-200 focus:border-neutral-900 transition-colors"
                  {...register("guests", {
                    required: "Number of guests is required",
                    min: { value: 1, message: "At least 1 guest required" },
                    max: { value: 20, message: "Maximum 20 guests" },
                  })}
                />

                {/* ✅ Theme-specific special rate badge */}
                {hasActiveSpecial && themeConfig.specialRate && (
                  <div
                    className={`mt-3 rounded-xl p-4 border ${colorClasses.badgeBg} ${colorClasses.badgeBorder}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <SpecialIcon
                        className={`w-5 h-5 ${colorClasses.badgeText}`}
                      />
                      <span className={`font-bold ${colorClasses.badgeText}`}>
                        {themeConfig.specialRate.name} Applied! $
                        {themeConfig.specialRate.price}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 mb-3">
                      {themeConfig.specialRate.description}
                    </p>
                    <div className="space-y-1.5">
                      {themeConfig.specialRate.includes.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-sm text-neutral-700"
                        >
                          <span className={`mt-0.5 ${colorClasses.badgeText}`}>
                            ✓
                          </span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Group rate badge */}
                {numberOfGuests >= 5 && !hasActiveSpecial && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-semibold">
                      Group Rate Applied! Save ${(65 - 50) * numberOfGuests}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Activities & Add-Ons Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm"
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
                <div className="flex items-center justify-between mb-3">
                  <Text size="sm" className="font-medium text-neutral-700">
                    Select Activities
                  </Text>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    1st activity always included ✨
                  </span>
                </div>
                <MultiSelectField
                  fieldName="activities"
                  options={Activities.map((activity) => activity.label)}
                />
                <p className="mt-2 text-xs text-neutral-500">
                  Choose candle making, body butter, or soap making
                </p>
              </div>

              {/* Add-Ons Section */}
              <div>
                <Text size="sm" className="font-medium text-neutral-700 mb-3">
                  Enhance Your Experience (Optional)
                </Text>

                {/* Filter add-ons based on theme */}
                <div className="space-y-3">
                  {AddOns.filter(
                    (addon) => !addon.bestFor || addon.bestFor.includes(theme),
                  ).map((addon) => {
                    const addonPrice = addon.perPerson
                      ? addon.price * numberOfGuests
                      : addon.price;

                    return (
                      <label
                        key={addon.label}
                        className="flex items-start gap-3 p-4 border-2 border-neutral-200 rounded-xl hover:border-neutral-900 cursor-pointer transition-colors has-checked:border-neutral-900 has-checked:bg-neutral-50"
                      >
                        <input
                          type="checkbox"
                          value={addon.label}
                          className="mt-1 w-5 h-5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                          {...register("addOns")}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{addon.icon}</span>
                            <span className="font-semibold">{addon.label}</span>
                            <span className="ml-auto font-bold text-neutral-900">
                              +${addonPrice}
                              {addon.perPerson && (
                                <span className="text-xs text-neutral-500 ml-1">
                                  (${addon.price}/person)
                                </span>
                              )}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-600 mb-2">
                            {addon.description}
                          </p>
                          {addon.includes && (
                            <details className="text-xs text-neutral-500">
                              <summary className="cursor-pointer hover:text-neutral-700 font-medium">
                                See what&apos;s included
                              </summary>
                              <ul className="mt-2 space-y-1 pl-4">
                                {addon.includes.map((item, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2"
                                  >
                                    <span className="text-green-600">✓</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </details>
                          )}
                          {addon.ageRestricted && (
                            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                              <span>🔞</span> 21+ only
                            </p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pricing Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-linear-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 shadow-lg text-white sticky top-4"
          >
            <Text size="lg" className="font-bold mb-6">
              Reservation Summary
            </Text>

            <div className="space-y-4">
              {/* ✅ Dynamic Special Banner */}
              {hasActiveSpecial && themeConfig.specialRate && (
                <div
                  className={`${colorClasses.bg} border ${colorClasses.border} rounded-xl p-4`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <SpecialIcon
                      className={`w-4 h-4 ${colorClasses.text} fill-current`}
                    />
                    <Text
                      size="sm"
                      className={`font-semibold ${colorClasses.text}`}
                    >
                      {themeConfig.specialRate.name} Active!
                    </Text>
                  </div>
                  <Text size="xs" className="text-white/70">
                    ${themeConfig.specialRate.price} includes everything
                  </Text>
                </div>
              )}

              {/* Group rate banner */}
              {numberOfGuests >= 5 && !hasActiveSpecial && (
                <div className="bg-yellow-300/20 border border-yellow-300/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <Text size="sm" className="font-semibold text-yellow-300">
                      Group Rate Applied!
                    </Text>
                  </div>
                  <Text size="xs" className="text-white/70">
                    Save ${(65 - 50) * numberOfGuests} with $50/person pricing
                  </Text>
                </div>
              )}

              {/* Base Price */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <Text size="sm" className="text-white/70">
                    {hasActiveSpecial
                      ? themeConfig.specialRate!.name
                      : "Base Experience"}
                  </Text>
                  <Text size="xs" className="text-white/50">
                    {hasActiveSpecial
                      ? `${numberOfGuests} people + 1 activity each`
                      : `$${pricing.pricePerPerson} × ${numberOfGuests} ${numberOfGuests > 1 ? "guests" : "guest"}`}
                  </Text>
                </div>
                <Text size="md" className="font-semibold">
                  ${pricing.basePrice}
                </Text>
              </div>

              {/* Activities */}
              {selectedActivities.length > 0 && (
                <div>
                  <Text size="sm" className="font-semibold mb-2">
                    Activities
                  </Text>
                  {selectedActivities.map((activity, index) => {
                    const activityInfo = Activities.find(
                      (a) => a.label === activity,
                    );
                    const isIncluded = index === 0; // First activity always included
                    return (
                      <div
                        key={activity}
                        className="flex items-center justify-between mb-2"
                      >
                        <Text size="sm" className="text-white/70">
                          {activity}
                          {isIncluded && (
                            <span className="ml-2 text-xs text-green-300">
                              ✨ Included
                            </span>
                          )}
                        </Text>
                        <Text size="sm" className="font-semibold">
                          {isIncluded ? "Included" : `+$${activityInfo?.price}`}
                        </Text>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add-Ons */}
              {selectedAddOns.length > 0 && (
                <div className="pt-4 border-t border-white/10">
                  <Text size="sm" className="font-semibold mb-3">
                    Add-Ons
                  </Text>
                  {selectedAddOns.map((addOn) => {
                    const addOnInfo = AddOns.find((a) => a.label === addOn);
                    const addonPrice = addOnInfo?.perPerson
                      ? addOnInfo.price * numberOfGuests
                      : (addOnInfo?.price ?? 0);

                    return (
                      <div
                        key={addOn}
                        className="flex items-center justify-between mb-2"
                      >
                        <Text size="sm" className="text-white/70">
                          {addOn}
                          {addOnInfo?.perPerson && (
                            <span className="text-xs text-white/50 ml-1">
                              (${addOnInfo.price}/person)
                            </span>
                          )}
                        </Text>
                        <Text size="sm" className="font-semibold">
                          +${addonPrice}
                        </Text>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ✅ TOTAL DUE TODAY (FULL AMOUNT) */}
              <div className="pt-4 border-t border-white/10">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Text size="md" className="font-bold">
                        Total Due Today
                      </Text>
                      <Text size="xs" className="text-white/60 mt-1">
                        Full payment • No surprise charges
                      </Text>
                    </div>
                    <Text size="xxl" className="font-bold text-yellow-300">
                      ${totalAmount}
                    </Text>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 mt-4">
                <Text size="xs" className="text-white/60 leading-relaxed">
                  🔒 Full payment secures your reservation. Everything is
                  included—no additional charges on-site. Cancel 48+ hours ahead
                  for full refund.
                </Text>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <button
              disabled={!canSubmit}
              type="submit"
              className="w-full py-4 bg-neutral-900 text-white rounded-full font-bold text-lg hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? (
                "Processing..."
              ) : (
                <>
                  Complete Booking - ${totalAmount}
                  {hasActiveSpecial && ` (${pricing.specialName})`}
                </>
              )}
            </button>

            <p className="text-center text-xs text-neutral-500 mt-4">
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
};
