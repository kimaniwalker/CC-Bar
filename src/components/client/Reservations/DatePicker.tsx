"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { ReservationsFormInputs, Timeslot } from "@/types/Reservations";
import fetchAvailableTimeSlots from "@/utils/Reservations/fetchAvailableTimeSlots";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { montserrat } from "@/components/ds/Fonts";
import { useRouter, useSearchParams } from "next/navigation";

type DatePickerProps = {
  allowedDays?: number[];
  onSlotsChange: (slots: Timeslot[]) => void;
};

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const DatePicker = ({ allowedDays, onSlotsChange }: DatePickerProps) => {
  const { setValue, watch } = useFormContext<ReservationsFormInputs>();
  const selectedDate = watch("date");
  const dateParam = useSearchParams().get("date");
  const router = useRouter();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewDate, setViewDate] = useState(() => {
    // ✅ If date param exists, open calendar to that month
    if (dateParam) {
      const [y, m] = dateParam.split("-").map(Number);
      return new Date(y, m - 1, 1);
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [loadingDate, setLoadingDate] = useState<string | null>(null);

  // ✅ On mount, if date param exists — set form value and fetch slots
  useEffect(() => {
    if (!dateParam) return;

    const fetchAndSet = async () => {
      setValue("date", dateParam);
      setLoadingDate(dateParam);
      const slots = await fetchAvailableTimeSlots({ date: dateParam });
      onSlotsChange(slots ?? []);
      setLoadingDate(null);
    };

    fetchAndSet();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const isPrevDisabled =
    new Date(year, month, 1) <=
    new Date(today.getFullYear(), today.getMonth(), 1);

  const formatDate = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const isDateDisabled = (date: Date) => {
    if (date < today) return true;
    if (allowedDays && !allowedDays.includes(date.getDay())) return true;
    return false;
  };

  const handleSelectDate = async (date: Date) => {
    if (isDateDisabled(date)) return;
    const formatted = formatDate(date);
    setValue("date", formatted);
    setLoadingDate(formatted);
    const slots = await fetchAvailableTimeSlots({ date: formatted });
    onSlotsChange(slots ?? []);
    setLoadingDate(null);
    router.push(`?date=${formatted}`, { scroll: false }); // ✅ Update URL with selected date
  };

  const cells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(year, month, i + 1),
    ),
  ];

  return (
    <div className={`w-full select-none ${montserrat.className}`}>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-5">
        <button
          type="button"
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          disabled={isPrevDisabled}
          className="w-8 h-8 flex items-center justify-center rounded-md text-neutral-400 hover:text-black hover:bg-neutral-100 disabled:opacity-20 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>

        <p className="text-sm font-bold tracking-widest uppercase text-neutral-800">
          {MONTHS[month]} {year}
        </p>

        <button
          type="button"
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="w-8 h-8 flex items-center justify-center rounded-md text-neutral-400 hover:text-black hover:bg-neutral-100 transition"
        >
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 mb-3">
        {DAYS.map((d) => (
          <p
            key={d}
            className="text-center text-[10px] font-bold tracking-widest uppercase text-neutral-400"
          >
            {d}
          </p>
        ))}
      </div>

      {/* Date Grid */}
      <div className="grid grid-cols-7 gap-y-2">
        {cells.map((date, i) => {
          if (!date) return <div key={`e-${i}`} />;

          const formatted = formatDate(date);
          const disabled = isDateDisabled(date);
          const isSelected = selectedDate === formatted;
          const isLoading = loadingDate === formatted;
          const isToday = formatDate(today) === formatted;

          return (
            <div key={formatted} className="flex items-center justify-center">
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleSelectDate(date)}
                className={`
                  relative w-9 h-9 flex items-center justify-center text-xs font-semibold rounded-lg transition-all duration-150
                  ${
                    disabled
                      ? "text-neutral-200 cursor-not-allowed"
                      : isSelected
                        ? "bg-neutral-900 text-white shadow-sm"
                        : isToday
                          ? "bg-neutral-100 text-neutral-900 ring-1 ring-neutral-300 hover:ring-neutral-900"
                          : "text-neutral-700 hover:bg-neutral-100"
                  }
                `}
              >
                {isLoading ? (
                  <span className="w-3 h-3 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  date.getDate()
                )}
                {isToday && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-neutral-900" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
