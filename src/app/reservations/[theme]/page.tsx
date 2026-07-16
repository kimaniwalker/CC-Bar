import ReservationsContainer from "@/components/client/Reservations/ReservationsContainer";
import { THEME_METADATA } from "@/components/client/Reservations/ThemeMetadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ theme: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { theme } = await params;
  const themeMetadata = THEME_METADATA[theme as keyof typeof THEME_METADATA];

  if (!themeMetadata) {
    return {
      title: "Reservation Not Found | Candle Cow Bar",
      description: "The reservation theme you're looking for doesn't exist.",
    };
  }

  return {
    title: themeMetadata.title,
    description: themeMetadata.description,
    openGraph: {
      title: themeMetadata.openGraph.title,
      description: themeMetadata.openGraph.description,
      url: `https://www.candlecowbar.com/reservations/${theme}`,
      siteName: "Candle Cow Bar",
      images: [
        {
          url: themeMetadata.openGraph.images,
          width: 1200,
          height: 630,
          alt: themeMetadata.openGraph.title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: themeMetadata.openGraph.title,
      description: themeMetadata.openGraph.description,
      images: [themeMetadata.openGraph.images],
    },
    keywords: themeMetadata.keywords,
    alternates: {
      canonical: `https://www.candlecowbar.com/reservations/${theme}`,
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { theme } = await params;

  // Check if theme exists, otherwise 404
  if (!THEME_METADATA[theme as keyof typeof THEME_METADATA]) {
    notFound();
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReservationsContainer params={params} searchParams={searchParams} />
    </Suspense>
  );
}

// Optional: Pre-generate static pages for known themes
export function generateStaticParams() {
  return Object.keys(THEME_METADATA).map((theme) => ({
    theme,
  }));
}
