"use client";

import { useEffect } from "react";
import { sendGTMEvent } from "@next/third-parties/google";

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

export default function DateNightLanding({ trackingData }: Props) {
  useEffect(() => {
    // Track landing page view
    sendGTMEvent({
      event: "landing_page_view",
      theme: "date-night",
      utm_source: trackingData.utm_source || "direct",
      utm_medium: trackingData.utm_medium || "none",
      utm_campaign: trackingData.utm_campaign || "none",
      gclid: trackingData.gclid || null,
    });
  }, [trackingData]);

  const handleCTAClick = (location: string) => {
    sendGTMEvent({
      event: "cta_click",
      theme: "date-night",
      cta_location: location,
      utm_campaign: trackingData.utm_campaign,
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-150 bg-linear-to-br from-rose-50 to-amber-50">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">
              The Most Unique Date Night in Helena 💕
            </h1>
            <p className="text-xl text-neutral-700 mb-8">
              Skip dinner & a movie. Create custom candles together, laugh, and
              make memories that last forever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleCTAClick("hero")}
                className="bg-black text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-neutral-800 transition"
              >
                Book Your Date Night - $75/couple
              </button>
              <button className="border-2 border-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-black hover:text-white transition">
                Watch How It Works ▶️
              </button>
            </div>
            <p className="mt-4 text-sm text-neutral-600">
              ⭐️ 5.0 rating • 200+ couples served • BYOB friendly
            </p>

            {/* Campaign-specific messaging */}
            {trackingData.utm_campaign?.includes("valentines") && (
              <div className="mt-6 bg-rose-100 border-2 border-rose-300 rounded-lg p-4">
                <p className="text-rose-900 font-semibold">
                  💝 Valentines Special: Book by Feb 10 and get a complimentary
                  rose candle!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why This Beats Dinner & Movies */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Couples Love This Experience
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🕯️</div>
              <h3 className="text-xl font-bold mb-2">Create Together</h3>
              <p className="text-neutral-600">
                Bond over a hands-on activity. Way more fun than staring at a
                screen!
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🥂</div>
              <h3 className="text-xl font-bold mb-2">BYOB Friendly</h3>
              <p className="text-neutral-600">
                Bring your favorite wine or beer. We provide the glasses!
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💝</div>
              <h3 className="text-xl font-bold mb-2">Take Home Memories</h3>
              <p className="text-neutral-600">
                Each person makes a custom candle. Light it to remember your
                date!
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
                <h3 className="text-xl font-bold mb-2">Pick Your Scents</h3>
                <p className="text-neutral-600">
                  Choose from 50+ premium fragrances. Mix and match to create
                  your signature scent!
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Pour & Personalize</h3>
                <p className="text-neutral-600">
                  Melt, pour, and decorate. Our team guides you every step of
                  the way.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Take Home Your Creation
                </h3>
                <p className="text-neutral-600">
                  Each person leaves with a 16oz candle (60+ hour burn time).
                  Perfect keepsake!
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
            What Couples Are Saying
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
                Best date night ever! So much more fun than dinner. We loved
                creating something together and the BYOB option was perfect!
              </p>
              <p className="font-semibold">- Sarah & Mike</p>
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
                Amazing experience! The staff was so helpful and our candles
                turned out beautiful. Already planning our next visit!
              </p>
              <p className="font-semibold">- Jessica & David</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Book Your Date Night?
          </h2>
          <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            Spots fill up fast! Reserve your time now and get ready for the best
            date night in Helena.
          </p>
          <button
            onClick={() => handleCTAClick("footer")}
            className="bg-white text-black px-10 py-5 rounded-full font-bold text-lg hover:bg-neutral-100 transition"
          >
            Book Now - $75/couple
          </button>
          <p className="mt-6 text-sm text-neutral-400">
            Classes available Thursday-Sunday • No experience needed • BYOB
            friendly
          </p>
        </div>
      </section>
    </div>
  );
}
