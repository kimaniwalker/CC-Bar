import { montserrat } from "@/components/ds/Fonts";

export const ProductStockStatus = ({ stock, hideStatus = false }: { stock: number, hideStatus?: boolean }) => {
  if (hideStatus) return null;

  if (stock <= 0) {
    return <span className={`text-red-500 font-semibold ${montserrat.className}`}>Out of Stock</span>;
  }

  if (stock <= 5) {
    return <span className={`text-red-500 font-semibold ${montserrat.className}`}>⚠️ Limited stock - only {stock} left!</span>;
  }

  if (stock <= 15) {
    return <span className={`text-orange-500 font-semibold ${montserrat.className}`}>🔥 Selling fast - only {stock} left!</span>;
  }

  return <span className={`text-green-500 font-semibold ${montserrat.className}`}>In Stock</span>;
}