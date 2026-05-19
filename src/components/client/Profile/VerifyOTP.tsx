"use client";

import { Text } from "@/components/ds/Text";
import { createClient } from "@/utils/supabase/client";
import { code } from "motion/react-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const OTP_LENGTH = 6;

export default function VerifyOTP({
  phone,
  onHandleVerify,
}: {
  phone: string;
  onHandleVerify?: () => void;
}) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleVerifyPhoneChange = useCallback(async () => {
    const { data, error } = await supabase.auth.verifyOtp({
      token: otp.join(""),
      type: "phone_change",
      phone,
    });

    if (error) {
      setError(error.message);
      throw error;
    }
    onHandleVerify?.();
    return data;
  }, [otp, phone, supabase, onHandleVerify]);

  // Auto-submit when all digits are filled with toast
  useEffect(() => {
    const code = otp.join("");
    if (code.length === OTP_LENGTH) {
      toast.promise(handleVerifyPhoneChange(), {
        loading: "Verifying code...",
        success: "Phone verified successfully!",
        error: (err) => `Verification failed: ${err.message || "Invalid code"}`,
      });
    }
  }, [otp, handleVerifyPhoneChange]);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    // only allow numbers
    const sanitized = value.replace(/\D/g, "");

    if (!sanitized) return;

    const digit = sanitized[0];

    const nextOtp = [...otp];
    nextOtp[index] = digit;

    setOtp(nextOtp);

    // move focus to next input
    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      const nextOtp = [...otp];

      // if current input has value, clear it
      if (otp[index]) {
        nextOtp[index] = "";
        setOtp(nextOtp);
        return;
      }

      // move backwards if already empty
      if (index > 0) {
        nextOtp[index - 1] = "";
        setOtp(nextOtp);

        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    const nextOtp = [...otp];

    pasted.split("").forEach((char, index) => {
      nextOtp[index] = char;
    });

    setOtp(nextOtp);

    const focusIndex =
      pasted.length >= OTP_LENGTH ? OTP_LENGTH - 1 : pasted.length;

    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full my-8">
      <div className="flex flex-col gap-2 justify-center items-center">
        {error && (
          <Text size="sm" className="text-red-500">
            {error}
          </Text>
        )}
        <Text size="md" className="text-center">
          Enter the 6-digit code sent to your phone
        </Text>
      </div>
      <div className="flex gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            disabled={code.length === OTP_LENGTH}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            autoComplete={index === 0 ? "one-time-code" : "off"}
            className="h-14 w-14 rounded-xl border border-neutral-300 text-center text-2xl font-semibold outline-none transition focus:border-black :disabled:bg-gray-200 disabled:cursor-not-allowed"
          />
        ))}
      </div>
    </div>
  );
}
