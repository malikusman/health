import React from "react";
import { PieChart, Pie, Cell } from "recharts";

interface RiskDonutProps {
  value: number;
  size?: number;
  color?: string;
  label?: string;
  subtitle?: string;
}

function autoColor(value: number): string {
  if (value >= 75) return "#F0476A";
  if (value >= 50) return "#F4A638";
  return "#36C28B";
}

export function RiskDonut({
  value,
  size = 200,
  color,
  label,
  subtitle,
}: RiskDonutProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const resolvedColor = color ?? autoColor(clamped);
  const half = size / 2;
  const innerRadius = half * 0.6;
  const outerRadius = half * 0.8;

  const data = [
    { name: "filled", value: clamped },
    { name: "empty", value: 100 - clamped },
  ];

  return (
    <div className="relative inline-flex items-center justify-center">
      <PieChart width={size} height={size}>
        <Pie
          data={data}
          dataKey="value"
          cx={half}
          cy={half}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={90}
          endAngle={-270}
          strokeWidth={0}
        >
          <Cell fill={resolvedColor} />
          <Cell fill="#1E2A3D" />
        </Pie>
      </PieChart>
      <div
        className="absolute flex flex-col items-center justify-center text-center"
        style={{ width: innerRadius * 2, height: innerRadius * 2 }}
      >
        <span
          className="font-bold leading-none tabular-nums"
          style={{
            color: resolvedColor,
            fontSize: size * 0.14,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {clamped}
        </span>
        {label && (
          <span
            className="mt-1 uppercase tracking-widest"
            style={{ color: "#5E6E85", fontSize: size * 0.065 }}
          >
            {label}
          </span>
        )}
        {subtitle && (
          <span
            className="mt-0.5"
            style={{ color: "#93A1B5", fontSize: size * 0.06 }}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
