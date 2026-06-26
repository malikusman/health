import React from "react";

const STATUS_COLORS: Record<string, string> = {
  "Generated": "#6B8AFE",
  "Queued": "#F4A638",
  "Pending": "#F2C94C",
  "Triggered": "#F0476A",
  "Completed": "#36C28B",
  "Awaiting Approval": "#F4A638",
  "Critical": "#F0476A",
  "Warning": "#F4A638",
  "High": "#F0476A",
  "Medium": "#F4A638",
  "Low": "#36C28B",
  "Normal": "#36C28B",
  "Abnormal": "#F4A638",
  "Active": "#36C28B",
  "Resolved": "#36C28B",
  "Stable": "#36C28B",
};

interface StatusPillProps {
  status: string;
  size?: "sm" | "md";
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function StatusPill({ status, size = "md" }: StatusPillProps) {
  const color = STATUS_COLORS[status] ?? "#5E6E85";
  const px = size === "sm" ? "px-2 py-px" : "px-2.5 py-0.5";
  const textSize = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <span
      className={`inline-flex items-center ${px} rounded-full ${textSize} font-semibold`}
      style={{
        backgroundColor: hexToRgba(color, 0.2),
        color,
      }}
    >
      {status}
    </span>
  );
}
