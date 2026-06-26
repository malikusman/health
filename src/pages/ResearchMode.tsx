import React, { useState } from 'react';
import { Microscope, AlertTriangle, TrendingUp, BarChart2 } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import PageContainer from '../layout/PageContainer';
import { Card, StatCard, Badge, SectionTitle } from '../components';

// ─── Static data ──────────────────────────────────────────────────────────────

const PIE_DATA = [
  { name: 'Pneumonia', value: 31, color: '#36C28B' },
  { name: 'TB',        value: 23, color: '#3B82F6' },
  { name: 'COPD',      value: 18, color: '#F4A638' },
  { name: 'Sepsis',    value: 12, color: '#F0476A' },
  { name: 'CHF',       value: 9,  color: '#6B8AFE' },
  { name: 'Other',     value: 7,  color: '#5E6E85' },
];

const CALIBRATION_DATA = [
  { predicted: 0,    perfect: 0,    model: 0.02  },
  { predicted: 0.25, perfect: 0.25, model: 0.27  },
  { predicted: 0.5,  perfect: 0.5,  model: 0.53  },
  { predicted: 0.75, perfect: 0.75, model: 0.78  },
  { predicted: 1,    perfect: 1,    model: 0.97  },
];

const METRICS = [
  { label: 'AUROC',              v12: '0.921', v13: '0.943', delta: '+0.022', positive: true  },
  { label: 'Sensitivity (%)',    v12: '84.2',  v13: '89.1',  delta: '+4.9',   positive: true  },
  { label: 'Specificity (%)',    v12: '90.1',  v13: '91.2',  delta: '+1.1',   positive: true  },
  { label: 'False Positive Rate',v12: '9.9',   v13: '8.8',   delta: '−1.1',   positive: true  },
];

const CONDITIONS = ['TB', 'Pneumonia', 'COPD', 'Sepsis', 'CHF', 'Other'];
const AGE_GROUPS  = ['18–30', '31–45', '46–60', '61–75', '75+'];

function riskColor(score: number): string {
  if (score >= 80) return '#F0476A';
  if (score >= 60) return '#F4A638';
  if (score >= 40) return '#F2C94C';
  return '#36C28B';
}

function hashId(i: number): string {
  const chars = 'ABCDEF0123456789';
  let s = '#';
  const seed = i * 7919;
  for (let j = 0; j < 6; j++) s += chars[(seed * (j + 3)) % chars.length];
  return s + '...';
}

const COHORT_ROWS = Array.from({ length: 10 }, (_, i) => {
  const condition  = CONDITIONS[i % CONDITIONS.length];
  const age        = AGE_GROUPS[i % AGE_GROUPS.length];
  const riskScore  = 25 + ((i * 37 + 13) % 70);
  const actual     = i % 3 === 0 ? 'Positive' : 'Negative';
  const prediction = i % 4 === 0 ? 'Negative' : 'Positive';
  const correct    = actual === prediction || (actual === 'Negative' && prediction === 'Negative');
  return { id: hashId(i + 1), condition, age, riskScore, actual, prediction, correct };
});

// ─── Custom Pie legend ────────────────────────────────────────────────────────

function PieLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
      {PIE_DATA.map((d) => (
        <div key={d.name} className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
          <span className="text-xs" style={{ color: '#93A1B5' }}>
            {d.name} <span style={{ color: '#5E6E85' }}>({d.value}%)</span>
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const ResearchMode: React.FC = () => {
  const [compareVersion, setCompareVersion] = useState<'v1.2' | 'v1.3'>('v1.3');

  return (
    <PageContainer>
      {/* Warning banner */}
      <div
        className="flex gap-3 rounded-xl p-4 mb-6"
        style={{ backgroundColor: '#F4A63810', border: '1px solid #F4A638' }}
      >
        <AlertTriangle size={18} style={{ color: '#F4A638', flexShrink: 0, marginTop: 1 }} />
        <div>
          <p className="text-sm font-bold" style={{ color: '#F4A638' }}>
            Research Mode — Not for Clinical Use
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#93A1B5' }}>
            All data shown is de-identified and synthetic. This module is for model evaluation and
            research purposes only — not for clinical decisions.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6">
        <SectionTitle
          title="Research Mode"
          subtitle="De-identified cohort analytics and model performance evaluation."
          icon={<Microscope size={22} />}
        />
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Cohort Size"   value={847}    color="#3B82F6" icon={<BarChart2 size={16} />} />
        <StatCard label="Model AUROC"   value="0.943"  color="#36C28B" icon={<TrendingUp size={16} />} />
        <StatCard label="Sensitivity"   value="89.1%"  color="#36C28B" icon={<TrendingUp size={16} />} />
        <StatCard label="Specificity"   value="91.2%"  color="#36C28B" icon={<TrendingUp size={16} />} />
      </div>

      {/* Row 2: Model Comparison + Condition Distribution */}
      <div className="grid grid-cols-2 gap-4 mb-4">

        {/* Model Comparison */}
        <Card title="Model Comparison">
          <div className="flex gap-2 mb-4">
            {(['v1.2', 'v1.3'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setCompareVersion(v)}
                className="px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
                style={{
                  backgroundColor: compareVersion === v ? '#3B82F6' : '#1E2A3D',
                  color:           compareVersion === v ? '#fff'    : '#5E6E85',
                }}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#0F1828' }}>
                  <th className="text-left py-2 px-3 text-[11px] uppercase tracking-widest" style={{ color: '#5E6E85' }}>
                    Metric
                  </th>
                  <th className="text-right py-2 px-3 text-[11px] uppercase tracking-widest" style={{ color: '#5E6E85' }}>
                    v1.2
                  </th>
                  <th className="text-right py-2 px-3 text-[11px] uppercase tracking-widest" style={{ color: '#5E6E85' }}>
                    v1.3
                  </th>
                  <th className="text-right py-2 px-3 text-[11px] uppercase tracking-widest" style={{ color: '#5E6E85' }}>
                    Δ
                  </th>
                </tr>
              </thead>
              <tbody>
                {METRICS.map((m, i) => (
                  <tr
                    key={m.label}
                    style={{ backgroundColor: i % 2 === 0 ? '#0F182840' : 'transparent' }}
                  >
                    <td className="py-2.5 px-3" style={{ color: '#E8EEF7' }}>{m.label}</td>
                    <td className="py-2.5 px-3 text-right tabular-nums" style={{ color: '#93A1B5' }}>{m.v12}</td>
                    <td
                      className="py-2.5 px-3 text-right tabular-nums font-semibold"
                      style={{ color: compareVersion === 'v1.3' ? '#E8EEF7' : '#93A1B5' }}
                    >
                      {m.v13}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums font-semibold" style={{ color: m.positive ? '#36C28B' : '#F0476A' }}>
                      {m.delta}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Condition Distribution */}
        <Card title="Condition Distribution">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={PIE_DATA}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
              >
                {PIE_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#121C2E', border: '1px solid #1E2A3D', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#E8EEF7' }}
                itemStyle={{ color: '#93A1B5' }}
                formatter={(value: number) => [`${value}%`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
          <PieLegend />
        </Card>
      </div>

      {/* Row 3: Calibration Curve + Cohort Table */}
      <div className="grid grid-cols-2 gap-4 mb-4">

        {/* Calibration Curve */}
        <Card title="Calibration Curve">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={CALIBRATION_DATA} margin={{ top: 8, right: 16, left: -8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2A3D" />
              <XAxis
                dataKey="predicted"
                tick={{ fill: '#5E6E85', fontSize: 11 }}
                tickLine={false}
                label={{ value: 'Predicted', position: 'insideBottom', offset: -4, fill: '#5E6E85', fontSize: 11 }}
              />
              <YAxis
                tick={{ fill: '#5E6E85', fontSize: 11 }}
                tickLine={false}
                label={{ value: 'Observed', angle: -90, position: 'insideLeft', offset: 12, fill: '#5E6E85', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#121C2E', border: '1px solid #1E2A3D', borderRadius: 8, fontSize: 12 }}
                labelFormatter={(v) => `Predicted: ${v}`}
                itemStyle={{ color: '#93A1B5' }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, color: '#93A1B5', paddingTop: 8 }}
              />
              <Line
                type="monotone"
                dataKey="perfect"
                name="Perfect Calibration"
                stroke="#5E6E85"
                strokeDasharray="5 4"
                strokeWidth={1.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="model"
                name="Model Calibration"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 3, fill: '#3B82F6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Cohort Table */}
        <Card title="De-identified Cohort Sample">
          <div className="overflow-x-auto">
            <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#0F1828' }}>
                  {['Case ID', 'Condition', 'Age', 'Risk', 'Actual', 'Predicted', '✓'].map((h) => (
                    <th
                      key={h}
                      className="py-2 px-2 text-left text-[10px] uppercase tracking-widest"
                      style={{ color: '#5E6E85' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COHORT_ROWS.map((row, i) => (
                  <tr
                    key={row.id}
                    className="border-b border-[#1E2A3D]"
                    style={{ backgroundColor: i % 2 === 0 ? '#0F182840' : 'transparent' }}
                  >
                    <td className="py-2 px-2 font-mono" style={{ color: '#5E6E85' }}>{row.id}</td>
                    <td className="py-2 px-2" style={{ color: '#E8EEF7' }}>{row.condition}</td>
                    <td className="py-2 px-2" style={{ color: '#93A1B5' }}>{row.age}</td>
                    <td className="py-2 px-2">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold tabular-nums"
                        style={{
                          backgroundColor: `${riskColor(row.riskScore)}22`,
                          color: riskColor(row.riskScore),
                        }}
                      >
                        {row.riskScore}
                      </span>
                    </td>
                    <td className="py-2 px-2" style={{ color: '#93A1B5' }}>{row.actual}</td>
                    <td className="py-2 px-2" style={{ color: '#93A1B5' }}>{row.prediction}</td>
                    <td className="py-2 px-2 text-base">
                      {row.correct ? (
                        <span style={{ color: '#36C28B' }}>✓</span>
                      ) : (
                        <span style={{ color: '#F0476A' }}>✗</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default ResearchMode;
