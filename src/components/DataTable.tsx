import React from "react";

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
  highlightRow?: (row: T) => boolean;
}

export function DataTable<T>({
  columns,
  rows,
  onRowClick,
  highlightRow,
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[#1E2A3D]">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#0F1828]">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-[11px] uppercase tracking-widest font-semibold"
                style={{ color: "#5E6E85", width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            const highlighted = highlightRow ? highlightRow(row) : false;
            const isClickable = !!onRowClick;

            return (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className="border-b border-[#1E2A3D] transition-colors"
                style={{
                  cursor: isClickable ? "pointer" : "default",
                  borderLeft: highlighted ? "2px solid #F4A638" : "2px solid transparent",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "rgba(30,42,61,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "transparent";
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 text-sm"
                    style={{ color: "#93A1B5" }}
                  >
                    {col.render
                      ? col.render(row)
                      : ((row as Record<string, unknown>)[col.key] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
