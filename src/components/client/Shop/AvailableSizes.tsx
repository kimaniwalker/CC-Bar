'use client'
import { Text } from "@/components/ds/Text"

export const AvailableSizes = ({ available_sizes }: { available_sizes: string[] }) => {
    return (
        <div>
            <Text size="sm" className="font-semibold mb-2">Available Sizes:</Text>
            <div className="flex space-x-2 mt-1">
                {available_sizes.map((size, index) => (
                    <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 uppercase">
                        {size}
                    </span>
                ))}
            </div>
        </div>
    )
}