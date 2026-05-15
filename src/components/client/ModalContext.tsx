"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react"

type ModalContextType = {
  isOpen: boolean;
  open: (content: ReactNode) => void;
  close: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode | null>(null);

  const open = useCallback((node: ReactNode) => {
    setContent(node);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // clear after closing to ensure remount next open
    setContent(null);
  }, []);

  return (
    <ModalContext.Provider value={{ isOpen, open, close }}>
      {children}
      {typeof window !== "undefined" && isOpen && content
        ? createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 h-full">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={close}
              aria-hidden
            />
            <div className="relative z-10 w-full max-w-xl">
              <div className="bg-white rounded-3xl p-6 shadow-lg max-h-[95vh] md:max-h-[92vh] overflow-auto relative">
                {/* close button top-right */}
                <button
                  onClick={close}
                  aria-label="Close"
                  className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100"
                >
                  <X size={18} />
                </button>

                {content}
              </div>
            </div>
          </div>,
          document.body
        )
        : null}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};