"use client";

import { useFormContext } from "react-hook-form";
import { montserrat } from "./Fonts";

export const MultiSelectField = ({options, fieldName}:{options: string[], fieldName: string}) => {
  const { watch, setValue } = useFormContext();

  const selected: string[] = watch(fieldName) || [];

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      setValue(
        fieldName,
        selected.filter((item) => item !== option)
      );
    } else {
      setValue(fieldName, [...selected, option]);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((option) => {
        const isSelected = selected.includes(option);

        return (
          <button
            type="button"
            key={option}
            onClick={() => toggleOption(option)}
            className={`${montserrat.className} px-4 py-2 border rounded-md transition ${
              isSelected
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}