"use server"
import { createClient } from "@/utils/supabase/server";
import { Cart } from "@/types/Cart";
import { ProductVariation, StockError } from "@/types/Product";


export async function validateStock(cart: Cart) {
    const supabase = await createClient()
    const errors: StockError[] = [];

    const formatStockError = (item: Cart[number], availableStock: number): StockError => {
        const variation = [item.size, item.color].filter(Boolean).join(' | ');

        if (availableStock === 0) {
            return { sku: item.sku, availableStock, errorMessage: `${item.name}${variation ? ` (${variation})` : ''} is out of stock.` };
        }
        if (item.isVariationProduct) {
            return { sku: item.sku, availableStock, errorMessage: `${item.name}${variation ? ` (${variation})` : ''} only has ${availableStock} left in stock.` };
        }
        return { sku: item.sku, availableStock, errorMessage: `${item.name} only has ${availableStock} left in stock.` };
    }

    for (const item of cart) {
        if (item.isVariationProduct) {
            // variation product — check variation stock
            const { data: product, error } = await supabase
                .from("products")
                .select("variations")
                .eq("id", item.id)
                .single();

                if (error) {
                    console.error(`Failed to fetch variation product ${item.id}:`, error.message);
                    errors.push({ isDbError: true, sku: item.sku, availableStock: 0, errorMessage: `Product stock could not be verified. Please try again.` });
                    continue;  // 👈 skip to next item
                }

            const variation = product?.variations?.find((v: ProductVariation) => v.sku === item.sku);
            
            console.log({variation, item})

            if (!variation || variation.stock < item.quantity) {
                errors.push(formatStockError(item, variation?.stock ?? 0));
            }


        } else {
            // standard product — check product stock
            const { data: product,error } = await supabase
                .from("products")
                .select("stock")
                .eq("id", item.id)
                .single();

                if (error) {
                    console.error(`Failed to fetch product ${item.id}:`, error.message);
                    errors.push({ isDbError: true,sku: item.sku, availableStock: 0, errorMessage: `Product stock could not be verified. Please try again.` });
                    continue;  // 👈 skip to next item
                }

            if (!product || product.stock < item.quantity) {
                errors.push(formatStockError(item, product?.stock ?? 0));
            }
        }
    }

    console.log("Stock validation errors:", errors);
    console.log({valid: errors.length === 0})

    return { valid: errors.length === 0, errors };
}

