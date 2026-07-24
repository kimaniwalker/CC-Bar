import HomePageBanner from "@/components/client/Home/HomePageBanner";
import HowItWorks from "@/components/client/Home/HowItWorks";
import SignUpBanner from "@/components/client/Home/SignUpBanner";
import { TrustBanner } from "@/components/client/Home/TrustBanner";
import ProductGridSkeleton from "@/components/client/Shop/ProductGridSkeleton";
import FeaturedProducts from "@/components/server/FeaturedProducts";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.candlecowbar.com",
  },
  title:
    "Candle Cow Bar | Custom Candle Making & Handcrafted Candles in Helena, AL",
  description:
    "Create your own custom candles at Candle Cow Bar in Helena, AL. Shop handcrafted candles, book candle-making classes, or join our VIP membership for exclusive perks and monthly surprises.",
  openGraph: {
    title: "Candle Cow Bar | Custom Candle Making in Helena, AL",
    description:
      "Helena's premier destination for custom candle-making experiences and handcrafted candles. Build your own candle, shop our collection, or book a class today!",
    url: "https://www.candlecowbar.com",
    siteName: "Candle Cow Bar",
    images: [
      {
        url: "https://www.candlecowbar.com/ccbarlogo.png",
        width: 1200,
        height: 630,
        alt: "Candle Cow Bar - Custom Candle Making in Helena, AL",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Candle Cow Bar | Custom Candle Making in Helena, AL",
    description:
      "Create custom candles, shop handcrafted products, and join candle-making classes in Helena, Alabama.",
    images: ["https://www.candlecowbar.com/ccbarlogo.png"],
  },
  keywords: [
    "candle making",
    "custom candles",
    "Helena Alabama",
    "candle classes",
    "handcrafted candles",
    "DIY candles",
    "candle workshop",
    "VIP membership",
    "candle bar",
    "build your own candle",
  ],
};

export default function Home() {
  return (
    <>
      <HomePageBanner />
      <TrustBanner />
      <Suspense fallback={<ProductGridSkeleton />}>
        <div className="my-12">
          <FeaturedProducts heading="(BYO) - Build Your Own" />
        </div>
      </Suspense>
      <HowItWorks />
      <SignUpBanner />
    </>
  );
}
