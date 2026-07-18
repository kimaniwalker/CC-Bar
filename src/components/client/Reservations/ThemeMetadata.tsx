// ✅ Define enum for theme values
export enum ReservationTheme {
  DateNight = "date-night",
}

// ✅ Or use const assertion (more modern approach)
export const RESERVATION_THEMES = {
  DATE_NIGHT: "date-night",
} as const;

// ✅ Extract type from the values
export type ReservationThemeType =
  (typeof RESERVATION_THEMES)[keyof typeof RESERVATION_THEMES];

type ThemeMetadata = {
  title: string;
  description: string;
  openGraph: {
    title: string;
    description: string;
    images: string;
  };
  keywords: string[];
};

// ✅ Use the const values as keys
export const THEME_METADATA: Record<ReservationThemeType, ThemeMetadata> = {
  [RESERVATION_THEMES.DATE_NIGHT]: {
    title: "Date Night Candle Making | Candle Cow Bar Helena, AL",
    description:
      "The most unique date night in Helena! Create custom candles together in a fun, romantic atmosphere. BYOB friendly. Perfect for couples. Book your date night experience today!",
    openGraph: {
      title: "Perfect Date Night: Candle Making for Couples",
      description:
        "Ditch dinner & a movie. Create something together at Helena's premier candle-making experience. Romantic, fun, and BYOB friendly!",
      images: "https://www.candlecowbar.com/images/date-night-og.jpg",
    },
    keywords: [
      "date night Helena AL",
      "couples activity Helena",
      "romantic date ideas",
      "unique date night",
      "candle making date",
      "BYOB date night",
      "couples workshop Helena",
      "romantic things to do Helena",
    ],
  },
};

// ✅ Helper to check if theme is valid
export function isValidTheme(theme: string): theme is ReservationThemeType {
  return Object.values(RESERVATION_THEMES).includes(
    theme as ReservationThemeType,
  );
}

// ✅ Helper to get all theme values
export function getAllThemes(): ReservationThemeType[] {
  return Object.values(RESERVATION_THEMES);
}
