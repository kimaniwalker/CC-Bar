import { Text } from "@/components/ds/Text";

export const ProductDimensions = ({ dimensions }: { dimensions: { width: string; height: string; weight: string } }) => {
    const { width, height, weight } = dimensions
    return (
        <div className="mt-2">
            <p className="font-semibold mb-2">Dimensions</p>
            <Text size="sm">{width} x {height} x {weight}</Text>
        </div>
    )
}