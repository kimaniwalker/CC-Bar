import { montserrat } from "@/components/ds/Fonts"
import { ProductAvailabilityStatus } from "@/types/Product"
import { getProductStockStatus } from "@/utils/Product/getProductStockStatus"

export const ProductBadge = ({ stock }: { stock: number }) => {
    if (getProductStockStatus(stock) === ProductAvailabilityStatus.OUT_OF_STOCK) {
        return <span className={`absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded ${montserrat.className}`}>
            {ProductAvailabilityStatus.OUT_OF_STOCK}
        </span>
    }
    if (getProductStockStatus(stock) === ProductAvailabilityStatus.LOW_STOCK) {
        return <span className={`absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded ${montserrat.className}`}>
            {ProductAvailabilityStatus.LOW_STOCK}
        </span>
    }
    if (getProductStockStatus(stock) === ProductAvailabilityStatus.SELLING_FAST) {
        return <span className={`absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded ${montserrat.className}`}>
            {ProductAvailabilityStatus.SELLING_FAST}
        </span>
    }
    return null;

}