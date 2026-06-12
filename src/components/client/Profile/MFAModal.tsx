"use client";
import { Input } from "@/components/ds/Input";
import { Text } from "@/components/ds/Text";
import { createClient } from "@/utils/supabase/client";
import React from "react";
import VerifyOTP from "./VerifyOTP";
import { toast } from "sonner";

export const MFAModal = () => {
  const [phone, setPhone] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);
  const [smsConsent, setSmsConsent] = React.useState<boolean>(false);
  const [step, setStep] = React.useState<"add_phone" | "verify_otp">(
    "add_phone",
  );

  const supabase = createClient();

  const handleAddPhone = async () => {
    if (!smsConsent) {
      throw new Error("Please agree to receive SMS messages");
    }

    const { data, error } = await supabase.auth.updateUser({ phone });

    if (error) {
      setError(error.message);
      throw error;
    }

    setStep("verify_otp");
    return data;
  };

  const onAddPhone = () => {
    toast.promise(handleAddPhone, {
      loading: "Sending verification code...",
      success: "Code sent! Check your phone",
      error: (err) => `Error: ${err.message || "Failed to send code"}`,
    });
  };

  return (
    <div className="rounded-3xl border border-neutral-200 bg-[#F8F5F1] p-5 relative flex flex-col items-start">
      <Text size="md" className="font-semibold text-neutral-900">
        Enable phone sign in
      </Text>

      <Text size="sm" className="mt-2 text-sm leading-6 text-neutral-500">
        Rewards await! Add your phone number for faster sign in and order
        updates.
      </Text>

      {step === "add_phone" ? (
        <>
          {error && (
            <Text size="sm" className="text-red-500">
              {error}
            </Text>
          )}
          <Input
            minLength={10}
            maxLength={11}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            hideLabel
            name="phone"
            type="tel"
            placeholder="Enter your phone number"
            className="my-4 w-full py-2 border-2 border-black rounded-full px-2 text-black font-semibold shadow-2xl"
          />

          {/* SMS Consent Checkbox */}
          <label className="flex items-start gap-3 mb-4 cursor-pointer group">
            <input
              type="checkbox"
              checked={smsConsent}
              onChange={(e) => setSmsConsent(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 focus:ring-offset-0 cursor-pointer"
            />
            <Text size="xs" className="text-sm text-neutral-500">
              By continuing, you agree to receive SMS messages for account
              access and notifications. You may receive up to 5 messages per
              month. Reply STOP to unsubscribe, HELP for assistance. Message and
              data rates may apply. See our{" "}
              <a href="/terms" className="underline hover:text-neutral-900">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline hover:text-neutral-900">
                Privacy Policy
              </a>
              .
            </Text>
          </label>

          <button
            onClick={onAddPhone}
            disabled={!phone}
            className="mt-2 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:bg-neutral-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="text-sm">Continue</span>
          </button>
        </>
      ) : (
        <VerifyOTP phone={phone} />
      )}
    </div>
  );
};
