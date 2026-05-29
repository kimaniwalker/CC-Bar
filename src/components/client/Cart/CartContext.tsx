"use client";

import { CartProduct, Product } from "@/types/Product";
import React, { createContext, useContext, useState, useEffect } from "react";

type CartContextType = {
  cart: CartProduct[];
  addToCart: (item: CartProduct) => void;
  removeFromCart: (sku: string) => void;
  removeProductBySku: (sku: string) => void;
  clearCart: () => void;
  getCartProductQuantity: (id: string) => number;
  getCartSubtotal: () => number;
  getTotalCartQuantity: () => number;
  getSelectedVariationQuantity: ({
    product,
    selectedColor,
    selectedSize,
  }: {
    product: Product;
    selectedColor: string;
    selectedSize: string;
  }) => number;
  handleAdjustProductQuantity: (sku: string, newQuantity: number) => void;
  isHydrated: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = "cc_bar_cart";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartProduct[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Load cart from localStorage after mount
    const savedCart = localStorage.getItem(CART_KEY);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage when cart changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

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

  const removeFromCart = (sku: string) => {
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

  const removeProductBySku = (sku: string) => {
    setCart((prev) => prev.filter((item: CartProduct) => item.sku !== sku));
  };

  const clearCart = () => setCart([]);

  const getCartProductQuantity = (id: string) =>
    cart
      .filter((item: CartProduct) => item.id === id)
      .reduce((total, item) => total + (item.quantity || 1), 0);

  const getCartSubtotal = (): number => {
    const rawTotal = cart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    // round to 2 decimal places
    return Math.round(rawTotal * 100) / 100;
  };
  const getTotalCartQuantity = (): number => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const getSelectedVariationQuantity = ({
    product,
    selectedColor,
    selectedSize,
  }: {
    product: Product;
    selectedColor: string;
    selectedSize: string;
  }) => {
    const variation = product.variations?.find((v) => {
      const sizeMatch = v.size ? v.size === selectedSize : true;
      const colorMatch = v.color ? v.color === selectedColor : true;
      return sizeMatch && colorMatch;
    });

    if (!variation?.sku) return 0;

    return cart
      .filter((item) => item.sku === variation.sku)
      .reduce((total, item) => total + item.quantity, 0);
  };

  const handleAdjustProductQuantity = (sku: string, newQuantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.sku === sku ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        removeProductBySku,
        clearCart,
        getCartProductQuantity,
        getCartSubtotal,
        getTotalCartQuantity,
        getSelectedVariationQuantity,
        handleAdjustProductQuantity,
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
