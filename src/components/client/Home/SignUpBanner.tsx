"use client";
import { Text } from "@/components/ds/Text";
import { useRouter } from "next/navigation";

export default function SignUpBanner() {
  const router = useRouter();
  return (
    <section className="relative overflow-hidden bg-neutral-950 px-6 py-20 text-white">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-amber-200/70">
          Join The Experience
        </p>

        <Text
          size="xxl"
          className="mt-5 max-w-3xl text-4xl font-light leading-tight tracking-tight md:text-6xl text-amber-100"
        >
          Rewards, Perks & Exclusive Offers Await
        </Text>

        <Text
          size="sm"
          className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-300 md:text-xl"
        >
          Create your account in seconds with secure passwordless login. Earn
          rewards on purchases, save your favorites, and unlock access to
          exclusive deals, class announcements, and limited releases.
        </Text>

        {/* Benefits */}
        <div className="mt-12 grid w-full max-w-5xl gap-4 md:grid-cols-4">
          {[
            {
              icon: "⚡",
              title: "Quick & Easy",
              text: "Sign up in seconds with passwordless access.",
            },
            {
              icon: "🎁",
              title: "Exclusive Offers",
              text: "Get access to member-only deals and promotions.",
            },
            {
              icon: "⭐",
              title: "Earn Rewards",
              text: "Collect points on purchases and experiences.",
            },
            {
              icon: "🖤",
              title: "Save Favorites",
              text: "Keep track of products and upcoming classes.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:bg-white/10"
            >
              <div className="text-3xl">{item.icon}</div>

              <Text size="md" className="mt-4 text-lg font-medium">
                {item.title}
              </Text>

              <Text
                size="sm"
                className="mt-2 text-sm leading-relaxed text-neutral-300"
              >
                {item.text}
              </Text>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
          <button
            onClick={() => router.push("/auth/login")}
            className="rounded-full bg-white px-8 py-4 text-sm font-medium text-neutral-900 transition hover:bg-amber-100"
          >
            Create Free Account
          </button>

          <button
            onClick={() => router.push("/auth/login")}
            className="rounded-full border border-white/20 px-8 py-4 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Explore Rewards
          </button>
        </div>

        <p className="mt-6 text-sm text-neutral-500">
          No passwords. No hassle. Just a better shopping experience.
        </p>
      </div>
    </section>
  );
}
