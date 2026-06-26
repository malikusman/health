import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  badge?: string | number;
  badgeColor?: string;
  action?: React.ReactNode;
  elevated?: boolean;
}

export function Card({
  title,
  children,
  className = "",
  badge,
  badgeColor = "#3B82F6",
  action,
  elevated = false,
}: CardProps) {
  const bg = elevated ? "bg-[#0F1828]" : "bg-[#121C2E]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`rounded-xl border border-[#1E2A3D] ${bg} p-5 ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className="text-[11px] uppercase tracking-widest font-semibold"
              style={{ color: "#5E6E85" }}
            >
              {title}
            </span>
            {badge !== undefined && (
              <span
                className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                style={{
                  backgroundColor: `${badgeColor}33`,
                  color: badgeColor,
                }}
              >
                {badge}
              </span>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </motion.div>
  );
}
