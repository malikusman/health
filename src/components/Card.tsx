import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../lib/ThemeContext";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  badge?: string | number;
  badgeColor?: string;
  action?: React.ReactNode;
  elevated?: boolean;
  style?: React.CSSProperties;
}

export function Card({
  title, children, className = "", badge, badgeColor = "#3B82F6",
  action, elevated = false, style,
}: CardProps) {
  const { colors } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`rounded-xl p-5 ${className}`}
      style={{
        backgroundColor: elevated ? colors.bgElevated : colors.bgSurface,
        border: `1px solid ${colors.border}`,
        boxShadow: 'var(--card-shadow)',
        ...style,
      }}
    >
      {title && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: colors.textMuted }}>
              {title}
            </span>
            {badge !== undefined && (
              <span
                className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                style={{ backgroundColor: `${badgeColor}33`, color: badgeColor }}
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
