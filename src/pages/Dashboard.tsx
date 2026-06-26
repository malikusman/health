import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TriangleAlert,
  ChevronRight,
  Activity,
  Clock,
  Shield,
  Zap,
  Eye,
  ToggleLeft,
  ToggleRight,
  GitCompare,
  FlaskConical,
  Microscope,
  Brain,
  HeartPulse,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from 'lucide-react';

import PageContainer from '../layout/PageContainer';
import { Card } from '../components/Card';
import { RiskDonut } from '../components/RiskDonut';
import { ProgressBar } from '../components/ProgressBar';
import { StatusPill } from '../components/StatusPill';
import { Tag } from '../components/Tag';
import { Timeline } from '../components/Timeline';
import { KeyValueRow } from '../components/KeyValueRow';
import { ConfidenceMeter } from '../components/ConfidenceMeter';
import { Sparkline } from '../components/Sparkline';

import { patient, predictions } from '../data/patient';
import { interventions } from '../data/interventions';
import { preventionOpportunities } from '../data/prevention';
import { agentActivities } from '../data/careAgent';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionDivider() {
  return <div className="h-px w-full bg-[#1E2A3D] my-1" />;
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[11px] uppercase tracking-widest font-semibold"
      style={{ color: '#5E6E85' }}
    >
      {children}
    </span>
  );
}

function LinkButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-[12px] font-medium transition-colors"
      style={{ color: '#3B82F6' }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#60A5FA')}
      onMouseLeave={(e) => (e.currentTarget.style.color = '#3B82F6')}
    >
      {children}
      <ChevronRight size={12} />
    </button>
  );
}

// ─── Row 1 Cards ──────────────────────────────────────────────────────────────

function PatientStatusCard() {
  return (
    <Card title="Patient Status">
      <div className="flex flex-col items-center gap-3">
        {/* Risk level label */}
        <div className="text-center">
          <div
            className="text-[28px] font-bold tracking-tight leading-none"
            style={{ color: '#F0476A' }}
          >
            HIGH RISK
          </div>
          <div className="text-[11px] mt-1" style={{ color: '#5E6E85' }}>
            Pulmonary Tuberculosis Suspected
          </div>
        </div>

        {/* Donut */}
        <RiskDonut
          value={82}
          size={140}
          color="#F0476A"
          label="RISK"
          subtitle="Critical"
        />

        {/* Stats below donut */}
        <div className="w-full space-y-0">
          <SectionDivider />
          <div className="flex items-center justify-between py-2">
            <span className="text-[12px]" style={{ color: '#5E6E85' }}>
              Autonomous Actions
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-semibold tabular-nums" style={{ color: '#F0476A' }}>
                4
              </span>
              <span className="text-[11px]" style={{ color: '#5E6E85' }}>
                Triggered
              </span>
            </div>
          </div>
          <SectionDivider />
          <div className="flex items-center justify-between py-2">
            <span className="text-[12px]" style={{ color: '#5E6E85' }}>
              Prevention Opportunities
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-semibold tabular-nums" style={{ color: '#F4A638' }}>
                2
              </span>
              <span className="text-[11px]" style={{ color: '#5E6E85' }}>
                Identified
              </span>
            </div>
          </div>
          <SectionDivider />
          <div className="pt-2">
            <ConfidenceMeter value={82} label="Diagnostic Confidence" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function PredictedNextWeekCard() {
  return (
    <Card title="Predicted Next 7 Days">
      <div className="flex flex-col gap-4">
        {predictions.map((p) => (
          <ProgressBar
            key={p.label}
            label={p.label}
            value={p.value}
            color={p.color}
            height={5}
          />
        ))}
      </div>
      <div
        className="mt-5 pt-3 border-t border-[#1E2A3D] text-[11px]"
        style={{ color: '#5E6E85' }}
      >
        Model: Scorpius Risk Engine v1.3 · Updated 10:24 AM
      </div>
    </Card>
  );
}

function DiagnosticConfidenceCard() {
  const missingInputs = [
    'Smear Result',
    'Culture Result',
    'CT Scan',
  ];

  return (
    <Card title="Diagnostic Confidence">
      <div className="flex flex-col items-center gap-3">
        <RiskDonut
          value={82}
          size={120}
          color="#36C28B"
          label="CONF"
          subtitle="Current"
        />

        <div className="w-full">
          <div className="mb-2">
            <CardLabel>Missing inputs reducing confidence</CardLabel>
          </div>
          <div className="space-y-2">
            {missingInputs.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 py-1.5 px-2 rounded-lg"
                style={{ backgroundColor: '#0F1828' }}
              >
                <TriangleAlert size={13} style={{ color: '#F4A638', flexShrink: 0 }} />
                <span className="text-[12px]" style={{ color: '#93A1B5' }}>
                  {item}
                </span>
                <StatusPill status="Pending" size="sm" />
              </div>
            ))}
          </div>
          <div
            className="mt-3 text-[12px] font-medium"
            style={{ color: '#36C28B' }}
          >
            Expected if completed: 96%
          </div>
        </div>
      </div>
    </Card>
  );
}

