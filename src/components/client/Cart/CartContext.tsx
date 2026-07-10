"use client";

import { CartProduct } from "@/types/Product";
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  calculateProductPrice,
  getCartProductKey,
  isSameCartProduct,
  normalizeCartProduct,
} from "@/utils/Cart/normalizeCartProduct";
import { sendGTMEvent } from "@next/third-parties/google";

type CartContextType = {
  cart: CartProduct[];
  addToCart: (item: CartProduct) => void;
  removeFromCart: (key: string) => void;
  removeProductByKey: (key: string) => void;
  clearCart: () => void;
  getCartProductQuantity: (id: string) => number;
  getCartSubtotal: () => number;
  getTotalCartQuantity: () => number;
  handleAdjustProductQuantity: (key: string, newQuantity: number) => void;
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
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  const addToCart = (item: CartProduct) => {
    setCart((prev) => {
      // Normalize the incoming product
      const normalizedItem = normalizeCartProduct(item);

      // Find existing item with same SKU AND same options
      const existingIndex = prev.findIndex((p) =>
        isSameCartProduct(p, normalizedItem),
      );

      if (existingIndex !== -1) {
        // Increment quantity of existing item
        return prev.map((p, idx) =>
          idx === existingIndex ? { ...p, quantity: p.quantity + 1 } : p,
        );
      }

      // Handle fragrance - could be string or array
      const fragranceValue = item.selected_options?.fragrance?.optionName;
      const fragrance = Array.isArray(fragranceValue)
        ? fragranceValue.join(", ")
        : fragranceValue || null;

      sendGTMEvent({
        event: "addToCart",
        product_id: item.id,
        sku: item.sku,
        name: item.name,
        type: item.type,
        product_price: item.price,
        onSale: item.on_sale,
        size: item.selected_options?.size?.optionName || null,
        fragrance,
      });

      // Add new item with quantity 1
      return [...prev, { ...normalizedItem, quantity: 1 }];
    });
  };

  const removeFromCart = (key: string) => {
    setCart((prev) =>
      prev.flatMap((item) => {
        const itemKey = getCartProductKey(item);
        if (itemKey !== key) return [item];
        if (item.quantity > 1)
          return [{ ...item, quantity: item.quantity - 1 }];
        return [];
      }),
    );
  };

  const removeProductByKey = (key: string) => {
    setCart((prev) => prev.filter((item) => getCartProductKey(item) !== key));
  };

  const clearCart = () => setCart([]);

  const getCartProductQuantity = (id: string) =>
    cart
      .filter((item) => item.id === id)
      .reduce((total, item) => total + (item.quantity || 1), 0);

  const getCartSubtotal = (): number => {
    const rawTotal = cart.reduce((total, item) => {
      const itemPrice = calculateProductPrice(item);
      return total + itemPrice * item.quantity;
    }, 0);

    // Round to 2 decimal places
    return Math.round(rawTotal * 100) / 100;
  };

  const getTotalCartQuantity = (): number => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const handleAdjustProductQuantity = (key: string, newQuantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        getCartProductKey(item) === key
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        removeProductByKey,
        clearCart,
        getCartProductQuantity,
        getCartSubtotal,
        getTotalCartQuantity,
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
