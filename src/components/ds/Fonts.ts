import { Playfair_Display, Inter, Averia_Libre, Montserrat, Josefin_Sans } from "next/font/google";

export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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