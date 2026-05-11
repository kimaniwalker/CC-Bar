import { ProductAvailabilityStatus } from "@/types/Product";

export const getProductStockStatus = (stock: number): ProductAvailabilityStatus => {
    if (stock === null || stock === undefined) return ProductAvailabilityStatus.IN_STOCK; // treat as in stock if no stock info
    if (stock <= 0) return ProductAvailabilityStatus.OUT_OF_STOCK;
    if (stock <= 5) return ProductAvailabilityStatus.LOW_STOCK;
    if (stock <= 15) return ProductAvailabilityStatus.SELLING_FAST;
    return ProductAvailabilityStatus.IN_STOCK;
}