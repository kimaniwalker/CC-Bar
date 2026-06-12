import React from "react";
import { inter, montserrat } from "./Fonts";
import { LucideIcon } from "lucide-react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  errorMessage?: string;
  hideLabel?: boolean;
  leadingIcon?: LucideIcon;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      errorMessage,
      hideLabel = false,
      className,
      name,
      leadingIcon: LeadingIcon,
      ...props
    },
    ref,
  ) => {
    const baseClasses = `mt-1 block w-full box-border ${
      LeadingIcon ? "pl-12 pr-3" : "px-3"
    } py-2 border ${
      errorMessage ? "border-red-800" : "border-gray-300"
    } rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm ${montserrat.className} ${className ?? ""}`;

    const capitalizeFirstLetter = (str?: string) => {
      if (!str) return "";
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
      <>
        {!hideLabel && (
          <label
            htmlFor={name}
            className={`block text-sm font-medium text-gray-700 ${inter.className}`}
          >
            {capitalizeFirstLetter(name)}
          </label>
        )}

        <div className="relative">
          {LeadingIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <LeadingIcon className="w-5 h-5 text-neutral-400" />
            </div>
          )}

          <input
            ref={ref}
            id={name}
            name={name}
            className={baseClasses}
            aria-invalid={!!errorMessage}
            aria-describedby={errorMessage ? `${name}-error` : undefined}
            {...props}
          />
        </div>

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
  },
);

Input.displayName = "Input";
