"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type CartModalContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const CartModalContext = createContext<CartModalContextType | undefined>(undefined);

export const CartModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <CartModalContext.Provider value={{ isOpen, open, close }}>
      {children}
    </CartModalContext.Provider>
  );
};

export const useCartModal = () => {
  const context = useContext(CartModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
