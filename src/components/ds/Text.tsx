"use client";

import React, { JSX } from "react";
import clsx from "clsx";
import { averia_libre, josefin, montserrat } from "./Fonts";

type HeadingSize = "sm" | "md" | "lg" | "xl" | "xxl";

const sizeToTagMap: Record<HeadingSize, keyof JSX.IntrinsicElements> = {
  sm: "h5",
  md: "h4",
  lg: "h3",
  xl: "h2",
  xxl: "h1",
};

const sizeStyles: Record<HeadingSize, string> = {
  sm: "text-base md:text-lg",
  md: "text-lg md:text-xl",
  lg: "text-xl md:text-2xl",
  xl: "xl:text-7xl lg:text-5xl md:text-4xl text-3xl",
  xxl: "xl:text-9xl lg:text-6xl md:text-5xl text-4xl",
};

const fontStyles: Record<
  HeadingSize,
  typeof montserrat | typeof averia_libre | typeof josefin
> = {
  sm: montserrat,
  md: montserrat,
  lg: averia_libre,
  xl: josefin,
  xxl: josefin,
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
