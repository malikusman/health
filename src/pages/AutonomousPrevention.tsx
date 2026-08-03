import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from 'recharts';

import PageContainer from '../layout/PageContainer';
import {
  Card,
  StatCard,
  StatusPill,
  Tag,
  ProgressBar,
  ConfidenceMeter,
  DataTable,
  SectionTitle,
} from '../components';
import { preventionOpportunities, buildAlignedPrevention } from '../data/prevention';
import type { PreventionOpportunity } from '../lib/types';
import { loadDemoSpine } from '../api/demoSpine';
import { useAsync } from '../hooks/useAsync';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function impactVariant(impact: string): 'critical' | 'warning' | 'success' | 'muted' {
  switch (impact) {
    case 'High': return 'critical';
    case 'Medium': return 'warning';
    case 'Low': return 'success';
    default: return 'muted';
  }
}

function impactBorderColor(impact: string): string {
  switch (impact) {
    case 'High': return '#F0476A';
    case 'Medium': return '#F4A638';
    case 'Low': return '#36C28B';
    default: return '#5E6E85';
  }
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────

interface PlaybookToggleProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

function PlaybookToggle({ label, description, value, onChange }: PlaybookToggleProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#1E2A3D] last:border-0">
      <div className="flex-1 min-w-0 pr-4">
        <div className="text-sm font-semibold" style={{ color: '#E8EEF7' }}>{label}</div>
        <div className="text-xs mt-0.5" style={{ color: '#5E6E85' }}>{description}</div>
      </div>
      <div
        onClick={() => onChange(!value)}
        role="switch"
        aria-checked={value}
        className="flex-shrink-0 relative rounded-full transition-colors duration-200 focus:outline-none cursor-pointer"
        style={{
          width: 40,
          height: 22,
          backgroundColor: value ? '#36C28B' : '#1E2A3D',
        }}
      >
        <span
          className="absolute top-0.5 rounded-full transition-all duration-200"
          style={{
            width: 18,
            height: 18,
            backgroundColor: '#E8EEF7',
            left: value ? 20 : 2,
          }}
        />
      </div>
    </div>
  );
}

// ─── Opportunity Card ─────────────────────────────────────────────────────────

function OpportunityCard({ opp }: { opp: PreventionOpportunity }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-[#1E2A3D] bg-[#121C2E] p-5"
      style={{ borderLeft: `4px solid ${impactBorderColor(opp.impact)}` }}
    >
      <div className="grid grid-cols-3 gap-4">
        {/* Left: main content */}
        <div className="col-span-2 flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag variant={impactVariant(opp.impact)}>{opp.impact} Impact</Tag>
            <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: '#5E6E85' }}>
              {opp.forecastDays}d forecast
            </span>
          </div>

          <div className="text-[16px] font-semibold leading-snug" style={{ color: '#E8EEF7' }}>
            {opp.title}
          </div>

          {/* Predicted outcome */}
          <div>
            <div className="text-[10px] uppercase tracking-widest font-semibold mb-1.5" style={{ color: '#5E6E85' }}>
              Predicted outcome if no action
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#F4A638' }} />
              <p className="text-sm leading-relaxed" style={{ color: '#93A1B5' }}>
                {opp.predictedOutcome}
              </p>
            </div>
          </div>

          {/* Probability bar */}
          <div>
            <ProgressBar
              value={opp.probability}
              color={impactBorderColor(opp.impact)}
              label="Probability"
              height={5}
            />
          </div>

          {/* Suggested action */}
          <div>
            <div className="text-[10px] uppercase tracking-widest font-semibold mb-1.5" style={{ color: '#5E6E85' }}>
              Suggested preventive action
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#36C28B' }} />
              <p className="text-sm leading-relaxed" style={{ color: '#93A1B5' }}>
                {opp.suggestedAction}
              </p>
            </div>
          </div>
        </div>

        {/* Right: confidence + actions */}
        <div className="col-span-1 flex flex-col justify-between gap-4">
          <div className="rounded-lg p-3 border border-[#1E2A3D] bg-[#0F1828]">
            <div className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: '#5E6E85' }}>
              AI Confidence
            </div>
            <ConfidenceMeter value={opp.confidence} />
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => alert(`Taking action on: ${opp.title}`)}
              className="w-full rounded-lg py-2 px-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
              style={{ backgroundColor: '#3B82F6', color: '#fff' }}
            >
              Take Action
            </button>
            <button
              onClick={() => alert(`Snoozed: ${opp.title}`)}
              className="w-full rounded-lg py-2 px-3 text-sm font-semibold border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5E6E85]"
              style={{ borderColor: '#1E2A3D', color: '#93A1B5', backgroundColor: 'transparent' }}
            >
              Snooze
            </button>
            <button
              onClick={() => alert(`Dismissed: ${opp.title}`)}
              className="w-full rounded-lg py-2 px-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F0476A]"
              style={{ color: '#F0476A', backgroundColor: 'transparent' }}
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const ChartTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg border p-2.5 text-xs"
      style={{ backgroundColor: '#121C2E', borderColor: '#1E2A3D' }}
    >
      <div className="font-semibold mb-1.5" style={{ color: '#E8EEF7' }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="inline-block rounded-full" style={{ width: 8, height: 8, backgroundColor: p.color }} />
          <span style={{ color: '#93A1B5' }}>{p.name}:</span>
          <span className="tabular-nums font-semibold" style={{ color: '#E8EEF7', fontVariantNumeric: 'tabular-nums' }}>{p.value}%</span>
        </div>
      ))}
    </div>
  );
};

