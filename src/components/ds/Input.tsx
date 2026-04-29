import React from "react";
import { inter, montserrat } from "./Fonts";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  errorMessage?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ errorMessage, name, ...props }, ref) => {
    const baseClasses = `mt-1 block w-full px-3 py-2 border ${
      errorMessage ? "border-red-800" : "border-gray-300"
    } rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm ${montserrat.className}`;

    const capitalizeFirstLetter = (str?: string) => {
      if (!str) return "";
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
      <>
        <label
          htmlFor={name}
          className={`block text-sm font-medium text-gray-700 ${inter.className}`}
        >
          {capitalizeFirstLetter(name)}
        </label>

        <input
          ref={ref}
          id={name}
          name={name}
          className={baseClasses}
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage ? `${name}-error` : undefined}
          {...props}
        />

        {errorMessage && (
          <p
            id={`${name}-error`}
            className={`text-xs text-red-800 mt-1 ${inter.className}`}
          >
            {errorMessage}
          </p>
        )}
      </>
    );
  }
);

Input.displayName = "Input";