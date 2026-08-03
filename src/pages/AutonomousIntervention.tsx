import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Zap,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  ChevronRight,
  Shield,
} from 'lucide-react';

import PageContainer from '../layout/PageContainer';
import {
  Card,
  StatCard,
  StatusPill,
  Tag,
  Badge,
  Timeline,
  DataTable,
  SectionTitle,
  EmptyState,
} from '../components';
import { interventions, buildAlignedInterventions } from '../data/interventions';
import type { Intervention, AuditEntry } from '../lib/types';
import { loadDemoSpine } from '../api/demoSpine';
import { useAsync } from '../hooks/useAsync';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function typeVariant(type: string): 'info' | 'warning' | 'critical' | 'caution' | 'muted' {
  switch (type) {
    case 'Diagnostic Order': return 'info';
    case 'Consult Request': return 'caution';
    case 'Isolation': return 'critical';
    case 'Notification': return 'success' as 'info';
    case 'Escalation': return 'warning';
    default: return 'muted';
  }
}

function typeTagVariant(type: string) {
  switch (type) {
    case 'Diagnostic Order': return 'info' as const;
    case 'Consult Request': return 'caution' as const;
    case 'Isolation': return 'critical' as const;
    case 'Notification': return 'success' as const;
    case 'Escalation': return 'warning' as const;
    default: return 'muted' as const;
  }
}

function auditToTimelineItem(entry: AuditEntry) {
  let type = 'action';
  if (entry.actorType === 'Agent') type = 'analysis';
  if (entry.action.toLowerCase().includes('escalat')) type = 'escalation';
  if (entry.action.toLowerCase().includes('alert')) type = 'alert';
  return {
    id: entry.id,
    timestamp: entry.timestamp,
    description: `${entry.actor} — ${entry.action}. ${entry.outcome}`,
    type,
  };
}

// ─── Autonomy Settings ────────────────────────────────────────────────────────

interface ToggleRowProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
  locked?: boolean;
}

function ToggleRow({ label, description, value, onChange, locked = false }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#1E2A3D] last:border-0">
      <div>
        <div className="text-sm font-medium" style={{ color: '#E8EEF7' }}>{label}</div>
        <div className="text-xs mt-0.5" style={{ color: '#5E6E85' }}>{description}</div>
      </div>
      <button
        onClick={() => !locked && onChange(!value)}
        disabled={locked}
        className="flex-shrink-0 ml-4 relative rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
        style={{
          width: 40,
          height: 22,
          backgroundColor: value ? (locked ? '#2a4a38' : '#36C28B') : '#1E2A3D',
          opacity: locked ? 0.6 : 1,
          cursor: locked ? 'not-allowed' : 'pointer',
        }}
        aria-checked={value}
        role="switch"
      >
        <span
          className="absolute top-0.5 rounded-full transition-transform duration-200"
          style={{
            width: 18,
            height: 18,
            backgroundColor: '#E8EEF7',
            left: value ? 20 : 2,
          }}
        />
      </button>
    </div>
  );
}

// ─── Rationale Panel ─────────────────────────────────────────────────────────

