"use client";
import { montserrat } from "@/components/ds/Fonts";
import { Input } from "@/components/ds/Input";
import { Text } from "@/components/ds/Text";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import React from "react";
import { Mail, Sparkles, Check, AlertCircle } from "lucide-react";

export const Login = () => {
  const supabase = createClient();
  const [email, setEmail] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [dbError, setDbError] = React.useState("");
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const searchParams = useSearchParams();

  React.useEffect(() => {
    const errorMessage = searchParams.get("errorMessage");
    if (errorMessage) {
      setDbError(errorMessage);
    }
  }, [searchParams]);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const signInWithEmail = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: process.env.NEXT_PUBLIC_SUPABASE_AUTH_REDIRECT_URL!,
        },
      });
      if (error) {
        console.log({ error });
        setDbError(error.message);
      } else {
        setIsSubmitted(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    await signInWithEmail();
    setErrorMessage("");
    setDbError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-neutral-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <Text size="xxl" className="text-3xl font-bold text-neutral-900 mb-2">
            Welcome Back
          </Text>
          <Text size="sm" className="text-neutral-600 text-sm">
            Sign in to your Candle Cow Bar account
          </Text>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-neutral-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <Input
                  hideLabel
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={isSubmitted}
                  className={`w-full h-14 pl-12 pr-4 rounded-2xl border border-neutral-200 bg-neutral-50 text-sm outline-none transition focus:border-black focus:bg-white ${
                    errorMessage ? "border-red-500" : ""
                  } ${isSubmitted ? "opacity-50 cursor-not-allowed" : ""}`}
                  required
                />
              </div>
              {errorMessage && (
                <div className="flex items-center gap-2 text-red-600 text-xs mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValidEmail(email) || isSubmitting || isSubmitted}
              className={`w-full h-14 rounded-2xl bg-black text-white font-medium transition-all hover:bg-neutral-800 active:scale-[0.98] disabled:bg-neutral-300 disabled:cursor-not-allowed disabled:hover:bg-neutral-300 flex items-center justify-center gap-2 ${montserrat.className}`}
            >
              {isSubmitting ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <Text size="sm">Sending magic link...</Text>
                </>
              ) : isSubmitted ? (
                <>
                  <Check className="h-5 w-5" />
                  <Text size="sm">Check your email</Text>
                </>
              ) : (
                <>
                  <Mail className="h-5 w-5" />
                  <Text size="sm">Continue with Email</Text>
                </>
              )}
            </button>

            {/* Success Message */}
            {isSubmitted && (
              <div className="rounded-2xl bg-green-50 border border-green-200 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <Text
                      size="sm"
                      className="text-sm font-medium text-green-900 mb-1"
                    >
                      Magic link sent!
                    </Text>
                    <Text size="xs" className="text-xs text-green-700">
                      Check your inbox for a sign-in link. It may take a few
                      minutes to arrive.
                    </Text>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {dbError && (
              <div className="rounded-2xl bg-red-50 border border-red-200 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <Text
                      size="sm"
                      className="text-sm font-medium text-red-900 mb-1"
                    >
                      Something went wrong
                    </Text>
                    <Text size="xs" className="text-xs text-red-700">
                      {dbError}. Please try again or contact support.
                    </Text>
                  </div>
                </div>
              </div>
            )}

            {/* Info Text */}
            {!isSubmitted && (
              <div className="rounded-2xl bg-neutral-50 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-neutral-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-neutral-600 leading-relaxed">
                    <Text
                      size="md"
                      className="font-medium text-neutral-900 mb-1"
                    >
                      No password needed
                    </Text>
                    <Text>
                      We&apos;ll send you a magic link to sign in instantly. New
                      here? An account will be created for you automatically.
                    </Text>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer Terms */}
        <div className="mt-6 text-center">
          <Text size="xs" className="text-xs text-neutral-500 leading-relaxed">
            By continuing, you agree to receive SMS messages for account access
            and notifications. You may receive up to 5 messages per month. Reply
            STOP to unsubscribe, HELP for assistance. Message and data rates may
            apply. See our{" "}
            <a href="/privacy" className="underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline">
              Privacy Policy
            </a>
            . .
          </Text>
        </div>
      </div>
    </div>
  );
};
