"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function CartModal({ isOpen, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isOpen) return null;

  const modalRoot = document.getElementById("cart-modal-root");
  if (!modalRoot) return null;

  return createPortal(
    <div className="z-100">
      {children}
    </div>,
    modalRoot
  );
}