function RationalePanel({
  intervention,
  onClose,
}: {
  intervention: Intervention;
  onClose: () => void;
}) {
  const timelineItems = intervention.auditTrail.map(auditToTimelineItem);

  return (
    <motion.div
      key={intervention.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold leading-tight mb-1.5" style={{ color: '#E8EEF7' }}>
            {intervention.title}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Tag variant={typeTagVariant(intervention.type)}>{intervention.type}</Tag>
            <StatusPill status={intervention.status} size="sm" />
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 rounded-lg p-1 transition-colors hover:bg-[#1E2A3D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
          style={{ color: '#5E6E85' }}
          aria-label="Close rationale panel"
        >
          <X size={16} />
        </button>
      </div>

      {/* Triggering Rule */}
      <div>
        <div className="text-[10px] uppercase tracking-widest font-semibold mb-1.5" style={{ color: '#5E6E85' }}>
          Triggering Rule
        </div>
        <p className="text-xs leading-relaxed" style={{ color: '#93A1B5' }}>
          {intervention.trigger}
        </p>
      </div>

      {/* AI Assessment */}
      <div>
        <div className="text-[10px] uppercase tracking-widest font-semibold mb-1.5" style={{ color: '#5E6E85' }}>
          AI Assessment
        </div>
        <div
          className="rounded-lg p-3 text-xs leading-relaxed border"
          style={{
            backgroundColor: '#1a2844',
            borderColor: 'rgba(59,130,246,0.3)',
            color: '#93A1B5',
          }}
        >
          {intervention.rationale}
        </div>
      </div>

      {/* Confidence */}
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#5E6E85' }}>
          Model Confidence
        </div>
        <span className="text-sm font-semibold tabular-nums" style={{ color: '#36C28B', fontVariantNumeric: 'tabular-nums' }}>
          {intervention.confidence}%
        </span>
      </div>

      {/* Human in Loop */}
      <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: '#0F1828' }}>
        <Shield size={14} style={{ color: intervention.humanInLoop ? '#F4A638' : '#36C28B', flexShrink: 0 }} />
        <div className="text-xs" style={{ color: '#93A1B5' }}>
          {intervention.humanInLoop
            ? 'Requires human approval before execution'
            : 'Autonomous execution — no approval required'}
        </div>
      </div>

      {/* Audit Trail */}
      <div>
        <div className="text-[10px] uppercase tracking-widest font-semibold mb-2.5" style={{ color: '#5E6E85' }}>
          Audit Trail
        </div>
        <Timeline items={timelineItems} />
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const AutonomousIntervention: React.FC = () => {
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const spine = useAsync(() => loadDemoSpine(0), []);
  const liveInterventions = spine.data
    ? buildAlignedInterventions(spine.data)
    : interventions;

  // Autonomy toggle state
  const [toggles, setToggles] = useState({
    diagnosticOrders: true,
    consultRequests: true,
    isolation: true,
    notifications: true,
    escalations: true,
  });

  function setToggle(key: keyof typeof toggles, value: boolean) {
    setToggles((prev) => ({ ...prev, [key]: value }));
  }

  // Flatten audit trails for the combined timeline
  const allAuditEntries: (AuditEntry & { interventionTitle: string })[] = liveInterventions
    .flatMap((i) =>
      i.auditTrail.map((a) => ({ ...a, interventionTitle: i.title }))
    )
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  const combinedTimelineItems = allAuditEntries.map((entry) => ({
    id: entry.id,
    timestamp: entry.timestamp,
    description: `[${entry.interventionTitle}] ${entry.actor} — ${entry.action}. ${entry.outcome}`,
    type: entry.actorType === 'Agent' ? 'analysis' : entry.action.toLowerCase().includes('escalat') ? 'escalation' : 'action',
  }));

  // Table columns
  const columns = [
    {
      key: 'intervention',
      label: 'Intervention',
      width: '22%',
      render: (row: Record<string, unknown>) => {
        const i = row as unknown as Intervention;
        return (
          <div>
            <div className="text-sm font-medium mb-1" style={{ color: '#E8EEF7' }}>
              {i.title}
            </div>
            <Tag variant={typeTagVariant(i.type)}>{i.type}</Tag>
          </div>
        );
      },
    },
    {
      key: 'trigger',
      label: 'Trigger',
      width: '22%',
      render: (row: Record<string, unknown>) => {
        const i = row as unknown as Intervention;
        return (
          <span className="text-xs leading-snug" style={{ color: '#5E6E85' }}>
            {i.trigger}
          </span>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      width: '12%',
      render: (row: Record<string, unknown>) => {
        const i = row as unknown as Intervention;
        return <StatusPill status={i.status} size="sm" />;
      },
    },
    {
      key: 'destination',
      label: 'Destination',
      width: '16%',
      render: (row: Record<string, unknown>) => {
        const i = row as unknown as Intervention;
        return (
          <span className="text-xs" style={{ color: '#93A1B5' }}>
            {i.destination}
          </span>
        );
      },
    },
    {
      key: 'confidence',
      label: 'Confidence',
      width: '9%',
      render: (row: Record<string, unknown>) => {
        const i = row as unknown as Intervention;
        return (
          <span className="text-sm font-semibold tabular-nums" style={{ color: '#36C28B', fontVariantNumeric: 'tabular-nums' }}>
            {i.confidence}%
          </span>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Created',
      width: '12%',
      render: (row: Record<string, unknown>) => {
        const i = row as unknown as Intervention;
        return (
          <span className="text-xs" style={{ color: '#5E6E85' }}>
            {i.createdAt}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '14%',
      render: (row: Record<string, unknown>) => {
        const i = row as unknown as Intervention;
        const needsApproval =
          i.status === 'Queued' || i.status === 'Pending' || i.status === 'Triggered';
        return (
          <div className="flex items-center gap-1.5 flex-wrap">
            {needsApproval && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Approved: ${i.title}`);
                }}
                className="px-2 py-0.5 rounded text-[10px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#36C28B]"
                style={{
                  backgroundColor: 'rgba(54,194,139,0.15)',
                  color: '#36C28B',
                }}
              >
                Approve
              </button>
            )}
            {needsApproval && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Override: ${i.title}`);
                }}
                className="px-2 py-0.5 rounded text-[10px] font-semibold border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5E6E85]"
                style={{
                  borderColor: '#1E2A3D',
                  color: '#5E6E85',
                  backgroundColor: 'transparent',
                }}
              >
                Override
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIntervention((prev) =>
                  prev?.id === i.id ? null : i
                );
              }}
              className="flex items-center gap-0.5 text-[10px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
              style={{ color: '#3B82F6' }}
            >
              Rationale <ChevronRight size={10} />
            </button>
          </div>
        );
      },
    },
  ];

  const tableRows = liveInterventions as unknown as Record<string, unknown>[];

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">

        {/* ── Section Title ─────────────────────────────────────────────── */}
        <SectionTitle
          title="Autonomous Intervention"
          subtitle="Agentic AI prototype — triggers from live research API; actions are simulated / coming soon."
          icon={<Zap size={22} />}
        />

        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ backgroundColor: '#F4A63815', border: '1px solid #F4A63855', color: '#F4A638' }}
        >
          Coming soon: agentic execution against clinical systems. Triggers below are derived from Medical
          Intelligence research outputs
          {spine.data ? ` (featured case ${spine.data.patient.display_id})` : ''}. Not for clinical use.
        </div>

        {/* ── KPI Strip ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            label="Prototype Interventions"
            value={liveInterventions.length}
            color="#F0476A"
            icon={<AlertCircle size={18} />}
          />
          <StatCard
            label="Human-in-loop"
            value={liveInterventions.filter((i) => i.humanInLoop).length}
            color="#36C28B"
            icon={<CheckCircle size={18} />}
          />
          <StatCard
            label="Awaiting Approval"
            value={liveInterventions.filter((i) => i.status === 'Queued' || i.status === 'Pending').length}
            color="#F4A638"
            icon={<Clock size={18} />}
          />
          <StatCard
            label="Status"
            value="Coming Soon"
            color="#3B82F6"
            icon={<Zap size={18} />}
          />
        </div>

        {/* ── Main content: interventions table + rationale panel ───────── */}
        <div className="grid grid-cols-4 gap-4">

          {/* Left: Interventions Table */}
          <div className="col-span-3 flex flex-col gap-4">
            <Card
              title="Interventions"
              badge={liveInterventions.length}
              badgeColor="#3B82F6"
            >
              <DataTable
                columns={columns}
                rows={tableRows}
                onRowClick={(row) => {
                  const i = row as unknown as Intervention;
                  setSelectedIntervention((prev) =>
                    prev?.id === i.id ? null : i
                  );
                }}
                highlightRow={(row) => {
                  const i = row as unknown as Intervention;
                  return i.status === 'Queued' || i.status === 'Pending' || i.status === 'Triggered';
                }}
              />
            </Card>

            {/* Autonomy Settings */}
            <Card title="Autonomy Settings">
              <ToggleRow
                label="Diagnostic Orders"
                description="Auto-execute without clinician review"
                value={toggles.diagnosticOrders}
                onChange={(v) => setToggle('diagnosticOrders', v)}
              />
              <ToggleRow
                label="Consult Requests"
                description="Require clinician approval before sending"
                value={toggles.consultRequests}
                onChange={(v) => setToggle('consultRequests', v)}
              />
              <ToggleRow
                label="Isolation Protocol"
                description="Always requires clinician confirmation — locked by policy"
                value={toggles.isolation}
                onChange={(v) => setToggle('isolation', v)}
                locked
              />
              <ToggleRow
                label="Notifications"
                description="Auto-execute staff and nursing alerts"
                value={toggles.notifications}
                onChange={(v) => setToggle('notifications', v)}
              />
              <ToggleRow
                label="Escalations"
                description="Require approval before escalating to senior clinician"
                value={toggles.escalations}
                onChange={(v) => setToggle('escalations', v)}
              />
              <p className="text-[11px] mt-3 leading-relaxed" style={{ color: '#5E6E85' }}>
                Isolation and field actions always require clinician confirmation per hospital policy.
              </p>
            </Card>

            {/* Intervention Timeline */}
            <Card title="Intervention Timeline" badge={combinedTimelineItems.length} badgeColor="#6B8AFE">
              <Timeline items={combinedTimelineItems} />
            </Card>
          </div>

          {/* Right: Rationale Panel */}
          <div className="col-span-1">
            <Card title="Rationale" className="sticky top-6">
              <AnimatePresence mode="wait">
                {selectedIntervention ? (
                  <RationalePanel
                    key={selectedIntervention.id}
                    intervention={selectedIntervention}
                    onClose={() => setSelectedIntervention(null)}
                  />
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <EmptyState
                      icon={<ChevronRight size={22} />}
                      title="No intervention selected"
                      subtitle="Select an intervention to view its rationale, audit trail, and human-in-loop status."
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>
        </div>

      </div>
    </PageContainer>
  );
};

export default AutonomousIntervention;
