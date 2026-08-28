"use client";

import { useEffect } from "react";
import { LandingPageForm } from "./LandingPageForm";
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

export default function KidsNightLanding({ trackingData }: Props) {
  useEffect(() => {
    analytics.trackElementViewed({
      event: "element_viewed",
      name: "Kids Night Landing Page",
      location: "hero",
      type: "landing_page",
      utm_source: trackingData.utm_source || "direct",
      utm_medium: trackingData.utm_medium || "none",
      utm_campaign: trackingData.utm_campaign || "none",
    });
  }, [trackingData]);

  const handleCTAClick = () => {
    analytics.trackElementClicked({
      location: "hero",
      event: "element_clicked",
      name: "Book Kids Night",
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-yellow-50 to-sky-50 py-8 md:py-24">
        <div className="container mx-auto px-4 lg:px-48 h-full flex items-center">
          <div className="max-w-4xl">
            <Text size="xxl" className="text-4xl md:text-7xl font-bold mb-6">
              The Most Fun Kids Night in Helena 🎉
            </Text>
            <Text size="lg" className="mb-8">
              Let your little ones unleash their creativity! Kids make their own
              candle or soap while having the time of their lives.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleCTAClick}
                className="bg-black text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-neutral-800 transition"
              >
                <Text size="md" className="text-sm md:text-lg">
                  Book Kids Night - $35/child
                </Text>
              </button>
              <button className="border-2 border-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-black hover:text-white transition">
                <Text size="md" className="text-sm md:text-lg">
                  See What Kids Make ▶️
                </Text>
              </button>
            </div>
            <Text size="sm" className="mt-4 text-sm text-neutral-600">
              ⭐️ 5.0 rating • Ages 6+ • Parent supervision welcome
            </Text>
          </div>
        </div>
      </section>

      {/* Why Kids Love This */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-48">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Kids Love This Experience
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-2">Get Creative</h3>
              <p className="text-neutral-600">
                Kids pick their own scents and colors to make something totally
                unique!
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🧼</div>
              <h3 className="text-xl font-bold mb-2">Hands-On Fun</h3>
              <p className="text-neutral-600">
                Mixing, pouring, and decorating keeps little hands busy and
                minds engaged.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🎁</div>
              <h3 className="text-xl font-bold mb-2">Take It Home</h3>
              <p className="text-neutral-600">
                Every kid leaves with their very own handmade creation — a
                keepsake they&apos;ll love!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            How It Works (90 Minutes)
          </h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Pick Your Scents & Colors
                </h3>
                <p className="text-neutral-600">
                  Kids browse our fun fragrance bar and choose their favorites —
                  bubblegum, cotton candy, you name it!
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Mix, Pour & Decorate</h3>
                <p className="text-neutral-600">
                  Our team guides every step. Kids pour their candle or soap and
                  add personal touches.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Games While It Sets</h3>
                <p className="text-neutral-600">
                  While creations cool, kids play fun games and make new
                  friends!
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Take Home Your Creation
                </h3>
                <p className="text-neutral-600">
                  Each child leaves with their handmade candle or soap — proudly
                  made by them!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            What Parents Are Saying
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-neutral-50 rounded-xl p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    ⭐
                  </span>
                ))}
              </div>
              <p className="text-neutral-700 mb-4">
                My daughter had the best time! She was so proud of her candle
                and hasn&apos;t stopped talking about it. We&apos;re already
                planning another visit!
              </p>
              <p className="font-semibold">- Amanda, mom of 2</p>
            </div>
            <div className="bg-neutral-50 rounded-xl p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    ⭐
                  </span>
                ))}
              </div>
              <p className="text-neutral-700 mb-4">
                Perfect birthday party idea! The staff was amazing with the
                kids. Every child left with a huge smile and something they made
                themselves.
              </p>
              <p className="font-semibold">- Marcus, dad of 3</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Book Kids Night?</h2>
          <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            Spots fill up fast! Reserve now and give your kids an unforgettable
            creative experience in Helena.
          </p>
        </div>
      </section>

      <div
        id="booking-form"
        className="container mx-auto sm:px-4 xl:px-48 sm:py-4 md:py-20"
      >
        <LandingPageForm
          trackingData={trackingData}
          theme={RESERVATION_THEMES.KIDS_NIGHT}
        />
      </div>
    </div>
  );
}
