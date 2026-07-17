import { Heart, PartyPopper, UtensilsCrossed } from "lucide-react";
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
  [RESERVATION_THEMES.TACO_NIGHT]: {
    specialRate: {
      name: "Taco Tuesday Special",
      price: 75,
      guestCount: 2,
      description: "Tacos + Candles = Perfect Tuesday",
      icon: UtensilsCrossed,
      color: "amber",
      includes: [
        "1 activity per person (candle, soap, or body butter)",
        "Complimentary street tacos & chips",
        "Margarita drink specials available",
        "Fun, casual atmosphere",
        "Take home your creations",
      ],
    },
    defaultGuests: 2,
  },
  [RESERVATION_THEMES.GIRLS_NIGHT]: {
    specialRate: {
      name: "Squad Special",
      price: 55,
      guestCount: 4,
      description: "Bring your besties and save",
      icon: PartyPopper,
      color: "purple",
      includes: [
        "1 activity per person (candle, soap, or body butter)",
        "2-hour private session for your group",
        "BYOB friendly - wine & cocktails welcome",
        "Fun games and photo ops",
        "Group discount on add-ons",
      ],
    },
    defaultGuests: 4,
  },
};
