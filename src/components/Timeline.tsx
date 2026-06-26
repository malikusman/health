import React from "react";

type TimelineItemType = "analysis" | "alert" | "action" | "escalation" | "reminder";

interface TimelineItem {
  id: string;
  timestamp: string;
  description: string;
  type: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

const TYPE_COLORS: Record<string, string> = {
  analysis: "#6B8AFE",
  alert: "#F0476A",
  action: "#36C28B",
  escalation: "#F4A638",
  reminder: "#6B8AFE",
};

function getTypeColor(type: string): string {
  return TYPE_COLORS[type] ?? "#5E6E85";
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="flex flex-col">
      {items.map((item, index) => {
        const color = getTypeColor(item.type);
        const isLast = index === items.length - 1;

        return (
          <div key={item.id} className="flex gap-3">
            {/* Left column: dot + line */}
            <div className="flex flex-col items-center" style={{ minWidth: 16 }}>
              <div
                className="rounded-full flex-shrink-0 mt-0.5"
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: color,
                  boxShadow: `0 0 0 2px ${color}33`,
                }}
              />
              {!isLast && (
                <div
                  className="flex-1 mt-1"
                  style={{
                    width: 1,
                    backgroundColor: "#1E2A3D",
                    minHeight: 20,
                  }}
                />
              )}
            </div>

            {/* Right column: content */}
            <div className={`pb-4 flex-1 ${isLast ? "" : ""}`}>
              <div
                className="text-xs mb-0.5"
                style={{ color: "#5E6E85" }}
              >
                {item.timestamp}
              </div>
              <div
                className="text-sm leading-snug"
                style={{ color: "#93A1B5" }}
              >
                {item.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
