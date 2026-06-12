"use client";

import React, { JSX } from "react";
import clsx from "clsx";
import {
  averia_libre,
  fraunces,
  inter,
  josefin,
  montserrat,
  outfit,
} from "./Fonts";

type HeadingSize = "sm" | "md" | "lg" | "xl" | "xxl" | "xs" | "base";

const sizeToTagMap: Record<HeadingSize, keyof JSX.IntrinsicElements> = {
  xs: "h6",
  sm: "h5",
  base: "p",
  md: "h4",
  lg: "h3",
  xl: "h2",
  xxl: "h1",
};

const sizeStyles: Record<HeadingSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base", // No size applied, allows full className control
  md: "text-lg",
  lg: "text-xl",
  xl: "text-3xl",
  xxl: "text-4xl",
};

const fontStyles: Record<
  HeadingSize,
  typeof montserrat | typeof averia_libre | typeof josefin
> = {
  xs: montserrat,
  sm: montserrat,
  base: outfit,
  md: inter,
  lg: outfit,
  xl: josefin,
  xxl: fraunces,
};

type HeadingProps = {
  children: React.ReactNode;
  size?: HeadingSize;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  role?: string;
  ariaLevel?: number;
};

export const Text = ({
  children,
  size = "lg",
  as,
  className,
  role,
  ariaLevel,
}: HeadingProps) => {
  const Tag = as || sizeToTagMap[size];
  const accessibleProps =
    role === "heading" && typeof ariaLevel === "number"
      ? { role, "aria-level": ariaLevel }
      : {};

  const font = fontStyles[size];
  // Don't apply default size if className contains custom text-* sizing
  const hasCustomSize = className?.includes("text-");
  const appliedSize = hasCustomSize ? "" : sizeStyles[size];

  return (
    <Tag
      className={clsx(font.className, appliedSize, className)}
      {...accessibleProps}
    >
      {children}
    </Tag>
  );
};
