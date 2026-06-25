"use client";
import { Text } from "@/components/ds/Text";
import { StockError } from "@/types/Product";
import { AlertCircle, X } from "lucide-react";

export const CheckoutErrorBanner = ({
  errors,
  onClearError,
}: {
  errors: StockError[];
  onClearError: (key: string) => void;
}) => {
  if (errors.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 rounded-2xl border-2 border-red-200 bg-red-50 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
        <div className="flex-1">
          <Text size="sm" className="font-semibold text-red-900 mb-2">
            Some items are unavailable
          </Text>
          <div className="space-y-2">
            {errors.map((error) => (
              <div
                key={error.key}
                className="flex items-center justify-between bg-white/60 rounded-lg p-2"
              >
                <Text size="sm" className="text-red-800">
                  {error.errorMessage}
                </Text>
                <button
                  onClick={() => onClearError(error.key)}
                  className="ml-2 text-red-600 hover:text-red-800 transition"
                  aria-label="Clear error"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
