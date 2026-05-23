"use client";

import { Text } from "@/components/ds/Text";
import { RewardActionKey } from "@/types/Rewards";
import { withRewards } from "@/utils/Rewards/withRewards";
import { createClient } from "@/utils/supabase/client";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useUser } from "../Auth/AuthContext";
import { useRouter } from "next/navigation";
import { useModal } from "../ModalContext";

const OTP_LENGTH = 6;

export default function VerifyOTP({ phone }: { phone: string }) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const supabase = createClient();

  const { user } = useUser();
  const { close } = useModal();

  const router = useRouter();

  /**
   * Derived values
   */
  const code = useMemo(() => otp.join(""), [otp]);

  const isComplete = code.length === OTP_LENGTH;

  /**
   * Verify + reward flow
   */
  const handleVerify = useCallback(async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const rewardsData = await withRewards(
        RewardActionKey.ADD_PHONE,
        async () => {
          const { error } = await supabase.auth.verifyOtp({
            token: code,
            type: "phone_change",
            phone,
          });

          if (error) {
            setError(error.message);
            throw error;
          }

          close();
          router.refresh();
        },
        user?.id ?? "guest",
      );

      return rewardsData;
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, supabase, code, phone, close, router, user?.id]);

  /**
   * Single toast layer
   */
  const verifyWithToast = useCallback(async () => {
    return toast.promise(handleVerify, {
      loading: "Verifying phone...",
      success: (data) => {
        if (data?.data?.success && !data?.data?.already_completed) {
          return `🎉 Phone verified! +${data?.data?.reward_amount} points awarded!`;
        }

        return "✅ Phone verified!";
      },

      error: (err) =>
        err?.message || "Oops something went wrong. Please try again.",
    });
  }, [handleVerify]);

  /**
   * Handles OTP entry
   */
  const handleChange = async (value: string, index: number) => {
    const sanitized = value.replace(/\D/g, "");

    if (!sanitized) return;

    const digit = sanitized[0];

    const nextOtp = [...otp];

    nextOtp[index] = digit;

    setOtp(nextOtp);

    /**
     * Move focus forward
     */
    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    /**
     * Auto-submit when complete
     */
    const updatedCode = nextOtp.join("");

    if (updatedCode.length === OTP_LENGTH && !isSubmitting) {
      verifyWithToast();
    }
  };

  /**
   * Backspace handling
   */
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key !== "Backspace") return;

    e.preventDefault();

    const nextOtp = [...otp];

    /**
     * Clear current input
     */
    if (otp[index]) {
      nextOtp[index] = "";

      setOtp(nextOtp);

      return;
    }

    /**
     * Move backwards
     */
    if (index > 0) {
      nextOtp[index - 1] = "";

      setOtp(nextOtp);

      inputRefs.current[index - 1]?.focus();
    }
  };

  /**
   * Paste support
   */
  const handlePaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
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

    const updatedCode = nextOtp.join("");

    /**
     * Focus last relevant input
     */
    const focusIndex =
      pasted.length >= OTP_LENGTH ? OTP_LENGTH - 1 : pasted.length;

    inputRefs.current[focusIndex]?.focus();

    /**
     * Auto-submit on full paste
     */
    if (updatedCode.length === OTP_LENGTH && !isSubmitting) {
      verifyWithToast();
    }
  };

  return (
    <div className="my-8 flex w-full flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center justify-center gap-2">
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
            disabled={isSubmitting || isComplete}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            autoComplete={index === 0 ? "one-time-code" : "off"}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className="
              h-14
              w-14
              rounded-xl
              border
              border-neutral-300
              text-center
              text-2xl
              font-semibold
              outline-none
              transition
              focus:border-black
              disabled:cursor-not-allowed
              disabled:bg-neutral-100
            "
          />
        ))}
      </div>
    </div>
  );
}
