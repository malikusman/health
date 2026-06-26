import React from "react";

interface KeyValueRowProps {
  label: string;
  value: React.ReactNode;
  valueColor?: string;
}

export function KeyValueRow({ label, value, valueColor }: KeyValueRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#1E2A3D] last:border-0">
      <span
        className="text-[13px]"
        style={{ color: "#5E6E85" }}
      >
        {label}
      </span>
      <span
        className="text-[13px] font-medium"
        style={{ color: valueColor ?? "#E8EEF7" }}
      >
        {value}
      </span>
    </div>
  );
}
