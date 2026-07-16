// ✅ Define enum for theme values
export enum ReservationTheme {
  DateNight = "date-night",
  TacoNight = "taco-night",
  GirlsNight = "girls-night",
}

// ✅ Or use const assertion (more modern approach)
export const RESERVATION_THEMES = {
  DATE_NIGHT: "date-night",
  TACO_NIGHT: "taco-night",
  GIRLS_NIGHT: "girls-night",
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
  [RESERVATION_THEMES.TACO_NIGHT]: {
    title: "Taco Tuesday + Candle Making | Candle Cow Bar Helena, AL",
    description:
      "Tacos + Candles = Perfect Night! Join us for Taco Tuesday candle making. Enjoy complimentary tacos while creating custom candles. Limited spots available!",
    openGraph: {
      title: "Taco Tuesday Candle Making Night",
      description:
        "Free tacos, candle making, and good vibes. The most fun Tuesday night in Helena!",
      images: "https://www.candlecowbar.com/images/taco-night-og.jpg",
    },
    keywords: [
      "taco tuesday Helena",
      "taco night event",
      "candle making Helena",
      "fun Tuesday night",
      "Helena events",
    ],
  },
  [RESERVATION_THEMES.GIRLS_NIGHT]: {
    title: "Girls Night Candle Making | Candle Cow Bar Helena, AL",
    description:
      "The ultimate girls night out! Create custom candles with your squad. BYOB, laughter, and memories guaranteed. Perfect for bachelorette parties!",
    openGraph: {
      title: "Girls Night Out: Candle Making Party",
      description:
        "Gather your besties for the perfect girls night. Candles, drinks, and unforgettable memories!",
      images: "https://www.candlecowbar.com/images/girls-night-og.jpg",
    },
    keywords: [
      "girls night Helena AL",
      "ladies night out",
      "girls night ideas",
      "bachelorette party Helena",
      "girls activity Helena",
      "BYOB girls night",
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
