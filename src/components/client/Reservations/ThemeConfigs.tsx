import { Heart } from "lucide-react";
import { RESERVATION_THEMES } from "./ThemeMetadata";

// ✅ Theme-specific configuration
type ThemeConfig = {
  specialRate?: {
    name: string;
    price: number;
    guestCount: number;
    description: string;
    icon: typeof Heart;
    color: "rose" | "amber" | "purple";
    includes: string[];
  };
  defaultGuests: number;
};

export const THEME_CONFIGS: Record<string, ThemeConfig> = {
  [RESERVATION_THEMES.DATE_NIGHT]: {
    specialRate: {
      name: "Couples Special",
      price: 85,
      guestCount: 2,
      description: "Perfect romantic experience for two",
      icon: Heart,
      color: "rose",
      includes: [
        "1 activity per person (candle, soap, or body butter)",
        "90-minute private session",
        "BYOB welcome - bring your favorite wine!",
        "Connection games while candles cool",
        "Take home your handmade creations",
      ],
    },
    defaultGuests: 2,
  },
};
