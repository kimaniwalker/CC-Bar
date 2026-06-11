"use client";
import { montserrat } from "@/components/ds/Fonts";
import { Input } from "@/components/ds/Input";
import { MultiSelectField } from "@/components/ds/MultiSelect";
import { Text } from "@/components/ds/Text";
import useHandlePayment from "@/hooks/useHandleCheckout";
import useStripe from "@/hooks/useStripe";
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
  // inside your component:
  const selectedActivities =
    useWatch({ control: methods.control, name: "activities" }) ?? [];
  const selectedAddOns =
    useWatch({ control: methods.control, name: "addOns" }) ?? [];

  const router = useRouter();
  const { formatReservationsData } = useHandlePayment();
  const { checkout } = useStripe();
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
    const session = await checkout(body);
    if (session.url) router.push(session.url);
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
    const activityTotal = activities
      .slice(1) // first activity is always included
      .reduce((total, activity) => {
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
  const basePrice = 25;
  const estimatedTotal = basePrice + estimatedActivitiesAndAddOns;
  const remainingBalance = estimatedTotal - 25; // subtract Deposit

  return (
    <div className="py-8 flex justify-center w-full">
      <div className="flex flex-col p-4 w-full max-w-3xl justify-center items-center">
        <Text size="xxl" className="text-2xl font-bold mb-4 text-center">
          Your Experience Awaits
        </Text>
        <Text size="md" className="text-lg text-gray-600 text-center">
          An intimate, hands-on experience designed for creativity and
          relaxation.
        </Text>
        <Text size="sm" className="mt-2 text-gray-600 text-xs">
          Reservations available up to 30 days in advance
        </Text>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 w-full max-w-lg"
          >
            <div className="mb-4">
              <Input
                errorMessage={errors.name?.message}
                type="text"
                id="name"
                placeholder="Your Name"
                required
                {...register("name", { required: "This field is required" })}
              />
            </div>
            <div className="mb-4">
              <Input
                errorMessage={errors.email?.message}
                type="email"
                id="email"
                placeholder="Your Email"
                required
                {...register("email", { required: "This field is required" })}
              />
            </div>
            <div className="mb-4">
              <Input
                errorMessage={errors.phone?.message}
                type="tel"
                id="phone"
                placeholder="Your Phone Number"
                required
                {...register("phone", { required: "This field is required" })}
              />
            </div>
            <div className="mb-4 overflow-hidden">
              <Input
                errorMessage={errors.date?.message}
                defaultValue={date}
                min={today}
                max={maxDate}
                type="date"
                id="date"
                required
                className="appearance-none w-full"
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
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">
                Available timeslots
              </label>
              {isLoadingSlots ? (
                <TimeslotSelectorLoadingSkeleton />
              ) : date ? (
                <TimeslotSelector available_timeslots={timeSlots} />
              ) : (
                <Text className="text-sm text-gray-500">
                  Select a date to view available timeslots.
                </Text>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">
                Select Activities
              </label>

              <MultiSelectField
                fieldName="activities"
                options={Activities.map((activity) => activity.label)}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">
                Add-Ons (Optional)
              </label>
              <MultiSelectField
                fieldName="addOns"
                options={AddOns.map((addOn) => addOn.label)}
              />
            </div>
            <div className="mb-4">
              <Input
                errorMessage={errors.guests?.message}
                defaultValue={1}
                max={8}
                min={1}
                type="number"
                id="guests"
                placeholder="Number of Guests"
                {...register("guests", { required: "This field is required" })}
              />
            </div>
            <div className="mb-6 rounded-3xl border border-neutral-200 bg-neutral-50 p-5">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Text size="sm" className="text-neutral-500">
                    Estimated Experience Total
                  </Text>

                  <Text size="md" className="font-semibold text-black">
                    ${estimatedTotal /* base price */}
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
                      <Text size="sm" className="text-neutral-500">
                        {activity}
                      </Text>

                      <Text size="sm" className="font-semibold text-black">
                        {index === 0 ? `Included` : `+ $${activityInfo?.price}`}
                      </Text>
                    </div>
                  );
                })}

                {selectedAddOns.map((addOn, index) => {
                  const addOnInfo = AddOns.find((a) => a.label === addOn);
                  return (
                    <div key={addOn}>
                      {index === 0 && (
                        <Text
                          size="md"
                          className="text-sm font-semibold text-black mt-4"
                        >
                          Add-Ons
                        </Text>
                      )}
                      <div className="flex items-center justify-between">
                        <Text size="sm" className="text-neutral-500">
                          {addOn}
                        </Text>

                        <Text size="sm" className="font-semibold text-black">
                          + ${addOnInfo?.price}
                        </Text>
                      </div>
                    </div>
                  );
                })}

                <div className="flex items-center justify-between">
                  <Text
                    size="md"
                    className="text-sm font-semibold text-black mt-4"
                  >
                    Due Today
                  </Text>

                  <Text size="md" className="font-semibold text-black">
                    $25 Deposit
                  </Text>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
                  <div className="flex flex-col">
                    <Text size="sm" className="text-neutral-500">
                      Remaining Balance
                    </Text>

                    <Text size="sm" className="text-neutral-400">
                      Paid during your visit
                    </Text>
                  </div>

                  <Text size="md" className="font-semibold text-black">
                    ~${remainingBalance /* base price */} + tax
                  </Text>
                </div>

                <div className="rounded-2xl bg-white p-4">
                  <Text size="sm" className="leading-relaxed text-neutral-600">
                    Your reservation deposit secures your experience and will be
                    applied toward your final balance. Additional costs may vary
                    based on selected activities, add-ons, and in-store
                    upgrades.
                  </Text>
                </div>
              </div>
            </div>
            <button
              disabled={!isValid}
              type="submit"
              className={`w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-500 transition ${montserrat.className}`}
            >
              Reserve with $25 Deposit
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};
