import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  color: string;
  size?: "sm" | "md" | "lg";
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function Badge({ children, color, size = "md" }: BadgeProps) {
  const sizeClasses = {
    sm: "px-1.5 py-px text-[10px]",
    md: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center ${sizeClasses[size]} rounded-full font-semibold`}
      style={{
        backgroundColor: hexToRgba(color, 0.15),
        color,
      }}
    >
      {children}
    </span>
  );
}
