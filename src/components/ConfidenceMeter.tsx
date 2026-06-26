import React from "react";
import { ProgressBar } from "./ProgressBar";

interface ConfidenceMeterProps {
  value: number;
  label?: string;
}

export function ConfidenceMeter({ value, label }: ConfidenceMeterProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        {label && (
          <span
            className="text-[11px] uppercase tracking-widest font-semibold"
            style={{ color: "#5E6E85" }}
          >
            {label}
          </span>
        )}
        <span
          className="text-xs font-semibold tabular-nums ml-auto"
          style={{ color: "#36C28B", fontVariantNumeric: "tabular-nums" }}
        >
          {clamped}%
        </span>
      </div>
      <ProgressBar
        value={clamped}
        color="#36C28B"
        showValue={false}
        height={5}
      />
    </div>
  );
}
