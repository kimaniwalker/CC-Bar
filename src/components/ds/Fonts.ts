import { Playfair_Display, Inter, Averia_Libre, Montserrat, Josefin_Sans, Fraunces, Outfit } from "next/font/google";

export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const averia_libre = Averia_Libre({
  weight: "700",
  style: "normal",
});

export const montserrat = Montserrat({
  weight: "400",
  style: "normal",
});

export const josefin = Josefin_Sans({
  weight: "700",
  style: "normal",
});

export const fraunces = Fraunces({
  weight: ["600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

export const outfit = Outfit({
  weight: ["400", "500", "700", "900"],
  style: ["normal"],
  variable: "--font-outfit",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});