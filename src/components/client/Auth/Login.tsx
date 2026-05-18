"use client";
import { montserrat } from "@/components/ds/Fonts";
import { Input } from "@/components/ds/Input";
import { Text } from "@/components/ds/Text";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import React from "react";

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
    <div className="min-h-screen flex md:items-center justify-center bg-white md:bg-gray-100">
      <div className="bg-white p-4 md:p-8 rounded shadow-none md:shadow-md w-full max-w-lg flex flex-col">
        <form onSubmit={handleSubmit} className="space-y-6 m-4 md:m-16">
          <Text
            size="xxl"
            className="font-bold mb-6 md:mb-12 text-left md:text-center md: text-6xl"
          >
            Sign In
          </Text>
          <Input
            hideLabel
            disabled={isSubmitted}
            errorMessage={errorMessage}
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <button
            type="submit"
            disabled={!isValidEmail(email) || isSubmitting}
            className={`w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors ${montserrat.className} disabled:bg-gray-400 disabled:cursor-not-allowed`}
          >
            <Text as="span" size="sm" className="text-md">
              {" "}
              {isSubmitting
                ? "Creating your magic link ..."
                : "Sign In With Email"}{" "}
            </Text>
          </button>
          {isSubmitted ? (
            <Text as="span" size="xs" className={`text-green-600 text-center`}>
              If an account with that email exists, a magic link has been sent.
              Please check your inbox.
            </Text>
          ) : (
            <Text as="span" size="xs" className={` text-gray-600 text-center`}>
              Enter your email to receive a magic link for signing in.
              Don&apos;t have an account? It will be created for you! By signing
              in, you agree to our{" "}
              <a href="/terms" className="underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline">
                Privacy Policy
              </a>
              .
            </Text>
          )}
          {dbError && (
            <Text as="span" size="xs" className={`text-red-600 mt-2 block`}>
              Whoops, something went wrong - {dbError}. Please try again or
              contact support.
            </Text>
          )}
        </form>
      </div>
    </div>
  );
};
