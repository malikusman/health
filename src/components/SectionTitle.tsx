import React from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function SectionTitle({ title, subtitle, icon }: SectionTitleProps) {
  return (
    <div className="flex items-start gap-3">
      {icon && (
        <div
          className="flex-shrink-0 mt-0.5"
          style={{ color: "#3B82F6" }}
        >
          {icon}
        </div>
      )}
      <div>
        <h2
          className="text-[20px] font-semibold leading-tight"
          style={{ color: "#E8EEF7" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className="mt-1 text-[13px]"
            style={{ color: "#5E6E85" }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
