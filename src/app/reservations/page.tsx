import { Suspense } from "react";
import { Metadata } from "next";
import { LandingPageForm } from "@/components/client/Reservations/LandingPageForm";
import { Text } from "@/components/ds/Text";

export const metadata: Metadata = {
  title: "Book a Candle-Making Class | Candle Cow Bar Helena, AL",
  description:
    "Reserve your spot for a hands-on candle-making experience at Candle Cow Bar in Helena, AL. Create custom candles, learn the art of candle-making, and enjoy a unique experience with friends or solo. Book your class today!",
  openGraph: {
    title: "Book a Candle-Making Class | Candle Cow Bar",
    description:
      "Join us for a fun, hands-on candle-making experience in Helena, Alabama. Perfect for date nights, girls' night out, team building, or a creative solo activity. Reserve your spot today!",
    url: "https://www.candlecowbar.com/reservations",
    siteName: "Candle Cow Bar",
    images: [
      {
        url: "https://www.candlecowbar.com/ccbarlogo.svg",
        width: 1200,
        height: 630,
        alt: "Candle Cow Bar - Book Your Candle-Making Class",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a Candle-Making Class | Candle Cow Bar",
    description:
      "Reserve your spot for a hands-on candle-making experience in Helena, Alabama. Perfect for groups, date nights, or solo fun!",
    images: ["https://www.candlecowbar.com/ccbarlogo.svg"],
  },
  keywords: [
    "candle making class",
    "candle workshop",
    "Helena Alabama",
    "book candle class",
    "candle making experience",
    "DIY candle class",
    "date night Helena",
    "girls night out",
    "team building activity",
    "creative workshop",
    "hands-on candle making",
    "reserve candle class",
    "Candle Cow Bar reservations",
  ],
  alternates: {
    canonical: "https://www.candlecowbar.com/reservations",
  },
};

export default async function Reservations() {
  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-white">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-linear-to-br from-amber-100 to-rose-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <Text
              size="xxl"
              className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6"
            >
              Book Your Candle-Making Experience ✨
            </Text>
            <p className="text-lg sm:text-xl text-neutral-700 mb-6 sm:mb-8">
              Create custom candles in a fun, hands-on workshop. Perfect for
              date nights, celebrations, or just because!
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🕐</span>
                <span>90 Minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">👥</span>
                <span>1-20 Guests</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍷</span>
                <span>BYOB Friendly</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎨</span>
                <span>50+ Scents</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">
            What&apos;s Included in Your Experience
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6 rounded-xl bg-amber-50">
              <div className="text-4xl sm:text-5xl mb-4">🕯️</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                16oz Custom Candle
              </h3>
              <p className="text-sm sm:text-base text-neutral-600">
                Each person creates their own signature scent and takes home a
                premium 16oz candle
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-rose-50">
              <div className="text-4xl sm:text-5xl mb-4">👃</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                Scent Blending
              </h3>
              <p className="text-sm sm:text-base text-neutral-600">
                Choose from 50+ premium fragrances and create your perfect blend
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-amber-50">
              <div className="text-4xl sm:text-5xl mb-4">🎨</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                Expert Guidance
              </h3>
              <p className="text-sm sm:text-base text-neutral-600">
                Our team guides you through every step of the candle-making
                process
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-rose-50">
              <div className="text-4xl sm:text-5xl mb-4">🎉</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                Fun Activities
              </h3>
              <p className="text-sm sm:text-base text-neutral-600">
                Games and activities while your candles set (about 30 minutes)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 lg:py-20 bg-linear-to-br from-neutral-50 to-amber-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">
            Your Candle-Making Journey
          </h2>
          <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
            <div className="flex gap-4 sm:gap-6">
              <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                1
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">
                  Welcome & Scent Selection
                </h3>
                <p className="text-sm sm:text-base text-neutral-600">
                  Arrive and explore our scent bar. Smell, mix, and create your
                  unique fragrance blend.
                </p>
              </div>
            </div>
            <div className="flex gap-4 sm:gap-6">
              <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                2
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">
                  Melt, Pour & Create
                </h3>
                <p className="text-sm sm:text-base text-neutral-600">
                  Learn the art of candle making as you melt wax, add your
                  scent, and pour your creation.
                </p>
              </div>
            </div>
            <div className="flex gap-4 sm:gap-6">
              <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                3
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">
                  Set & Socialize
                </h3>
                <p className="text-sm sm:text-base text-neutral-600">
                  While your candles cool (about 30 minutes), enjoy games,
                  snacks, and great conversation!
                </p>
              </div>
            </div>
            <div className="flex gap-4 sm:gap-6">
              <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                4
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">
                  Label & Take Home
                </h3>
                <p className="text-sm sm:text-base text-neutral-600">
                  Personalize your candle with custom labels and take home your
                  handmade creation!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">
            Simple, Transparent Pricing
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <div className="border-2 border-neutral-200 rounded-xl p-6 sm:p-8 hover:border-amber-400 transition">
              <h3 className="text-2xl font-bold mb-2">Solo Experience</h3>
              <div className="text-4xl font-bold text-amber-600 mb-4">$65</div>
              <p className="text-neutral-600 mb-4">
                Perfect for treating yourself!
              </p>
              <ul className="space-y-2 text-sm sm:text-base">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>16oz custom candle</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>All materials included</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Expert guidance</span>
                </li>
              </ul>
            </div>

            <div className="border-2 border-amber-400 rounded-xl p-6 sm:p-8 bg-amber-50 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-white px-4 py-1 rounded-full text-sm font-bold">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2">Couples Experience</h3>
              <div className="text-4xl font-bold text-amber-600 mb-4">$85</div>
              <p className="text-neutral-600 mb-4">For 2 people - save $65!</p>
              <ul className="space-y-2 text-sm sm:text-base">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>2 custom 16oz candles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>BYOB friendly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Romantic atmosphere</span>
                </li>
              </ul>
            </div>

            <div className="border-2 border-neutral-200 rounded-xl p-6 sm:p-8 hover:border-amber-400 transition sm:col-span-2 lg:col-span-1">
              <h3 className="text-2xl font-bold mb-2">Group Event</h3>
              <div className="text-4xl font-bold text-amber-600 mb-4">
                $50<span className="text-xl text-neutral-600">/person</span>
              </div>
              <p className="text-neutral-600 mb-4">5+ guests</p>
              <ul className="space-y-2 text-sm sm:text-base">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Great for parties & events</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Team building activity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Private sessions available</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 sm:mt-12 text-center">
            <p className="text-sm sm:text-base text-neutral-600 mb-4">
              ✨ Add additional activities or refreshments during booking
            </p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 sm:py-16 lg:py-20 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <details className="bg-white rounded-lg p-4 sm:p-6 cursor-pointer">
              <summary className="font-bold text-base sm:text-lg mb-2">
                How long does the experience take?
              </summary>
              <p className="text-sm sm:text-base text-neutral-600">
                The full experience is about 90 minutes, including candle
                creation, cooling time, and activities.
              </p>
            </details>
            <details className="bg-white rounded-lg p-4 sm:p-6 cursor-pointer">
              <summary className="font-bold text-base sm:text-lg mb-2">
                Can I bring alcohol?
              </summary>
              <p className="text-sm sm:text-base text-neutral-600">
                Yes! We&apos;re BYOB friendly. Bring your favorite wine, beer,
                or beverages. We provide glasses and ice.
              </p>
            </details>
            <details className="bg-white rounded-lg p-4 sm:p-6 cursor-pointer">
              <summary className="font-bold text-base sm:text-lg mb-2">
                What&apos;s your cancellation policy?
              </summary>
              <p className="text-sm sm:text-base text-neutral-600">
                Cancel or reschedule up to 48 hours before your session for a
                full refund. Within 48 hours, we offer store credit.
              </p>
            </details>
            <details className="bg-white rounded-lg p-4 sm:p-6 cursor-pointer">
              <summary className="font-bold text-base sm:text-lg mb-2">
                Is this suitable for kids?
              </summary>
              <p className="text-sm sm:text-base text-neutral-600">
                Kids 8+ are welcome with adult supervision. We recommend our
                family sessions on Saturday mornings!
              </p>
            </details>
            <details className="bg-white rounded-lg p-4 sm:p-6 cursor-pointer">
              <summary className="font-bold text-base sm:text-lg mb-2">
                What if I&apos;ve never made a candle before?
              </summary>
              <p className="text-sm sm:text-base text-neutral-600">
                Perfect! No experience needed. Our friendly staff guides you
                through every step. First-timers are our specialty!
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking-form" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-48">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Book Your Experience?
            </h2>
            <p className="text-lg sm:text-xl text-neutral-600">
              Fill out the form below to reserve your spot!
            </p>
          </div>
          <Suspense
            fallback={<div className="text-center py-12">Loading...</div>}
          >
            <LandingPageForm theme="" />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