// ─── Forecast chart data ───────────────────────────────────────────────────────

const forecastData = [
  { category: 'Clinical stability',    current: 15, actioned: 35 },
  { category: 'Disease progression',   current: 68, actioned: 42 },
  { category: 'Hospital admission',    current: 42, actioned: 18 },
  { category: 'Specialist escalation', current: 77, actioned: 45 },
];

// Shorten labels for chart x-axis
const forecastDataShort = forecastData.map((d) => ({
  ...d,
  label: d.category.split(' ').slice(0, 2).join(' '),
}));

// ─── Prevented MTD data ────────────────────────────────────────────────────────

const preventedData = [
  { week: 'W1', events: 8 },
  { week: 'W2', events: 12 },
  { week: 'W3', events: 17 },
  { week: 'W4', events: 37 },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const AutonomousPrevention: React.FC = () => {
  const spine = useAsync(() => loadDemoSpine(0), []);
  const liveOpportunities = spine.data
    ? buildAlignedPrevention(spine.data)
    : preventionOpportunities;
  const openOpportunities = liveOpportunities.filter((o) => o.status === 'Open');

  // Playbook toggle state
  const [playbook, setPlaybook] = useState({
    tbSmear: true,
    specialistQueue: true,
    isolationReview: false,
    followUp: true,
    labEscalation: true,
  });

  function setPlay(key: keyof typeof playbook, value: boolean) {
    setPlaybook((prev) => ({ ...prev, [key]: value }));
  }

  // DataTable columns for all opportunities
  const allColumns = [
    {
      key: 'title',
      label: 'Title',
      width: '28%',
      render: (row: Record<string, unknown>) => {
        const o = row as unknown as PreventionOpportunity;
        return (
          <span className="text-sm font-medium" style={{ color: '#E8EEF7' }}>
            {o.title}
          </span>
        );
      },
    },
    {
      key: 'impact',
      label: 'Impact',
      width: '9%',
      render: (row: Record<string, unknown>) => {
        const o = row as unknown as PreventionOpportunity;
        return <Tag variant={impactVariant(o.impact)}>{o.impact}</Tag>;
      },
    },
    {
      key: 'probability',
      label: 'Probability',
      width: '10%',
      render: (row: Record<string, unknown>) => {
        const o = row as unknown as PreventionOpportunity;
        return (
          <span className="text-sm tabular-nums font-semibold" style={{ color: '#E8EEF7', fontVariantNumeric: 'tabular-nums' }}>
            {o.probability}%
          </span>
        );
      },
    },
    {
      key: 'suggestedAction',
      label: 'Suggested Action',
      width: '28%',
      render: (row: Record<string, unknown>) => {
        const o = row as unknown as PreventionOpportunity;
        return (
          <span
            className="text-xs"
            style={{
              color: '#5E6E85',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {o.suggestedAction}
          </span>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      width: '10%',
      render: (row: Record<string, unknown>) => {
        const o = row as unknown as PreventionOpportunity;
        return <StatusPill status={o.status} size="sm" />;
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '15%',
      render: (row: Record<string, unknown>) => {
        const o = row as unknown as PreventionOpportunity;
        return (
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => { e.stopPropagation(); alert(`Taking action: ${o.title}`); }}
              className="px-2 py-0.5 rounded text-[10px] font-semibold transition-colors"
              style={{ backgroundColor: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}
            >
              Take Action
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); alert(`Dismissed: ${o.title}`); }}
              className="px-2 py-0.5 rounded text-[10px] font-semibold transition-colors"
              style={{ color: '#F0476A' }}
            >
              Dismiss
            </button>
          </div>
        );
      },
    },
  ];

  const allRows = liveOpportunities as unknown as Record<string, unknown>[];

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">

        {/* ── Section Title ─────────────────────────────────────────────── */}
        <SectionTitle
          title="Autonomous Prevention"
          subtitle="Predictive intelligence — surface risks before adverse events occur."
          icon={<Shield size={22} style={{ color: '#36C28B' }} />}
        />

        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ backgroundColor: '#3B82F615', border: '1px solid #3B82F655', color: '#93A1B5' }}
        >
          Prevention opportunities are aligned to Medical Intelligence research signals
          {spine.data ? ` (featured case ${spine.data.patient.display_id})` : ''}. Research outputs are not
          a clinical diagnosis.
        </div>

        {/* ── KPI Strip ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            label="Open Opportunities"
            value={openOpportunities.length}
            color="#F4A638"
            icon={<AlertTriangle size={18} />}
          />
          <StatCard
            label="Total Opportunities"
            value={liveOpportunities.length}
            color="#36C28B"
            icon={<CheckCircle size={18} />}
          />
          <StatCard
            label="Engine"
            value="Agentic"
            color="#3B82F6"
            icon={<TrendingUp size={18} />}
          />
          <StatCard
            label="Featured case"
            value={spine.data?.patient.display_id ?? '—'}
            color="#6B8AFE"
            icon={<Shield size={18} />}
          />
        </div>

        {/* ── Open Opportunity Cards ────────────────────────────────────── */}
        {openOpportunities.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: '#5E6E85' }}>
              Open Opportunities — {openOpportunities.length}
            </div>
            {openOpportunities.map((opp) => (
              <OpportunityCard key={opp.id} opp={opp} />
            ))}
          </div>
        )}

        {/* ── Forecast Panel + Prevention Playbook ─────────────────────── */}
        <div className="grid grid-cols-2 gap-4">

          {/* Forecast Chart */}
          <Card title="Risk Forecast — Actions vs. No Action">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={forecastDataShort} barCategoryGap="30%" barGap={4}>
                <CartesianGrid vertical={false} stroke="#1E2A3D" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#5E6E85', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#5E6E85', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  unit="%"
                  width={36}
                />
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: '#5E6E85', paddingTop: 8 }}
                />
                <Bar dataKey="current" name="Current Risk" fill="#F4A638" radius={[3, 3, 0, 0]} />
                <Bar dataKey="actioned" name="If Actions Taken" fill="#36C28B" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            {/* Callout stats */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="rounded-lg p-3 border border-[#1E2A3D] bg-[#0F1828]">
                <div className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: '#5E6E85' }}>
                  Hospital Admission
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm tabular-nums" style={{ color: '#F4A638', fontVariantNumeric: 'tabular-nums' }}>42%</span>
                  <TrendingUp size={12} style={{ color: '#36C28B', transform: 'scaleX(-1)' }} />
                  <span className="text-sm tabular-nums font-semibold" style={{ color: '#36C28B', fontVariantNumeric: 'tabular-nums' }}>18%</span>
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: '#5E6E85' }}>if actions taken</div>
              </div>
              <div className="rounded-lg p-3 border border-[#1E2A3D] bg-[#0F1828]">
                <div className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: '#5E6E85' }}>
                  Specialist Escalation
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm tabular-nums" style={{ color: '#F0476A', fontVariantNumeric: 'tabular-nums' }}>77%</span>
                  <TrendingUp size={12} style={{ color: '#36C28B', transform: 'scaleX(-1)' }} />
                  <span className="text-sm tabular-nums font-semibold" style={{ color: '#36C28B', fontVariantNumeric: 'tabular-nums' }}>45%</span>
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: '#5E6E85' }}>if actions taken</div>
              </div>
            </div>
          </Card>

          {/* Prevention Playbook */}
          <Card title="Prevention Playbook">
            <PlaybookToggle
              label="TB Pathway Expedited Smear Processing"
              description="Automatically escalate sputum collection when TB risk score exceeds threshold"
              value={playbook.tbSmear}
              onChange={(v) => setPlay('tbSmear', v)}
            />
            <PlaybookToggle
              label="Specialist Queue Auto-Prioritisation"
              description="Re-rank patient in pulmonology queue based on real-time risk trajectory"
              value={playbook.specialistQueue}
              onChange={(v) => setPlay('specialistQueue', v)}
            />
            <PlaybookToggle
              label="Isolation Protocol Auto-Review"
              description="Trigger isolation suitability review when airborne risk flags are raised"
              value={playbook.isolationReview}
              onChange={(v) => setPlay('isolationReview', v)}
            />
            <PlaybookToggle
              label="Follow-up Appointment Auto-Scheduling"
              description="Book post-discharge follow-up at 48h when discharge is confirmed"
              value={playbook.followUp}
              onChange={(v) => setPlay('followUp', v)}
            />
            <PlaybookToggle
              label="Lab Escalation for Pending TB Results"
              description="Notify duty doctor if TB culture or smear results are not returned within SLA"
              value={playbook.labEscalation}
              onChange={(v) => setPlay('labEscalation', v)}
            />
          </Card>
        </div>

        {/* ── Events Prevented This Month ───────────────────────────────── */}
        <Card title="Events Prevented This Month">
          <ResponsiveContainer width="100%" height={180}>
            <ComposedChart data={preventedData}>
              <defs>
                <linearGradient id="preventedFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#36C28B" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#36C28B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#1E2A3D" />
              <XAxis
                dataKey="week"
                tick={{ fill: '#5E6E85', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#5E6E85', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#121C2E',
                  border: '1px solid #1E2A3D',
                  borderRadius: 8,
                  fontSize: 12,
                  color: '#E8EEF7',
                }}
                labelStyle={{ color: '#5E6E85' }}
              />
              <Area
                type="monotone"
                dataKey="events"
                fill="url(#preventedFill)"
                stroke="none"
              />
              <Line
                type="monotone"
                dataKey="events"
                stroke="#36C28B"
                strokeWidth={2}
                dot={{ fill: '#36C28B', r: 3 }}
                activeDot={{ r: 5, fill: '#36C28B' }}
                name="Events Prevented"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        {/* ── All Opportunities Table ────────────────────────────────────── */}
        <Card
          title="All Prevention Opportunities"
          badge={liveOpportunities.length}
          badgeColor="#6B8AFE"
        >
          <DataTable columns={allColumns} rows={allRows} />
        </Card>

      </div>
    </PageContainer>
  );
};

export default AutonomousPrevention;
