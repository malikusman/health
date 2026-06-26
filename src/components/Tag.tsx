import React from "react";

type TagVariant = "critical" | "warning" | "caution" | "success" | "info" | "muted";

const VARIANT_COLORS: Record<TagVariant, string> = {
  critical: "#F0476A",
  warning: "#F4A638",
  caution: "#F2C94C",
  success: "#36C28B",
  info: "#6B8AFE",
  muted: "#5E6E85",
};

interface TagProps {
  children: React.ReactNode;
  variant: TagVariant;
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function Tag({ children, variant }: TagProps) {
  const color = VARIANT_COLORS[variant];

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold"
      style={{
        backgroundColor: hexToRgba(color, 0.15),
        color,
      }}
    >
      {children}
    </span>
  );
}
