import React, { useEffect, useState } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  color: string;
  icon?: React.ReactNode;
  trend?: string;
  subtitle?: string;
}

export function StatCard({
  label,
  value,
  color,
  icon,
  trend,
  subtitle,
}: StatCardProps) {
  const isNumeric = typeof value === "number";
  const [displayValue, setDisplayValue] = useState<string | number>(
    isNumeric ? 0 : value
  );

  useEffect(() => {
    if (!isNumeric) {
      setDisplayValue(value);
      return;
    }

    const target = value as number;
    const duration = 600;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = step >= steps ? target : Math.round(current + increment);
      setDisplayValue(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, isNumeric]);

  return (
    <div className="rounded-xl border border-[#1E2A3D] bg-[#121C2E] p-5">
      <div className="flex items-start justify-between mb-3">
        <span
          className="text-[11px] uppercase tracking-widest font-semibold"
          style={{ color: "#5E6E85" }}
        >
          {label}
        </span>
        {icon && (
          <span style={{ color }}>{icon}</span>
        )}
      </div>
      <div
        className="text-[36px] font-bold leading-none tabular-nums"
        style={{ color, fontVariantNumeric: "tabular-nums" }}
      >
        {displayValue}
      </div>
      {subtitle && (
        <div className="mt-1 text-[13px]" style={{ color: "#93A1B5" }}>
          {subtitle}
        </div>
      )}
      {trend && (
        <div className="mt-2 text-xs" style={{ color: "#5E6E85" }}>
          {trend}
        </div>
      )}
    </div>
  );
}
