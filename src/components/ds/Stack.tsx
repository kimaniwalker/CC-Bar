"use client";

import React, { JSX } from "react";
import clsx from "clsx";

type ResponsiveProp<T> =
  | T
  | Partial<Record<"base" | "sm" | "md" | "lg" | "xl", T>>;
type FlexDirection = "row" | "row-reverse" | "col" | "col-reverse";
type JustifyContent =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";
type AlignItems = "start" | "center" | "end" | "stretch" | "baseline";
type FlexWrap = "wrap" | "nowrap" | "wrap-reverse";
type FlexGap = "none" | "xs" | "sm" | "md" | "lg" | "xl";

type FlexProps = {
  children: React.ReactNode;
  className?: string;
  direction?: ResponsiveProp<FlexDirection>;
  justify?: ResponsiveProp<JustifyContent>;
  align?: ResponsiveProp<AlignItems>;
  wrap?: ResponsiveProp<FlexWrap>;
  gap?: ResponsiveProp<FlexGap>;
  as?: keyof JSX.IntrinsicElements;
};

const gapMap = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

const generateResponsiveClass = <T extends string>(
  prop: ResponsiveProp<T> | undefined,
  prefix?: string,
  valueMap?: Record<string, string>
): string[] => {
  if (!prop) return [];

  if (typeof prop === "string") {
    const value = valueMap?.[prop] ?? prop;
    return prefix ? [`${prefix}-${value}`] : [value];
  }

  return Object.entries(prop).map(([breakpoint, value]) => {
    const mapped = valueMap?.[value] ?? value;
    return breakpoint === "base"
      ? prefix
        ? `${prefix}-${mapped}`
        : mapped
      : prefix
      ? `${breakpoint}:${prefix}-${mapped}`
      : `${breakpoint}:${mapped}`;
  });
};

export const Stack = ({
  children,
  direction = "row",
  justify = "start",
  align = "stretch",
  wrap = "nowrap",
  gap = "none",
  className,
  as: Component = "div",
}: FlexProps) => {
  const classes = clsx(
    "flex",
    generateResponsiveClass(direction, "flex"),
    generateResponsiveClass(justify, "justify"),
    generateResponsiveClass(align, "items"),
    generateResponsiveClass(wrap, "flex"),
    generateResponsiveClass(gap, "", gapMap),
    className
  );

  return <Component className={classes}>{children}</Component>;
};
