"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type ModalOptions = {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
};

type ModalContextType = {
  isOpen: boolean;
  open: (content: ReactNode, options?: ModalOptions) => void;
  close: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

const MAX_WIDTH_CLASSES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-full",
};

const PADDING_CLASSES = {
  none: "p-0",
  sm: "p-3",
  md: "p-6",
  lg: "p-8",
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode | null>(null);
  const [options, setOptions] = useState<ModalOptions>({});

  const open = useCallback((node: ReactNode, opts: ModalOptions = {}) => {
    setContent(node);
    setOptions({
      maxWidth: opts.maxWidth || "xl",
      closeOnBackdrop: opts.closeOnBackdrop ?? true,
      showCloseButton: opts.showCloseButton ?? true,
      padding: opts.padding || "md",
      className: opts.className || "",
    });
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // clear after closing to ensure remount next open
    setTimeout(() => {
      setContent(null);
      setOptions({});
    }, 150);
  }, []);

  const handleBackdropClick = () => {
    if (options.closeOnBackdrop) {
      close();
    }
  };

  const maxWidthClass = MAX_WIDTH_CLASSES[options.maxWidth || "xl"];
  const paddingClass = PADDING_CLASSES[options.padding || "md"];

  return (
    <ModalContext.Provider value={{ isOpen, open, close }}>
      {children}
      {typeof window !== "undefined" && isOpen && content
        ? createPortal(
            <div className="fixed inset-0 z-99 flex items-center justify-center p-4 h-full">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={handleBackdropClick}
                aria-hidden
              />
              <div
                className={`relative z-10 w-full ${maxWidthClass} ${options.className || ""}`}
              >
                <div
                  className={`bg-white rounded-3xl shadow-lg max-h-[95vh] md:max-h-[92vh] overflow-auto relative ${paddingClass}`}
                >
                  {/* close button top-right */}
                  {options.showCloseButton && (
                    <button
                      type="button"
                      onClick={close}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 transition hover:bg-neutral-200 absolute top-4 right-4 z-10"
                    >
                      <X className="h-5 w-5 text-neutral-600" />
                    </button>
                  )}

                  {content}
                </div>
              </div>
            </div>,
            document.body,
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
