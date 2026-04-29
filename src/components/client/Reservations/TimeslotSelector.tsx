"use client"

import { montserrat } from "@/components/ds/Fonts";
import { Timeslot } from "@/types/Reservations";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";


 
export const TimeslotSelector = ({ available_timeslots, }: { available_timeslots: Timeslot[] }) => {
    const { setValue, watch, } = useFormContext();
    const selected = watch("time");

    useEffect(() => {
        if (available_timeslots.length > 0 && !available_timeslots.some(slot => slot.label === selected)) {
            setValue("time", available_timeslots[0].label);
        }
    }, [available_timeslots, selected, setValue]);

    const unselectedSlot = `px-4 py-2 border rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer text-center ${montserrat.className}`;
    const selectedSlot = `px-4 py-2 border rounded-md bg-black text-white cursor-pointer text-center #${montserrat.className}`;
    if (available_timeslots.length === 0) {
        return <p className="text-sm text-gray-500">No available time slots for the selected date.</p>;
    }
    return (<div className="mb-4">
        <ul className="grid grid-cols-2 gap-2">
            {available_timeslots.map((slot) => (
                <li
                    key={slot.value}
                    onClick={() => setValue("time", slot.label)}
                    className={selected === slot.label ? selectedSlot : unselectedSlot}
                >
                    {slot.label}
                </li>
            ))}
        </ul>
    </div>);
}