// ✅ Define enum for theme values
export enum ReservationTheme {
  DateNight = "date-night",
  KidsNight = "kids-night",
}

// ✅ Or use const assertion (more modern approach)
export const RESERVATION_THEMES = {
  DATE_NIGHT: "date-night",
  KIDS_NIGHT: "kids-night",
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
  [RESERVATION_THEMES.KIDS_NIGHT]: {
    title: "Kids Night Candle Making | Candle Cow Bar Helena, AL",
    description:
      "A fun, hands-on candle and soap making experience for kids in Helena! Let their creativity shine. Perfect for birthdays, family nights, and more. Book your kids night today!",
    openGraph: {
      title: "Kids Night: Candle Making for Kids in Helena, AL",
      description:
        "Give your kids a one-of-a-kind creative experience! They'll mix scents, pour candles, and take home something they made themselves.",
      images: "https://www.candlecowbar.com/kids-night.png",
    },
    keywords: [
      "kids night Helena AL",
      "kids activity Helena",
      "candle making for kids",
      "kids workshop Helena",
      "family night Helena",
      "birthday party Helena AL",
      "creative kids activity",
      "things to do with kids Helena",
    ],
  },
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
