"use client";

import { CartProduct, ProductWithOptions } from "@/types/Product";
import { useState, useMemo } from "react";
import {
  calculateProductPrice,
  getCartProductKey,
  isSameCartProduct,
} from "@/utils/Cart/normalizeCartProduct";

export const usePosCart = (initialProducts: ProductWithOptions[] = []) => {
  const [products] = useState<ProductWithOptions[]>(initialProducts);
  const [cart, setCart] = useState<CartProduct[]>([]);
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const itemPrice = calculateProductPrice(item);
      return acc + itemPrice * item.quantity;
    }, 0);
  }, [cart]);

  const addToCart = (item: CartProduct) => {
    setCart((prev) => {
      const existing = prev.find((p) => isSameCartProduct(p, item));

      if (existing) {
        return prev.map((p) =>
          isSameCartProduct(p, item) ? { ...p, quantity: p.quantity + 1 } : p,
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const decreaseQuantity = (key: string) => {
    setCart((prev) =>
      prev.flatMap((item) => {
        if (getCartProductKey(item) !== key) return [item];
        if (item.quantity > 1)
          return [{ ...item, quantity: item.quantity - 1 }];
        return [];
      }),
    );
  };

  return {
    products,
    cart,
    search,
    loading: false, // No loading since data is passed as prop
    filteredProducts,
    subtotal,
    addToCart,
    decreaseQuantity,
    setSearch,
    setCart,
  };
};
