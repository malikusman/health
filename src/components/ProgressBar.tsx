import React from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  color: string;
  label?: string;
  showValue?: boolean;
  height?: number;
}

export function ProgressBar({
  value,
  color,
  label,
  showValue = true,
  height = 5,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span
              className="text-[11px] uppercase tracking-widest font-semibold"
              style={{ color: "#5E6E85" }}
            >
              {label}
            </span>
          )}
          {showValue && (
            <span
              className="text-xs font-medium tabular-nums ml-auto"
              style={{ color: "#93A1B5", fontVariantNumeric: "tabular-nums" }}
            >
              {clamped}%
            </span>
          )}
        </div>
      )}
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height, backgroundColor: "#1E2A3D" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: "0%" }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
