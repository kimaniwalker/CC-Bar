import { Text } from "@/components/ds/Text";
import { ProductVariation } from "@/types/Product";

export const ProductPrice = ({ price, sale_price, on_sale, variations }: { price: number, sale_price?: number, on_sale: boolean, variations?: ProductVariation[] }) => {
    if (variations && variations.length > 0) {
        const minPrice = Math.min(...(variations ?? []).map(v => v.sale_price ?? v.price));
        const maxPrice = Math.max(...(variations ?? []).map(v => v.sale_price ?? v.price));
        if (minPrice !== maxPrice) {
            return <Text size="md">${minPrice} - ${maxPrice}</Text>
        }
        return <Text size="md">Starting at ${minPrice}</Text>
    }
    if (on_sale && sale_price) {
        return (
            <div className="flex">
                <Text size="md" className="text-gray-500 line-through mr-2">${price}</Text>
                <Text size="md" className="text-red-500 font-bold">${sale_price}</Text>
            </div>
        )
    }
    return <Text size="md">${price}</Text>
}