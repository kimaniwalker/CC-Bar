import { Heart, Star } from "lucide-react";
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
  [RESERVATION_THEMES.KIDS_NIGHT]: {
    specialRate: {
      name: "Kids Special",
      price: 35,
      guestCount: 1,
      description: "Fun hands-on candle or soap making for kids",
      icon: Star,
      color: "amber",
      includes: [
        "1 activity per child (candle, soap, or body butter)",
        "90-minute guided session",
        "All materials included",
        "Fun games while creations cool",
        "Take home your handmade creation",
      ],
    },
    defaultGuests: 1,
  },
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
  [RESERVATION_THEMES.COFFEE_WITH_JOE]: {
    specialRate: {
      name: "Coffee with Joe Ticket",
      price: 55,
      guestCount: 1,
      description:
        "Candle-making, coffee, and light refreshments in a relaxed social setting",
      icon: Heart,
      color: "amber",
      includes: [
        "One ticketed reservation entry",
        "Candle-making experience",
        "Coffee and refreshments included",
        "Time to relax and mingle",
      ],
    },
    defaultGuests: 1,
  },
};
