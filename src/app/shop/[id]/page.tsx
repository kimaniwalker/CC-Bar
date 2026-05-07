import { ImagePicker } from "@/components/client/Shop/ImagePicker"
import ProductGridSkeleton from "@/components/client/Shop/ProductGridSkeleton"
import { VariationsPicker } from "@/components/client/Shop/VariationsPicker"
import { montserrat } from "@/components/ds/Fonts"
import { Text } from "@/components/ds/Text"
import FeaturedProducts from "@/components/server/FeaturedProducts"
import { ProductReviews } from "@/components/server/ProductReviews"
import { Product, ProductVariation } from "@/types/Product"
import { getProductDetails } from "@/utils/server/getProductDetails"
import { Suspense } from "react"


export default async function ProductDetails({
    params,
}: {
    params: Promise<{ id: number }>
}) {
    const { id } = await params
    const productDetails = await getProductDetails(id)
    const { name, description, images, tags, thumbnail, on_sale, price, sale_price, dimensions, available_sizes, available_colors, brand, availabilityStatus, variations } = productDetails[0]



    return (
        <>
        <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* left col — image */}
                <ImagePicker images={images || [thumbnail]} alt={name} />

                {/* right col — details */}
                <div className="flex flex-col gap-4">
                    <Text size="xl">{name} {brand && (`- ${brand}`)}</Text>
                    <Price price={price} sale_price={sale_price} on_sale={on_sale} variations={variations} />
                    <Tags tags={tags ?? []} />
                    <Text size="md">{description}</Text>
                    {dimensions && <Dimensions dimensions={dimensions} />}
                    
                    <VariationsPicker available_colors={available_colors} available_sizes={available_sizes} availabilityStatus={availabilityStatus} variations={variations} />
                </div>
            </div>
        </div>
        <div className={`w-full max-w-7xl mx-auto p-4 md:p-8 ${montserrat.className}`}>

             <Suspense fallback={<ProductGridSkeleton />}>
                    <FeaturedProducts heading="You might also like" />
            </Suspense>
        </div>
        <Suspense fallback={<div className="w-full max-w-7xl mx-auto p-4 md:p-8">
            <Text size="lg" className="mb-6">Customer Reviews</Text>
            <ProductGridSkeleton />
        </div>}>
            <ProductReviews product_id={id} />
        </Suspense>
        
        </>
    )
}

const Price = ({ price, sale_price, on_sale, variations }: { price: number, sale_price?: number, on_sale: boolean, variations?: ProductVariation[] }) => {
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


const Dimensions = ({ dimensions }: { dimensions: { width: string; height: string; weight: string } }) => {
    const { width, height, weight } = dimensions
    return (
        <div className="mt-2">
            <p className="font-semibold mb-2">Dimensions</p>
            <Text size="sm">{width} x {height} x {weight}</Text>
        </div>
    )
}

const Tags = ({ tags }: { tags: string[] }) => {
    if (tags.length === 0) return null
    return (
        <div className="mt-2">
            {tags?.map((tag, index) => (
                <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 uppercase">
                    {tag}
                </span>
            ))}
        </div>
    )
}

