"use client";

import { useEffect } from "react";
import { CoffeeWithJoeForm } from "./CoffeeWithJoeForm";
import { RESERVATION_THEMES } from "./ThemeMetadata";
import { analytics } from "@/utils/Analytics/analytics";
import { Text } from "@/components/ds/Text";

type TrackingData = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
};

type Props = {
  trackingData: TrackingData;
};

export default function CoffeeWithJoeLanding({ trackingData }: Props) {
  useEffect(() => {
    analytics.trackElementViewed({
      event: "element_viewed",
      name: "Coffee with Joe Landing Page",
      location: "hero",
      type: "landing_page",
      theme: "coffee-with-joe",
      utm_source: trackingData.utm_source || "direct",
      utm_medium: trackingData.utm_medium || "none",
      utm_campaign: trackingData.utm_campaign || "none",
    });
  }, [trackingData]);

  const handleCTAClick = () => {
    analytics.trackElementClicked({
      location: "hero",
      event: "element_clicked",
      name: "Reserve Coffee with Joe Ticket",
      utm_source: trackingData.utm_source || "direct",
      utm_medium: trackingData.utm_medium || "none",
      utm_campaign: trackingData.utm_campaign || "none",
    });

    const formSection = document.getElementById("booking-form");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] text-neutral-900">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,196,101,0.28),transparent_28%),linear-gradient(135deg,#fffaf3_0%,#fff7ed_35%,#f7efe7_100%)] py-10 md:py-20">
        <div className="container mx-auto max-w-6xl px-4 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <span className="inline-flex rounded-full border border-amber-200 bg-amber-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-900">
                Reservation only • ticketed event
              </span>

              <Text
                size="xxl"
                className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl"
              >
                Join Joe Lockett for Coffee, No Suga!
              </Text>

              <Text
                size="lg"
                className="mt-5 max-w-xl text-base text-neutral-700 sm:text-lg"
              >
                An intimate evening of candle-making, honest conversations about
                love, dating after 50, and new beginnings. Create a candle and
                name your next chapter.
              </Text>

              <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium text-neutral-800">
                <span className="rounded-full border border-amber-200 bg-amber-100 px-3 py-1.5">
                  Date: 10/23
                </span>
                <span className="rounded-full border border-amber-200 bg-amber-100 px-3 py-1.5">
                  Time: 7:00 PM - 9:00 PM
                </span>
                <span className="rounded-full border border-amber-200 bg-amber-100 px-3 py-1.5">
                  Only 20 tickets available
                </span>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={handleCTAClick}
                  className="rounded-full bg-neutral-950 px-8 py-4 text-base font-semibold text-white transition hover:bg-neutral-800"
                >
                  Reserve Your Ticket • $55
                </button>
                <button className="rounded-full border border-neutral-300 bg-white px-8 py-4 text-base font-semibold text-neutral-900 transition hover:border-neutral-400 hover:bg-neutral-50">
                  See what&apos;s included
                </button>
              </div>

              <div className="mt-8 flex flex-wrap gap-6 text-sm text-neutral-700">
                <span>🕯️ Candle & refreshments</span>
                <span>☕ Coffee + mingling</span>
                <span>🎟️ One ticket per guest</span>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] border border-amber-200 bg-white/80 p-6 shadow-2xl shadow-amber-200/30 backdrop-blur-sm">
                <div className="rounded-[1.5rem] bg-neutral-950 p-6 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">
                    Event ticket
                  </p>
                  <p className="mt-4 text-4xl font-black">$55</p>
                  <p className="mt-2 text-sm text-neutral-300">Per ticket</p>
                  <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-amber-200">
                    10/23 • 7:00 PM - 9:00 PM
                  </p>
                  <p className="mt-2 text-xs text-neutral-300">
                    Only 20 tickets available
                  </p>

                  <div className="mt-6 space-y-4 text-sm text-neutral-200">
                    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                      <span>Access</span>
                      <span className="font-semibold text-white">
                        Reservation entry
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                      <span>Includes</span>
                      <span className="font-semibold text-white">
                        Candle + refreshments
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span>Experience</span>
                      <span className="font-semibold text-white">
                        Relax + mingle
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCTAClick}
                    className="mt-8 w-full rounded-full bg-amber-400 px-5 py-3.5 text-sm font-bold text-neutral-900 transition hover:bg-amber-300"
                  >
                    Purchase ticket
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
              What&apos;s included
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Real Conversations with Joe
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
              <div className="mb-4 text-4xl">💬</div>
              <h3 className="text-xl font-bold">Real Conversations with Joe</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                Honest lessons about love, dating, and becoming your best self
                after 50.
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
              <div className="mb-4 text-4xl">🕯️</div>
              <h3 className="text-xl font-bold">Create and Name your Candle</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                Craft a signature candle representing your next chapter.
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
              <div className="mb-4 text-4xl">☕</div>
              <h3 className="text-xl font-bold">Connect and Celebrate</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                Coffee, refreshments, laughter, new connections, and a memorable
                evening.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 py-16 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-200">
            Your experience
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            Real Conversations with Joe
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-neutral-300 sm:text-lg">
            Honest lessons about love, dating, and becoming your best self after
            50.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="rounded-[2rem] border border-neutral-200 bg-neutral-50 p-8 sm:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
                  Ticket price
                </p>
                <p className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                  $55 per ticket
                </p>
              </div>

              <button
                onClick={handleCTAClick}
                className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                Reserve your spot
              </button>
            </div>
          </div>
        </div>
      </section>

      <div
        id="booking-form"
        className="container mx-auto px-4 py-8 sm:px-4 md:py-16 xl:px-48"
      >
        <CoffeeWithJoeForm
          trackingData={trackingData}
          theme={RESERVATION_THEMES.COFFEE_WITH_JOE}
        />
      </div>
    </div>
  );
}
