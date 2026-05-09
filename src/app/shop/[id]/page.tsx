import { Categories, CategorySkeleton } from "@/components/client/Shop/Categories"
import { ImagePicker } from "@/components/client/Shop/ImagePicker"
import ProductGridSkeleton from "@/components/client/Shop/ProductGridSkeleton"
import { ProductAddToCart } from "@/components/client/Shop/ProductAddToCart"
import { montserrat } from "@/components/ds/Fonts"
import { Text } from "@/components/ds/Text"
import FeaturedProducts from "@/components/server/FeaturedProducts"
import { ProductReviews } from "@/components/server/ProductReviews"
import { getProductDetails } from "@/utils/server/getProductDetails"
import { Suspense } from "react"
import { ProductPrice } from "@/components/client/Shop/ProductPrice"
import { ProductDimensions } from "@/components/client/Shop/ProductDimensions"
import { ProductTags } from "@/components/client/Shop/ProductTags"


export default async function ProductDetails({
    params,
    searchParams
}: {
    params: Promise<{ id: number }>
    searchParams: Promise<{ category: string }>
}) {
    const { id } = await params
    const { category: selectedCategory } = await searchParams

    const productDetails = await getProductDetails(id)
    const { name, description, images, tags, thumbnail, on_sale, price, sale_price, dimensions, brand, variations } = productDetails[0]


    return (
        <>
        <Suspense fallback={<CategorySkeleton />}>
                <Categories selectedCategory={selectedCategory} />
        </Suspense>
        <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* left col — image */}
                <ImagePicker images={images || [thumbnail]} alt={name} />

                {/* right col — details */}
                <div className="flex flex-col gap-4">
                    <Text size="xl">{name} {brand && (`- ${brand}`)}</Text>
                    <ProductPrice price={price} sale_price={sale_price} on_sale={on_sale} variations={variations} />
                    <ProductTags tags={tags ?? []} />
                    <Text size="md">{description}</Text>
                    {dimensions && <ProductDimensions dimensions={dimensions} />}
                    
                    <ProductAddToCart product={productDetails[0]} />
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


