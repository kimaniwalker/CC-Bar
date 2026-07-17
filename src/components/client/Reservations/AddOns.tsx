export type AddOn = {
  label: string;
  price: number;
  description: string;
  icon: string;
  longDescription?: string;
  includes?: string[];
  bestFor?: string[]; // Which themes this makes sense for
  perPerson?: boolean; // If true, price multiplies by guest count
  minGuests?: number; // Minimum guests required
  ageRestricted?: boolean;
};

export const AddOns: AddOn[] = [
  {
    label: "Charcuterie Board",
    price: 40,
    description: "Artisan cheeses, meats, fruits & crackers",
    icon: "🧀",
    longDescription:
      "Elevate your experience with a beautifully curated charcuterie board",
    includes: [
      "3-4 artisan cheeses",
      "Cured meats (salami, prosciutto)",
      "Fresh & dried fruits",
      "Gourmet crackers & breadsticks",
      "Nuts, olives & honey",
      "Serves 2-4 people",
    ],
    bestFor: ["date-night", "girls-night"],
  },
  {
    label: "The Works (VIP Experience)",
    price: 70,
    description: "Complete VIP experience with premium everything",
    icon: "✨",
    longDescription:
      "Transform your visit into a luxury experience you'll never forget",
    includes: [
      "Premium fragrance oils & luxury vessel upgrade",
      "Extended session time (+30 minutes)",
      "Complimentary charcuterie board for your group",
      "Welcome drink (prosecco or signature mocktail)",
      "Professional photos during your session",
      "Take-home goody bag with samples",
      "10% off next visit coupon",
    ],
    perPerson: true,
    bestFor: ["date-night", "girls-night"],
  },
  {
    label: "Wine & Cheese Pairing",
    price: 30,
    description: "Curated wine flight with cheese pairings",
    icon: "🍷",
    includes: [
      "3 wine samples (red, white, rosé)",
      "Paired artisan cheeses",
      "Tasting notes guide",
      "Crackers & accompaniments",
    ],
    bestFor: ["date-night", "girls-night"],
    ageRestricted: true,
  },
  {
    label: "Dessert Board",
    price: 35,
    description: "Gourmet sweets to enjoy while you create",
    icon: "🍰",
    includes: [
      "Gourmet brownies & cookies",
      "Chocolate-covered strawberries",
      "Mini cheesecake bites",
      "Fresh fruit",
      "Serves 2-4 people",
    ],
    bestFor: ["date-night", "girls-night", "taco-night"],
  },
  {
    label: "Celebration Package",
    price: 25,
    description: "Make it special with decorations & setup",
    icon: "🎉",
    includes: [
      "Custom birthday or anniversary banner",
      "Balloon garland at your station",
      "Sparkler candle for celebration",
      "Polaroid photo with props",
      "Champagne toast (non-alcoholic)",
    ],
    bestFor: ["date-night", "girls-night"],
  },
  {
    label: "Take-Home DIY Kit",
    price: 45,
    description: "Recreate the experience at home",
    icon: "📦",
    includes: [
      "All materials for 2 candles",
      "Fragrance oils & wax",
      "Containers & wicks",
      "Step-by-step instruction booklet",
      "Access to online tutorial video",
    ],
    bestFor: ["date-night", "girls-night"],
  },
];
