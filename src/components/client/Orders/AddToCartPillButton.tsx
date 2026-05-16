"use client"

import { Product } from "@/types/Product"
import { normalizeCartProduct } from "@/utils/normalizeCartProduct"
import { useCart } from "../Cart/CartContext"
import ProductVariationsModal from "../Shop/ProductVariationsModal"
import { useModal } from "../ModalContext"
import { Text } from "@/components/ds/Text"


export const AddToCartPillButton = ({ product }: { product: Product }) => {
    const { addToCart } = useCart()
    const { open } = useModal();

    const isVariationProduct = Boolean(product.available_colors?.length || product.available_sizes?.length);
    const isOutOfStock = product.stock === 0;


    const handleOnAddToCart = () => {
        if (isOutOfStock) return;
        addToCart(normalizeCartProduct(product))
    }


    const handleOpenVariationsModal = () => {
        // open the modal with a fresh ProductVariationsModal instance keyed to product
        open(
            <ProductVariationsModal
                key={product.id}
                product={product}
            />
        );
    };
    return (
        <>
            <button onClick={
                !isVariationProduct ? () => handleOnAddToCart() : handleOpenVariationsModal
            } className="mt-2 rounded-full border border-neutral-300 p-2 py-1 text-xs font-medium transition hover:bg-neutral-100 min-w-max">
                <Text size="xs" as="span" className="text-xs">Add to cart</Text>
            </button>
        </>

    )
}

