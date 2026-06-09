"use client";

import { useRouter } from "next/navigation";
import { Text } from "@/components/ds/Text";
import { handleSubscriptionSignup } from "@/utils/Subscriptions/handleSubscriptionSignup";
import { User } from "@supabase/supabase-js";
import { Sparkles } from "lucide-react";

export const SubscriptionSignup = ({ user }: { user: User | null }) => {
  const router = useRouter();

  const handleSubscribe = async () => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    const url = await handleSubscriptionSignup({
      metadata: {
        user_id: user.id,
        ...(user.email && { email: user.email }),
      },
      redirect_url: "/profile/overview?section=profile",
    });

    if (url) {
      router.push(url);
    } else {
      console.error("Failed to create checkout session");
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-linear-to-br bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-blue-500">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <Text size="lg" className="font-semibold">
          Subscribe & Save
        </Text>
      </div>

      {/* Benefits */}
      <div className="mb-6 space-y-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100">
            <span className="text-xs text-purple-700">✓</span>
          </div>
          <Text size="sm" className="leading-relaxed text-neutral-700">
            <span className="font-medium">15% off</span> all orders
          </Text>
        </div>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100">
            <span className="text-xs text-purple-700">✓</span>
          </div>
          <Text size="sm" className="leading-relaxed text-neutral-700">
            <span className="font-medium">Free shipping</span> on all orders
          </Text>
        </div>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100">
            <span className="text-xs text-purple-700">✓</span>
          </div>
          <Text size="sm" className="leading-relaxed text-neutral-700">
            <span className="font-medium">Exclusive access</span> to new
            products
          </Text>
        </div>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100">
            <span className="text-xs text-purple-700">✓</span>
          </div>
          <Text size="sm" className="leading-relaxed text-neutral-700">
            <span className="font-medium">Cancel anytime</span> - no commitment
          </Text>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleSubscribe}
        className="w-full rounded-2xl bg-black py-3 text-sm font-medium text-white transition hover:from-purple-700 hover:to-blue-700"
      >
        Start Subscription
      </button>
    </div>
  );
};
