import { Suspense } from "react";
import { Metadata } from "next";
import { LandingPageForm } from "@/components/client/Reservations/LandingPageForm";

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
    "Helena Montana",
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
    <Suspense>
      <LandingPageForm theme="" />
    </Suspense>
  );
}
