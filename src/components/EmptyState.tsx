import React from "react";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div
        className="flex items-center justify-center rounded-full mb-4"
        style={{
          width: 56,
          height: 56,
          backgroundColor: "#1E2A3D",
          color: "#5E6E85",
        }}
      >
        {icon}
      </div>
      <h3
        className="text-[16px] font-semibold mb-1"
        style={{ color: "#E8EEF7" }}
      >
        {title}
      </h3>
      <p
        className="text-[13px] max-w-xs leading-relaxed"
        style={{ color: "#5E6E85" }}
      >
        {subtitle}
      </p>
    </div>
  );
}
