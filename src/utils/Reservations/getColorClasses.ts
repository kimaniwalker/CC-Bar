// ✅ Dynamic color classes based on theme
export const getColorClasses = (color: "rose" | "amber" | "purple") => {
  const colors = {
    rose: {
      bg: "bg-rose-500/20",
      border: "border-rose-400/30",
      text: "text-rose-300",
      badgeBg: "bg-rose-50",
      badgeText: "text-rose-600",
      badgeBorder: "border-rose-200",
    },
    amber: {
      bg: "bg-amber-500/20",
      border: "border-amber-400/30",
      text: "text-amber-300",
      badgeBg: "bg-amber-50",
      badgeText: "text-amber-600",
      badgeBorder: "border-amber-200",
    },
    purple: {
      bg: "bg-purple-500/20",
      border: "border-purple-400/30",
      text: "text-purple-300",
      badgeBg: "bg-purple-50",
      badgeText: "text-purple-600",
      badgeBorder: "border-purple-200",
    },
  };
  return colors[color];
};
