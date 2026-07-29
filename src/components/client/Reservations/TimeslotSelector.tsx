"use client";

import { montserrat } from "@/components/ds/Fonts";
import { Text } from "@/components/ds/Text";
import { Timeslot } from "@/types/Reservations";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

export const TimeslotSelector = ({
  available_timeslots,
}: {
  available_timeslots: Timeslot[];
}) => {
  const {
    setValue,
    watch,
    register,
    formState: { errors },
    trigger,
  } = useFormContext();

  const selected = watch("time");

  // ✅ Register field with validation
  useEffect(() => {
    register("time", {
      validate: () => {
        if (available_timeslots.length === 0) {
          return "Please select a date with available time slots.";
        }
        return true;
      },
    });
  }, [register, available_timeslots]);

  // ✅ Auto-select first slot
  useEffect(() => {
    if (
      available_timeslots.length > 0 &&
      !available_timeslots.some((slot) => slot.label === selected)
    ) {
      setValue("time", available_timeslots[0].label, { shouldValidate: true });
      setValue("dateTime", available_timeslots[0].value);
    }

    // 🔥 revalidate when slots change
    trigger("time");
  }, [available_timeslots, selected, setValue, trigger]);

  const MAX_GUESTS = 20;
  const getSlotStatus = (total_guests: number) => {
    const remaining = MAX_GUESTS - total_guests;
    if (remaining <= 0)
      return { label: "Reserved", color: "text-red-500", disabled: true };
    if (remaining <= 5)
      return {
        label: `${remaining} spots left`,
        color: "text-orange-500",
        disabled: false,
      };
    return { label: "Available", color: "text-green-600", disabled: false };
  };

  if (available_timeslots.length === 0) {
    return (
      <div className="rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-6 text-center">
        <Text className="text-md font-semibold text-gray-700">
          No available timeslots for this date.
        </Text>
        <Text className="text-xs text-gray-400 mt-1">
          Please try selecting a different date to see available timeslots.
        </Text>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <ul className="grid grid-cols-2 gap-3">
        {available_timeslots.map((slot) => {
          const status = getSlotStatus(slot.total_guests);
          const isSelected = selected === slot.label;

          return (
            <li
              key={slot.value}
              onClick={() => {
                if (status.disabled) return;
                setValue("time", slot.label, { shouldValidate: true });
                setValue("dateTime", slot.value);
              }}
              className={`
                relative overflow-hidden rounded-xl border-2 px-4 py-4 text-center transition-all duration-200 ${montserrat.className}
                ${
                  status.disabled
                    ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                    : isSelected
                      ? "border-black bg-black text-white shadow-lg scale-[1.02]"
                      : "border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm cursor-pointer"
                }
              `}
            >
              {/* ✅ X overlay for booked slots */}
              {status.disabled && (
                <span className="absolute inset-0 pointer-events-none">
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="absolute w-full h-[1.5px] bg-gray-300 rotate-20" />
                    <span className="absolute w-full h-[1.5px] bg-gray-300 rotate-[-20deg]" />
                  </span>
                </span>
              )}

              {/* ✅ Selected checkmark */}
              {isSelected && (
                <span className="absolute top-2 right-2 text-white text-xs">
                  ✓
                </span>
              )}

              <span
                className={`block text-sm font-bold tracking-wide ${status.disabled ? "text-gray-300" : ""}`}
              >
                {slot.label}
              </span>

              <span
                className={`block text-[11px] mt-1 font-medium tracking-wide uppercase
                ${
                  status.disabled
                    ? "text-gray-300"
                    : isSelected
                      ? "text-gray-300"
                      : status.color
                }`}
              >
                {status.disabled ? "Booked" : status.label || "Open"}
              </span>
            </li>
          );
        })}
      </ul>

      {errors.time && (
        <p className="text-xs text-red-600 mt-2">
          {errors.time.message as string}
        </p>
      )}
    </div>
  );
};
