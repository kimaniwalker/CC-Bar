import { Product } from "./Product";

export interface Favorite {
    id: number;
    user_id: string;
    product_id: number;
    created_at: string;
}

export interface FavoritesResponse {
    id: number,
    user_id: string,
    product_id: number,
    created_at: string,
    products: Product
}

export type FavoriteProducts = Pick<Product, "id" | "name" | "price" | "images"| "thumbnail">

