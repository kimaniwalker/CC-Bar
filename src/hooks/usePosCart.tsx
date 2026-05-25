"use client";

import { CartProduct, Product } from "@/types/Product";
import { getProducts } from "@/utils/Shop/getProducts";
import { useEffect, useMemo, useState } from "react";

export const usePosCart = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartProduct[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();

        setProducts(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
  }, [cart]);

  const addToCart = (item: CartProduct) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.sku === item.sku); // 👈 match on sku

      if (existing) {
        return prev.map((p) =>
          p.sku === item.sku ? { ...p, quantity: p.quantity + 1 } : p,
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const decreaseQuantity = (sku: string) => {
    // 👈 just sku now
    setCart((prev) =>
      prev.flatMap((item) => {
        if (item.sku !== sku) return [item];
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
    loading,
    filteredProducts,
    subtotal,
    addToCart,
    decreaseQuantity,
    setSearch,
    setCart,
  };
};
