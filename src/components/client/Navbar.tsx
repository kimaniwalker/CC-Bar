"use client";
import Link from "next/link";
import { Text } from "../ds/Text";
import React from "react";
import { Logout } from "./Auth/Logout";
export function Navbar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-75 flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
          <Text
            size="lg"
            className="text-lg font-semibold tracking-wide text-neutral-900"
          >
            Menu
          </Text>

          <button
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-neutral-100"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-1 flex-col px-6 py-8">
          <div className="flex flex-col gap-6 text-sm uppercase tracking-[0.2em] text-neutral-700">
            <Link
              href="/shop"
              onClick={onClose}
              className="transition hover:text-black"
            >
              Shop
            </Link>

            <Link
              href={`/reservations`}
              onClick={onClose}
              className="transition hover:text-black"
            >
              CCB CLASSES
            </Link>

            <Link
              href="/rewards"
              onClick={onClose}
              className="transition hover:text-black"
            >
              Rewards
            </Link>

            <Link
              href="/about"
              onClick={onClose}
              className="transition hover:text-black"
            >
              About
            </Link>
            <Link
              href="/auth/login"
              onClick={onClose}
              className="transition hover:text-black"
            >
              My Account
            </Link>
            <Link
              href="/privacy"
              onClick={onClose}
              className="transition hover:text-black"
            >
              Privacy
            </Link>

            <Link
              href="/contact"
              onClick={onClose}
              className="transition hover:text-black"
            >
              Contact
            </Link>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-neutral-200 px-6 py-5 text-sm text-neutral-500">
          <Text size="sm" className="my-2">
            Hand-poured luxury candles & fragrance experiences.{" "}
          </Text>
          <Logout onLogout={onClose} />
        </div>
      </aside>
    </>
  );
}
