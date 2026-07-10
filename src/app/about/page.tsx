import { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  Heart,
  Users,
  Award,
  Calendar,
  ShoppingBag,
  Flame,
  Crown,
  Palette,
} from "lucide-react";
import { Text } from "@/components/ds/Text";
import HowItWorks from "@/components/client/Home/HowItWorks";

export const metadata: Metadata = {
  title: "About Us | Candle Cow Bar",
  description:
    "Learn about Candle Cow Bar's story, mission, and our passion for creating unique candle experiences in Helena.",
  openGraph: {
    title: "About Us | Candle Cow Bar",
    description:
      "Discover the story behind Helena's premier candle-making experience.",
    url: "https://www.candlecowbar.com/about",
    siteName: "Candle Cow Bar",
    images: [
      {
        url: "https://www.candlecowbar.com/og-about.jpg",
        width: 1200,
        height: 630,
        alt: "Candle Cow Bar About Us",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="relative py-10 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-purple-100 via-pink-50 to-yellow-50 opacity-50" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-purple-600 to-pink-600 mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <Text
            size="xxl"
            className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6"
          >
            Our Story
          </Text>
          <p className="text-xl text-neutral-600 leading-relaxed">
            Where creativity meets community in Helena&apos;s most unique
            candle-making experience
          </p>
        </div>
      </section>

      {/* Main Story Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md aspect-square rounded-3xl bg-linear-to-br from-purple-600 via-pink-600 to-yellow-500 p-12 flex items-center justify-center shadow-2xl">
              <Flame className="w-full h-full text-white" strokeWidth={1.5} />
            </div>
          </div>
          <div className="space-y-6">
            <Text size="xxl" className="text-4xl font-bold text-neutral-900">
              Welcome to Candle Cow Bar
            </Text>
            <p className="text-lg text-neutral-600 leading-relaxed">
              Born from a passion for creativity and community, Candle Cow Bar
              is Helena&apos;s premier destination for handcrafted candle
              experiences. We believe that everyone deserves a moment to slow
              down, create something beautiful, and connect with others.
            </p>
            <p className="text-lg text-neutral-600 leading-relaxed">
              Whether you&apos;re crafting your signature scent at one of our
              candle-making classes, shopping our curated collection, or
              becoming a VIP member for exclusive perks, we&apos;re here to
              light up your world—one candle at a time.
            </p>
            <div className="flex items-center gap-4 pt-4 flex-wrap">
              <Link
                href="/reservations"
                className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-full font-semibold hover:bg-neutral-800 transition-all"
              >
                <Calendar className="w-5 h-5" />
                Book an Experience
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-neutral-900 text-neutral-900 rounded-full font-semibold hover:bg-neutral-50 transition-all"
              >
                <ShoppingBag className="w-5 h-5" />
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Text
              size="xxl"
              className="text-4xl font-bold text-neutral-900 mb-4"
            >
              What We Stand For
            </Text>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Our core values guide everything we do, from the candles we create
              to the experiences we provide.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                Passion for Craft
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Every candle is crafted with love and attention to detail. We
                use premium soy wax, high-quality fragrance oils, and
                sustainable materials.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                Community First
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                We&apos;re more than a candle shop—we&apos;re a gathering place
                for creativity, connection, and celebration. Join our community!
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                Excellence Always
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                From our candle-making classes to our subscription boxes,
                we&apos;re committed to delivering exceptional experiences every
                single time.
              </p>
            </div>
          </div>
        </div>
      </section>
      <HowItWorks />

      {/* Experience Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Experience the Magic
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Discover all the ways to engage with Candle Cow Bar
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Classes */}
            <div className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all bg-linear-to-br from-purple-600 to-pink-600 p-8">
              <div className="flex flex-col items-center text-center text-white h-64 justify-center">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Palette className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Candle Classes</h3>
                <p className="text-white/90 mb-4">
                  Create your own custom candles in our signature workshops
                </p>
                <Link
                  href="/reservations"
                  className="inline-flex items-center text-white font-semibold hover:underline"
                >
                  Book a Class →
                </Link>
              </div>
            </div>

            {/* Shop */}
            <div className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all bg-linear-to-br from-neutral-800 to-neutral-900 p-8">
              <div className="flex flex-col items-center text-center text-white h-64 justify-center">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Shop Candles</h3>
                <p className="text-white/90 mb-4">
                  Browse our curated collection of handcrafted candles
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center text-white font-semibold hover:underline"
                >
                  Explore Shop →
                </Link>
              </div>
            </div>

            {/* VIP */}
            <div className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all bg-linear-to-br from-yellow-500 to-orange-600 p-8">
              <div className="flex flex-col items-center text-center text-white h-64 justify-center">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">VIP Membership</h3>
                <p className="text-white/90 mb-4">
                  Unlock exclusive perks, discounts, and monthly surprises
                </p>
                <Link
                  href="/subscription"
                  className="inline-flex items-center text-white font-semibold hover:underline"
                >
                  Join VIP →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-linear-to-br from-neutral-900 via-neutral-800 to-neutral-900">
        <div className="max-w-4xl mx-auto text-center text-white">
          <Sparkles className="w-12 h-12 mx-auto mb-6 text-yellow-300" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Create Something Beautiful?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join us for an unforgettable candle-making experience or explore our
            shop to find your perfect scent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/reservations"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-neutral-900 rounded-full font-bold text-lg hover:bg-neutral-100 transition-all shadow-xl"
            >
              <Calendar className="w-5 h-5" />
              Book Your Experience
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              Shop Collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
