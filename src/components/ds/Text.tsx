"use client";

import React, { JSX } from "react";
import clsx from "clsx";
import { averia_libre, fraunces, inter, josefin, montserrat, outfit } from "./Fonts";

type HeadingSize = "sm" | "md" | "lg" | "xl" | "xxl" | "xs";

const sizeToTagMap: Record<HeadingSize, keyof JSX.IntrinsicElements> = {
  xs: "h6",
  sm: "h5",
  md: "h4",
  lg: "h3",
  xl: "h2",
  xxl: "h1",
};

const sizeStyles: Record<HeadingSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
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

  return (
    <Tag
      className={clsx(font.className, sizeStyles[size], className)}
      {...accessibleProps}
    >
      {children}
    </Tag>
  );
};