function AtAGlanceCard() {
  return (
    <Card title="At a Glance">
      <div className="space-y-0">
        <KeyValueRow label="Symptoms" value="4/6 Present" />
        <KeyValueRow label="Imaging" value="Abnormal" valueColor="#F0476A" />
        <KeyValueRow label="Labs" value="2 Abnormal" valueColor="#F4A638" />
        <KeyValueRow label="Biomarkers" value="IP-10 Elevated" valueColor="#F4A638" />
        <KeyValueRow label="BMI" value="21.3 · Normal" />
        <KeyValueRow label="TB History" value="No Prior Treatment" />
      </div>

      {/* Sparkline for risk trajectory */}
      <div className="mt-4 pt-3 border-t border-[#1E2A3D]">
        <div className="flex items-center justify-between mb-2">
          <CardLabel>Risk Trajectory (7d)</CardLabel>
          <span
            className="text-[11px] font-semibold tabular-nums"
            style={{ color: '#F0476A' }}
          >
            82 ↑
          </span>
        </div>
        <Sparkline
          data={[48, 53, 59, 64, 70, 76, 82]}
          color="#F0476A"
          width={undefined as any}
          height={36}
        />
      </div>
    </Card>
  );
}

// ─── Row 2 Cards ──────────────────────────────────────────────────────────────

