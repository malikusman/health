import React, { useState } from 'react';
import { FlaskConical, AlertTriangle, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from 'recharts';
import PageContainer from '../layout/PageContainer';
import { Card, StatusPill, Sparkline, Badge } from '../components';
import { labResults } from '../data/labs';

// Group lab results by section
function groupBySection(results: typeof labResults): Record<string, typeof labResults> {
  return results.reduce<Record<string, typeof labResults>>((acc, r) => {
    if (!acc[r.section]) acc[r.section] = [];
    acc[r.section].push(r);
    return acc;
  }, {});
}

function flagBorderColor(flag: string): string {
  if (flag === 'Critical') return '#F0476A';
  if (flag === 'Abnormal') return '#F4A638';
  return 'transparent';
}

function flagTextColor(flag: string): string {
  if (flag === 'Critical') return '#F0476A';
  if (flag === 'Abnormal') return '#F4A638';
  if (flag === 'Normal') return '#36C28B';
  return '#5E6E85';
}

const IP10_TREND = [200, 350, 520, 680, 856];

export default function Labs() {
  const grouped = groupBySection(labResults);
  const sections = Object.keys(grouped);

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FlaskConical size={20} color="#3B82F6" />
        <h2 className="text-[20px] font-semibold leading-tight" style={{ color: '#E8EEF7' }}>
          Labs &amp; Biomarkers
        </h2>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-4 gap-6">
        {/* Left: lab panel — col-span-3 */}
        <div className="col-span-3">
          <Card>
            {/* Legend row */}
            <div className="flex items-center gap-5 mb-4 pb-4 border-b border-[#1E2A3D]">
              {[
                { label: 'Normal', color: '#36C28B' },
                { label: 'Abnormal', color: '#F4A638' },
                { label: 'Critical', color: '#F0476A' },
                { label: 'Pending', color: '#5E6E85' },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-[12px]" style={{ color: '#93A1B5' }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Table wrapper */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" style={{ minWidth: 560 }}>
                <thead>
                  <tr>
                    {['Test', 'Value', 'Unit', 'Ref Range', 'Flag', 'Trend'].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2 text-left text-[11px] uppercase tracking-widest font-semibold"
                        style={{ color: '#5E6E85' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sections.map((section) => (
                    <React.Fragment key={section}>
                      {/* Section header */}
                      <tr>
                        <td
                          colSpan={6}
                          className="px-3 py-2 rounded"
                          style={{ backgroundColor: '#0F1828' }}
                        >
                          <span
                            className="text-[11px] uppercase tracking-widest font-semibold"
                            style={{ color: '#5E6E85' }}
                          >
                            {section}
                          </span>
                        </td>
                      </tr>

                      {/* Result rows */}
                      {grouped[section].map((r, i) => {
                        const borderColor = flagBorderColor(r.flag);
                        const isLast = i === grouped[section].length - 1;

                        return (
                          <tr
                            key={r.id}
                            style={{
                              borderBottom: isLast ? 'none' : '1px solid #1E2A3D',
                              borderLeft: `3px solid ${borderColor}`,
                            }}
                          >
                            {/* Test name */}
                            <td className="px-3 py-2.5">
                              <span className="text-sm" style={{ color: '#E8EEF7' }}>
                                {r.test}
                              </span>
                            </td>

                            {/* Value */}
                            <td className="px-3 py-2.5">
                              {r.value === null ? (
                                <span
                                  className="text-sm italic animate-pulse"
                                  style={{ color: '#5E6E85' }}
                                >
                                  Awaiting Result
                                </span>
                              ) : (
                                <span
                                  className="text-sm font-semibold tabular-nums"
                                  style={{
                                    color: flagTextColor(r.flag),
                                    fontVariantNumeric: 'tabular-nums',
                                  }}
                                >
                                  {String(r.value)}
                                </span>
                              )}
                            </td>

                            {/* Unit */}
                            <td className="px-3 py-2.5">
                              <span className="text-sm" style={{ color: '#5E6E85' }}>
                                {r.unit || '—'}
                              </span>
                            </td>

                            {/* Ref Range */}
                            <td className="px-3 py-2.5">
                              <span className="text-sm" style={{ color: '#5E6E85' }}>
                                {r.refRange}
                              </span>
                            </td>

                            {/* Flag */}
                            <td className="px-3 py-2.5">
                              <StatusPill status={r.flag} size="sm" />
                            </td>

                            {/* Trend sparkline */}
                            <td className="px-3 py-2.5">
                              {r.trend.length > 1 ? (
                                <Sparkline
                                  data={r.trend}
                                  color={r.flag === 'Critical' ? '#F0476A' : r.flag === 'Abnormal' ? '#F4A638' : '#36C28B'}
                                  width={72}
                                  height={28}
                                />
                              ) : (
                                <span className="text-sm" style={{ color: '#1E2A3D' }}>—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right: Biomarker Spotlight — col-span-1 */}
        <div className="col-span-1">
          <Card title="Biomarker Spotlight">
            {/* IP-10 spotlight */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-sm font-semibold" style={{ color: '#E8EEF7' }}>
                  IP-10 (CXCL10)
                </div>
                <div
                  className="text-[28px] font-bold tabular-nums leading-none mt-1"
                  style={{ color: '#F0476A', fontVariantNumeric: 'tabular-nums' }}
                >
                  856
                </div>
                <div className="text-[12px] mt-0.5" style={{ color: '#5E6E85' }}>
                  pg/mL
                </div>
              </div>
              <Badge color="#F0476A" size="sm">Critically Elevated</Badge>
            </div>

            {/* Trend chart */}
            <div style={{ height: 100 }} className="mb-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={IP10_TREND.map((v, i) => ({ i, v }))}
                  margin={{ top: 4, right: 4, bottom: 4, left: 0 }}
                >
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#121C2E',
                      border: '1px solid #1E2A3D',
                      borderRadius: 8,
                      color: '#E8EEF7',
                      fontSize: 12,
                    }}
                    formatter={(v: number) => [`${v} pg/mL`, 'IP-10']}
                    labelFormatter={() => ''}
                  />
                  <Line
                    type="monotone"
                    dataKey="v"
                    stroke="#F0476A"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#F0476A', strokeWidth: 0 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Interpretation */}
            <div
              className="text-[12px] leading-relaxed p-3 rounded-lg"
              style={{ backgroundColor: '#0F1828', color: '#93A1B5' }}
            >
              IP-10 at 856 pg/mL is 5.7× the upper reference limit. Sustained elevation
              over 5 days is consistent with active mycobacterial infection and correlates
              with the current risk score trajectory.
            </div>

            {/* IFN-γ secondary */}
            <div className="mt-4 pt-4 border-t border-[#1E2A3D]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[13px] font-semibold" style={{ color: '#E8EEF7' }}>
                  IFN-γ
                </span>
                <Badge color="#F0476A" size="sm">Critical</Badge>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span
                  className="text-[22px] font-bold tabular-nums"
                  style={{ color: '#F0476A', fontVariantNumeric: 'tabular-nums' }}
                >
                  4.2
                </span>
                <span className="text-[12px]" style={{ color: '#5E6E85' }}>IU/mL</span>
              </div>
              <div className="text-[11px] mt-1" style={{ color: '#5E6E85' }}>
                Ref &lt;0.35 IU/mL · 12× upper limit
              </div>
            </div>

            {/* ESR trending */}
            <div className="mt-4 pt-4 border-t border-[#1E2A3D]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-semibold" style={{ color: '#E8EEF7' }}>
                  ESR Trend
                </span>
                <TrendingUp size={14} color="#F4A638" />
              </div>
              <Sparkline
                data={[22, 31, 44, 58, 68]}
                color="#F4A638"
                width={undefined as unknown as number}
                height={32}
              />
              <div className="text-[11px] mt-1" style={{ color: '#5E6E85' }}>
                68 mm/hr — rising over 5 days
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
