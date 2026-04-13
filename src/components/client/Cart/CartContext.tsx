"use client";

import { CartProduct } from "@/types/Product";
import React, { createContext, useContext, useState, useEffect } from "react";

type CartContextType = {
  cart: CartProduct[];
  addToCart: (item: CartProduct) => void;
  removeFromCart: (id: number, color?: string, size?: string) => void;
  removeProductById: (id: number) => void;
  clearCart: () => void;
  getCartProductQuantity: (id: number) => number | undefined;
  getCartSubtotal: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = "charmeur_cart";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartProduct[]>([]);

  // ✅ Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse cart from localStorage", err);
      }
    }
  }, []);

  // ✅ Sync cart to localStorage on changes
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartProduct) => {
    setCart((prev) => {
      const existing = prev.find(
        (p) =>
          p.id === item.id && p.color === item.color && p.size === item.size
      );

      if (existing) {
        return prev.map((p) =>
          p.id === item.id && p.color === item.color && p.size === item.size
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };

  
  const removeFromCart = (id: number, color?: string, size?: string) => {
    setCart((prev) =>
      prev.flatMap((item) => {
        const isSameVariant =
          item.id === id &&
          (color ? item.color === color : true) &&
          (size ? item.size === size : true);

        if (!isSameVariant) return [item];
        if (item.quantity > 1) {
          return [{ ...item, quantity: item.quantity - 1 }];
        }
        return [];
      })
    );
  };

  const removeProductById = (id: number) => {
    setCart((prev) => prev.filter((item: CartProduct) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const getCartProductQuantity = (id: number) =>
    cart
      .filter((item: CartProduct) => item.id === id)
      .reduce((total, item) => total + (item.quantity || 1), 0);

  const getCartSubtotal = (): number => {
    return cart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };
  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        removeProductById,
        clearCart,
        getCartProductQuantity,
        getCartSubtotal,
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
