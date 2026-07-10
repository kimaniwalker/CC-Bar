// lib/seo.ts

import { Metadata } from "next";

const SITE_URL = "https://www.candlecowbar.com";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Candle Cow Bar",
    template: "%s | Candle Cow Bar",
  },
  description:
    "Create custom candles, soaps, body butters, perfumes, and home fragrances at Candle Cow Bar.",

  keywords: [
    "candle bar",
    "custom candles",
    "luxury candles",
    "soap making",
    "body butter",
    "perfume",
    "home fragrance",
  ],

  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Candle Cow Bar",
  },

  twitter: {
    card: "summary_large_image",
  },

  robots: {
    index: true,
    follow: true,
  },
};