function ImagingAICard() {
  const navigate = useNavigate();
  const [showHeatmap, setShowHeatmap] = useState(false);

  const findings = [
    'Right upper lobe opacity with ill-defined borders',
    'Hilar prominence bilaterally — possible lymphadenopathy',
    'No pleural effusion identified on this view',
    'Patchy consolidation pattern consistent with TB infiltrate',
  ];

  return (
    <Card
      title="Imaging AI Result"
      className="col-span-2"
      action={
        <div
          className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
          style={{ backgroundColor: '#F0476A22', color: '#F0476A' }}
        >
          AI: SUSPICIOUS 82%
        </div>
      }
    >
      {/* Chest X-ray simulation */}
      <div className="relative rounded-lg overflow-hidden" style={{ backgroundColor: '#0a0e16', aspectRatio: '16/7' }}>
        {/* Film background texture */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 120%, #131a26 0%, #080c14 100%)',
          }}
        />

        {/* Left lung field */}
        <div
          className="absolute"
          style={{
            left: '22%',
            top: '12%',
            width: '26%',
            height: '72%',
            backgroundColor: '#1e2a38',
            borderRadius: '45% 42% 38% 44% / 30% 30% 55% 52%',
            opacity: 0.7,
          }}
        />

        {/* Right lung field */}
        <div
          className="absolute"
          style={{
            right: '22%',
            top: '12%',
            width: '26%',
            height: '72%',
            backgroundColor: '#1e2a38',
            borderRadius: '42% 45% 44% 38% / 30% 30% 52% 55%',
            opacity: 0.7,
          }}
        />

        {/* Right upper lobe opacity (subtle) */}
        <div
          className="absolute"
          style={{
            right: '24%',
            top: '13%',
            width: '14%',
            height: '28%',
            backgroundColor: '#2e3a48',
            borderRadius: '40% 40% 50% 50% / 40% 40% 60% 60%',
            opacity: 0.6,
          }}
        />

        {/* Spine / mediastinum */}
        <div
          className="absolute"
          style={{
            left: '50%',
            top: '5%',
            transform: 'translateX(-50%)',
            width: '6%',
            height: '88%',
            backgroundColor: '#252f3e',
            borderRadius: '3px',
            opacity: 0.5,
          }}
        />

        {/* Heatmap overlay */}
        {showHeatmap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 65% 25%, rgba(240,71,106,0.45) 0%, rgba(244,166,56,0.2) 40%, transparent 70%)',
            }}
          />
        )}

        {/* Corner label */}
        <div
          className="absolute top-2 left-2 text-[10px] font-mono px-1.5 py-0.5 rounded"
          style={{ backgroundColor: '#0B122099', color: '#5E6E85' }}
        >
          CXR PA · 06 MAY 2026 · 10:12
        </div>

        {/* AI badge top right */}
        <div
          className="absolute top-2 right-2 text-[11px] font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: '#F0476A33', color: '#F0476A' }}
        >
          AI: SUSPICIOUS 82%
        </div>

        {/* Heatmap active indicator */}
        {showHeatmap && (
          <div
            className="absolute bottom-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: '#F0476A33', color: '#F0476A' }}
          >
            HEATMAP ACTIVE
          </div>
        )}
      </div>

      {/* Key findings */}
      <div className="mt-3">
        <CardLabel>Key Findings</CardLabel>
        <ul className="mt-2 space-y-1.5">
          {findings.map((f, i) => (
            <li key={i} className="flex items-start gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                style={{ backgroundColor: '#F0476A' }}
              />
              <span className="text-[12px]" style={{ color: '#93A1B5' }}>
                {f}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action buttons */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => navigate('/imaging')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors"
          style={{ backgroundColor: '#1E2A3D', color: '#E8EEF7' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#243040')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1E2A3D')}
        >
          <Eye size={13} />
          View Full Image
        </button>
        <button
          onClick={() => setShowHeatmap((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors"
          style={{
            backgroundColor: showHeatmap ? '#F0476A22' : '#1E2A3D',
            color: showHeatmap ? '#F0476A' : '#93A1B5',
          }}
        >
          {showHeatmap ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
          Heatmap {showHeatmap ? 'On' : 'Off'}
        </button>
        <button
          onClick={() => alert('Prior comparison not available in this session.')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors"
          style={{ backgroundColor: '#1E2A3D', color: '#93A1B5' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#243040')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1E2A3D')}
        >
          <GitCompare size={13} />
          Compare Prior
        </button>
      </div>

      {/* Imaging timeline strip */}
      <div className="mt-3 pt-3 border-t border-[#1E2A3D]">
        <CardLabel>Imaging Studies</CardLabel>
        <div className="mt-2 flex gap-2">
          <div
            className="flex-1 px-3 py-2 rounded-lg border"
            style={{ backgroundColor: '#0F1828', borderColor: '#3B82F655' }}
          >
            <div className="text-[11px] font-semibold" style={{ color: '#E8EEF7' }}>
              Chest X-ray PA
            </div>
            <div className="text-[10px] mt-0.5" style={{ color: '#5E6E85' }}>
              06 May 2026 · 10:12 AM
            </div>
            <div className="mt-1">
              <StatusPill status="Triggered" size="sm" />
            </div>
          </div>
          <button
            disabled
            className="flex-1 px-3 py-2 rounded-lg border border-dashed text-center opacity-50 cursor-not-allowed"
            style={{ borderColor: '#1E2A3D', backgroundColor: '#0B1220' }}
          >
            <div className="text-[11px]" style={{ color: '#5E6E85' }}>
              + Add CT Scan
            </div>
            <div className="text-[10px] mt-0.5" style={{ color: '#5E6E85' }}>
              Coming Soon
            </div>
          </button>
        </div>
      </div>
    </Card>
  );
}

function InterventionEngineCard() {
  const navigate = useNavigate();
  const topInterventions = interventions.slice(0, 4);

  return (
    <Card
      title="Autonomous Intervention Engine"
      badge="4 Active"
      badgeColor="#F0476A"
      action={
        <LinkButton onClick={() => navigate('/intervention')}>
          View All Interventions
        </LinkButton>
      }
    >
      {/* Table header */}
      <div
        className="grid gap-2 pb-2 mb-1 border-b border-[#1E2A3D]"
        style={{ gridTemplateColumns: '1fr 100px 120px 70px' }}
      >
        {['Action', 'Status', 'Destination', 'Time'].map((h) => (
          <span key={h} className="text-[10px] uppercase tracking-widest" style={{ color: '#5E6E85' }}>
            {h}
          </span>
        ))}
      </div>

      {/* Table rows */}
      <div className="divide-y divide-[#1E2A3D]">
        {topInterventions.map((intervention) => {
          const timeStr = intervention.createdAt.split(', ')[1] ?? intervention.createdAt;
          return (
            <div
              key={intervention.id}
              className="grid gap-2 py-2.5 items-center"
              style={{ gridTemplateColumns: '1fr 100px 120px 70px' }}
            >
              <div>
                <div className="text-[12px] font-medium leading-snug" style={{ color: '#E8EEF7' }}>
                  {intervention.title}
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: '#5E6E85' }}>
                  {intervention.type}
                </div>
              </div>
              <StatusPill status={intervention.status} size="sm" />
              <div className="text-[11px] truncate" style={{ color: '#93A1B5' }}>
                {intervention.destination}
              </div>
              <div className="text-[11px] tabular-nums" style={{ color: '#5E6E85' }}>
                {timeStr}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function PreventionOpportunitiesCard() {
  const navigate = useNavigate();
  const openOpportunities = preventionOpportunities.filter((p) => p.status === 'Open').slice(0, 2);

  return (
    <Card
      title="Autonomous Prevention Opportunities"
      badge="2 Active"
      badgeColor="#F0476A"
      action={
        <LinkButton onClick={() => navigate('/prevention')}>
          View All Opportunities
        </LinkButton>
      }
    >
      <div className="space-y-3">
        {openOpportunities.map((opp) => (
          <div
            key={opp.id}
            className="p-3 rounded-lg border"
            style={{ backgroundColor: '#0F1828', borderColor: '#1E2A3D' }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <Tag variant="critical">High Impact</Tag>
              <span
                className="text-[11px] tabular-nums"
                style={{ color: '#5E6E85' }}
              >
                {opp.probability}% prob
              </span>
            </div>
            <div className="text-[13px] font-semibold mb-1" style={{ color: '#E8EEF7' }}>
              {opp.title}
            </div>
            <div className="text-[11px] mb-2 leading-relaxed" style={{ color: '#5E6E85' }}>
              {opp.predictedOutcome.slice(0, 110)}…
            </div>
            <div
              className="text-[11px] mb-3 px-2 py-1.5 rounded"
              style={{ backgroundColor: '#3B82F610', color: '#6B8AFE' }}
            >
              {opp.suggestedAction}
            </div>
            <button
              onClick={() => alert(`Action taken for: ${opp.title}`)}
              className="text-[12px] font-medium px-3 py-1 rounded-lg border transition-colors"
              style={{ borderColor: '#3B82F644', color: '#3B82F6', backgroundColor: 'transparent' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3B82F615')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Take Action
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Row 3 Cards ──────────────────────────────────────────────────────────────

function ClinicalSummaryCard() {
  const symptoms = patient.symptoms ?? [];
  const presentSymptoms = symptoms.slice(0, 4);
  const absentSymptoms = symptoms.slice(4);

  return (
    <Card title="Clinical Summary">
      {/* Symptom chips */}
      <div>
        <CardLabel>Symptom Profile</CardLabel>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {presentSymptoms.map((s, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium"
              style={{ backgroundColor: '#36C28B18', color: '#36C28B' }}
            >
              <CheckCircle2 size={10} />
              {s.split('(')[0].trim()}
            </span>
          ))}
          {absentSymptoms.map((s, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium"
              style={{ backgroundColor: '#1E2A3D', color: '#5E6E85' }}
            >
              <XCircle size={10} />
              {s.split('(')[0].trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-0">
        <KeyValueRow label="BMI" value={`${patient.bmi} · Normal`} />
        <KeyValueRow
          label="Medical History"
          value={
            <span className="text-right text-[12px]" style={{ maxWidth: 160, display: 'block', lineHeight: 1.4 }}>
              BCG vaccinated, Non-smoker
            </span>
          }
        />
        <KeyValueRow
          label="Treatment History"
          value="No Prior Treatment"
        />
        <KeyValueRow label="Ward" value={patient.ward} />
        <KeyValueRow label="Encounter" value={patient.encounterId} />
      </div>
    </Card>
  );
}

function LabSummaryCard() {
  const navigate = useNavigate();

  const keyLabs = [
    { test: 'Sputum Smear', value: 'Pending', flag: 'Pending' },
    { test: 'Culture', value: 'Pending', flag: 'Pending' },
    { test: 'CBC', value: 'WBC 11.8 · Neut 78%', flag: 'Abnormal' },
    { test: 'ESR / CRP', value: '68 mm/hr · 42 mg/L', flag: 'Abnormal' },
    { test: 'IP-10 (CXCL10)', value: '856 pg/mL', flag: 'Critical' },
  ];

  const flagColor: Record<string, string> = {
    Pending: '#F2C94C',
    Abnormal: '#F4A638',
    Critical: '#F0476A',
    Normal: '#36C28B',
  };

  return (
    <Card
      title="Lab & Biomarker Summary"
      action={
        <LinkButton onClick={() => navigate('/labs')}>
          View Full Lab Panel
        </LinkButton>
      }
    >
      <div className="space-y-0">
        {keyLabs.map((lab) => (
          <div
            key={lab.test}
            className="flex items-center justify-between py-2 border-b border-[#1E2A3D] last:border-0"
          >
            <span className="text-[12px]" style={{ color: '#5E6E85' }}>
              {lab.test}
            </span>
            <div className="flex items-center gap-2">
              <span
                className="text-[12px] font-medium tabular-nums text-right"
                style={{ color: flagColor[lab.flag] ?? '#E8EEF7', maxWidth: 130 }}
              >
                {lab.value}
              </span>
              <StatusPill status={lab.flag} size="sm" />
            </div>
          </div>
        ))}
      </div>

      {/* IP-10 sparkline */}
      <div className="mt-3 pt-3 border-t border-[#1E2A3D]">
        <div className="flex items-center justify-between mb-1">
          <CardLabel>IP-10 Trend</CardLabel>
          <span className="text-[11px] font-semibold" style={{ color: '#F0476A' }}>
            Critical ↑
          </span>
        </div>
        <Sparkline data={[200, 350, 520, 680, 856]} color="#F0476A" height={32} />
      </div>
    </Card>
  );
}

function CareAgentCard() {
  const navigate = useNavigate();
  const recentActivities = agentActivities.slice(0, 6);

  return (
    <Card
      title="Care Coordination Agent"
      action={
        <LinkButton onClick={() => navigate('/care')}>
          View Activity Log
        </LinkButton>
      }
    >
      <div
        className="mb-3 px-2 py-1 rounded text-[11px] inline-flex items-center gap-1.5"
        style={{ backgroundColor: '#6B8AFE18', color: '#6B8AFE' }}
      >
        <Activity size={11} />
        Last 30 Minutes
      </div>
      <Timeline items={recentActivities} />
    </Card>
  );
}

function RecommendationsCard() {
  const recommendations = [
    { text: 'Order sputum smear (AFB)', priority: 'High' as const },
    { text: 'Pulmonologist review', priority: 'High' as const },
    { text: 'Isolation consideration', priority: 'High' as const },
    { text: 'Recommend CT chest', priority: 'Medium' as const },
    { text: 'Extended biomarker panel', priority: 'Medium' as const },
  ];

  const priorityVariant: Record<string, 'critical' | 'warning' | 'info'> = {
    High: 'critical',
    Medium: 'warning',
    Low: 'info',
  };

  return (
    <Card title="Recommendations & Next Steps">
      <div className="space-y-0 divide-y divide-[#1E2A3D]">
        {recommendations.map((rec, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5">
            <Tag variant={priorityVariant[rec.priority]}>{rec.priority}</Tag>
            <span className="text-[13px] flex-1" style={{ color: '#E8EEF7' }}>
              {rec.text}
            </span>
            <ArrowRight size={13} style={{ color: '#5E6E85', flexShrink: 0 }} />
          </div>
        ))}
      </div>

      <button
        onClick={() => alert('Recommendations marked as reviewed.')}
        className="w-full mt-4 py-2 rounded-lg text-[13px] font-semibold transition-colors"
        style={{ backgroundColor: '#3B82F6', color: '#ffffff' }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2563EB')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3B82F6')}
      >
        Mark as Reviewed
      </button>
    </Card>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1
              className="text-[22px] font-bold tracking-tight"
              style={{ color: '#E8EEF7' }}
            >
              Patient Overview
            </h1>
            <p className="text-[13px] mt-0.5" style={{ color: '#5E6E85' }}>
              {patient.name} · {patient.age}y {patient.sex} · MRN {patient.mrn}
            </p>
          </div>

          {/* Encounter info strip */}
          <div
            className="flex items-center gap-4 px-4 py-2 rounded-lg border"
            style={{ backgroundColor: '#121C2E', borderColor: '#1E2A3D' }}
          >
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest" style={{ color: '#5E6E85' }}>
                Encounter
              </div>
              <div className="text-[12px] font-semibold" style={{ color: '#E8EEF7' }}>
                {patient.encounterId}
              </div>
            </div>
            <div className="w-px h-8 bg-[#1E2A3D]" />
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest" style={{ color: '#5E6E85' }}>
                Date
              </div>
              <div className="text-[12px] font-semibold" style={{ color: '#E8EEF7' }}>
                {patient.encounterDate}
              </div>
            </div>
            <div className="w-px h-8 bg-[#1E2A3D]" />
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest" style={{ color: '#5E6E85' }}>
                Primary Suspicion
              </div>
              <div className="text-[12px] font-semibold" style={{ color: '#F0476A' }}>
                {patient.primarySuspicion}
              </div>
            </div>
            <div className="w-px h-8 bg-[#1E2A3D]" />
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest" style={{ color: '#5E6E85' }}>
                Ward
              </div>
              <div className="text-[12px] font-semibold" style={{ color: '#E8EEF7' }}>
                {patient.ward}
              </div>
            </div>
          </div>
        </div>

        {/* Critical alert banner */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-4 flex items-center gap-3 px-4 py-2.5 rounded-lg border"
          style={{
            backgroundColor: '#F0476A0D',
            borderColor: '#F0476A33',
          }}
        >
          <AlertTriangle size={14} style={{ color: '#F0476A', flexShrink: 0 }} />
          <span className="text-[12px] font-medium" style={{ color: '#F0476A' }}>
            CRITICAL — Risk score 82/100. Scorpius has triggered 4 autonomous actions. Clinician review required.
          </span>
          <span
            className="ml-auto text-[11px] tabular-nums"
            style={{ color: '#5E6E85', flexShrink: 0 }}
          >
            Updated {patient.lastUpdated}
          </span>
        </motion.div>
      </div>

      {/* ROW 1 */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <PatientStatusCard />
        <PredictedNextWeekCard />
        <DiagnosticConfidenceCard />
        <AtAGlanceCard />
      </div>

      {/* ROW 2 */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <ImagingAICard />
        <div className="col-span-2 flex flex-col gap-4">
          <InterventionEngineCard />
          <PreventionOpportunitiesCard />
        </div>
      </div>

      {/* ROW 3 */}
      <div className="grid grid-cols-4 gap-4">
        <ClinicalSummaryCard />
        <LabSummaryCard />
        <CareAgentCard />
        <RecommendationsCard />
      </div>
    </PageContainer>
  );
};

export default Dashboard;
