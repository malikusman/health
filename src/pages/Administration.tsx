import React, { useState } from 'react';
import {
  Settings,
  Database,
  Cpu,
  Users,
  Shield,
  CheckCircle,
  AlertCircle,
  Globe,
} from 'lucide-react';
import PageContainer from '../layout/PageContainer';
import { Card, StatusPill, Badge, KeyValueRow, SectionTitle } from '../components';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'Organization' | 'Data Sources' | 'Models' | 'Users' | 'Guardrails' | 'Compliance';

const TABS: { label: Tab; icon: React.ReactNode }[] = [
  { label: 'Organization', icon: <Globe size={14} /> },
  { label: 'Data Sources', icon: <Database size={14} /> },
  { label: 'Models',       icon: <Cpu size={14} /> },
  { label: 'Users',        icon: <Users size={14} /> },
  { label: 'Guardrails',   icon: <Shield size={14} /> },
  { label: 'Compliance',   icon: <CheckCircle size={14} /> },
];

// ─── Sub-panel components ─────────────────────────────────────────────────────

function OrgTab() {
  return (
    <Card title="Organisation Details">
      <KeyValueRow label="Organisation Name" value="UC Davis Health" />
      <KeyValueRow label="Organisation ID"   value={<span className="font-mono text-xs">UCD-2024-001</span>} />
      <KeyValueRow
        label="License"
        value={<StatusPill status="Pending" size="sm" />}
      />
      <KeyValueRow label="Contract Start"  value="01 Jan 2026" />
      <KeyValueRow
        label="HIPAA BAA"
        value={
          <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#36C28B' }}>
            <CheckCircle size={12} /> Signed
          </span>
        }
      />
      <KeyValueRow label="Primary Contact" value="Dr. Elena Martinez" />
      <KeyValueRow
        label="Support Email"
        value={
          <a
            href="mailto:support@scorpiushealth.com"
            className="text-xs underline"
            style={{ color: '#3B82F6' }}
          >
            support@scorpiushealth.com
          </a>
        }
      />
    </Card>
  );
}

const DATA_SOURCES = [
  {
    icon: <Database size={20} />,
    color: '#3B82F6',
    name: 'Epic FHIR R4',
    type: 'EHR',
    syncTime: 'Just now',
  },
  {
    icon: <Database size={20} />,
    color: '#36C28B',
    name: 'Agfa IMPAX',
    type: 'PACS',
    syncTime: '2 min ago',
  },
  {
    icon: <Database size={20} />,
    color: '#6B8AFE',
    name: 'Cerner PowerChart',
    type: 'LIS',
    syncTime: '5 min ago',
  },
];

function DataSourcesTab() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {DATA_SOURCES.map((ds) => (
        <Card key={ds.name}>
          <div className="flex items-start gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${ds.color}18`, color: ds.color }}
            >
              {ds.icon}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#E8EEF7' }}>{ds.name}</p>
              <p className="text-xs" style={{ color: '#5E6E85' }}>{ds.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#36C28B' }} />
            <span className="text-xs font-semibold" style={{ color: '#36C28B' }}>CONNECTED</span>
          </div>
          <p className="text-xs mb-4" style={{ color: '#5E6E85' }}>Last sync: {ds.syncTime}</p>
          <div className="flex gap-2">
            <button
              onClick={() => alert(`Testing connection to ${ds.name}…`)}
              className="flex-1 py-1.5 rounded-lg text-xs font-semibold"
              style={{ backgroundColor: '#3B82F618', color: '#3B82F6' }}
            >
              Test Connection
            </button>
            <button
              onClick={() => alert(`Settings for ${ds.name}`)}
              className="flex-1 py-1.5 rounded-lg text-xs font-semibold"
              style={{ backgroundColor: '#1E2A3D', color: '#93A1B5' }}
            >
              Settings
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}

const MODELS_DATA = [
  { name: 'Scorpius Risk Engine',       version: 'v1.3', type: 'Ensemble',       status: 'Active' },
  { name: 'Imaging AI',                 version: 'v2.1', type: 'Computer Vision', status: 'Active' },
  { name: 'Care Coordination Agent',    version: 'v1.0', type: 'LLM Agent',       status: 'Active' },
  { name: 'Prevention Model',           version: 'v1.1', type: 'Predictive',      status: 'Active' },
];

function ModelsTab() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    'Scorpius Risk Engine':    true,
    'Imaging AI':              true,
    'Care Coordination Agent': true,
    'Prevention Model':        true,
  });

  return (
    <Card title="Deployed Models">
      <div className="overflow-x-auto">
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#0F1828' }}>
              {['Model Name', 'Version', 'Type', 'Status', 'Enabled'].map((h) => (
                <th
                  key={h}
                  className="py-2.5 px-4 text-left text-[10px] uppercase tracking-widest"
                  style={{ color: '#5E6E85' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MODELS_DATA.map((m, i) => (
              <tr
                key={m.name}
                className="border-b border-[#1E2A3D]"
                style={{ backgroundColor: i % 2 === 0 ? '#0F182830' : 'transparent' }}
              >
                <td className="py-3 px-4 text-sm font-semibold" style={{ color: '#E8EEF7' }}>{m.name}</td>
                <td className="py-3 px-4 font-mono text-xs" style={{ color: '#93A1B5' }}>{m.version}</td>
                <td className="py-3 px-4 text-xs" style={{ color: '#93A1B5' }}>{m.type}</td>
                <td className="py-3 px-4">
                  <Badge color="#36C28B" size="sm">Active</Badge>
                </td>
                <td className="py-3 px-4">
                  <button
                    role="switch"
                    aria-checked={enabled[m.name]}
                    onClick={() =>
                      setEnabled((prev) => ({ ...prev, [m.name]: !prev[m.name] }))
                    }
                    className="relative w-9 h-5 rounded-full transition-colors flex-shrink-0"
                    style={{
                      backgroundColor: enabled[m.name] ? '#3B82F6' : '#1E2A3D',
                      border:          '1px solid #1E2A3D',
                    }}
                  >
                    <span
                      className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform"
                      style={{
                        backgroundColor: '#fff',
                        transform: enabled[m.name] ? 'translateX(16px)' : 'translateX(0)',
                      }}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

const USERS_DATA = [
  { initials: 'EM', name: 'Dr. Elena Martinez', role: 'Super Admin',   email: 'e.martinez@ucdavis.edu',    access: 'Full',       lastLogin: 'Today, 08:00',   status: 'Active', color: '#3B82F6' },
  { initials: 'JO', name: 'Dr. James Osei',     role: 'Clinician',    email: 'j.osei@ucdavis.edu',        access: 'Clinician',  lastLogin: 'Today, 09:15',   status: 'Active', color: '#36C28B' },
  { initials: 'SK', name: 'Nurse Sarah Kim',    role: 'Nurse',        email: 's.kim@ucdavis.edu',         access: 'Nursing',    lastLogin: 'Today, 07:45',   status: 'Active', color: '#6B8AFE' },
  { initials: 'PN', name: 'Dr. Priya Nair',     role: 'Radiologist',  email: 'p.nair@ucdavis.edu',        access: 'Radiology',  lastLogin: 'Yesterday',      status: 'Active', color: '#F4A638' },
  { initials: 'AD', name: 'Admin User',         role: 'Admin',        email: 'admin@scorpiushealth.com',  access: 'Admin',      lastLogin: '06 May 2026',    status: 'Active', color: '#F2C94C' },
  { initials: 'RO', name: 'Read User',          role: 'Read-only',    email: 'readonly@scorpiushealth.com',access: 'Read-only', lastLogin: '01 May 2026',    status: 'Active', color: '#5E6E85' },
];

const ACCESS_COLOR: Record<string, string> = {
  Full:      '#F0476A',
  Clinician: '#3B82F6',
  Nursing:   '#36C28B',
  Radiology: '#6B8AFE',
  Admin:     '#F4A638',
  'Read-only':'#5E6E85',
};

function UsersTab() {
  return (
    <Card title="User Management">
      <div className="overflow-x-auto">
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#0F1828' }}>
              {['User', 'Role', 'Email', 'Access Level', 'Last Login', 'Status'].map((h) => (
                <th
                  key={h}
                  className="py-2.5 px-4 text-left text-[10px] uppercase tracking-widest"
                  style={{ color: '#5E6E85' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {USERS_DATA.map((u, i) => (
              <tr
                key={u.name}
                className="border-b border-[#1E2A3D]"
                style={{ backgroundColor: i % 2 === 0 ? '#0F182830' : 'transparent' }}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                      style={{ backgroundColor: `${u.color}22`, color: u.color }}
                    >
                      {u.initials}
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#E8EEF7' }}>{u.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-xs" style={{ color: '#93A1B5' }}>{u.role}</td>
                <td className="py-3 px-4 text-xs" style={{ color: '#5E6E85' }}>{u.email}</td>
                <td className="py-3 px-4">
                  <Badge color={ACCESS_COLOR[u.access] ?? '#5E6E85'} size="sm">{u.access}</Badge>
                </td>
                <td className="py-3 px-4 text-xs" style={{ color: '#93A1B5' }}>{u.lastLogin}</td>
                <td className="py-3 px-4">
                  <StatusPill status={u.status} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

interface SliderRowProps {
  label: string;
  description: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}

function SliderRow({ label, description, value, onChange, min = 0, max = 100 }: SliderRowProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-[#1E2A3D] last:border-0 gap-6">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: '#E8EEF7' }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: '#5E6E85' }}>{description}</p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-32 accent-[#3B82F6]"
        />
        <span
          className="text-sm font-bold tabular-nums w-10 text-right"
          style={{ color: '#3B82F6' }}
        >
          {value}%
        </span>
      </div>
    </div>
  );
}

interface ToggleRowProps {
  label: string;
  description: string;
  value: boolean;
  onChange?: (v: boolean) => void;
  locked?: boolean;
}

function ToggleRow({ label, description, value, onChange, locked }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-[#1E2A3D] last:border-0 gap-6">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: '#E8EEF7' }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: '#5E6E85' }}>{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={value}
        disabled={locked}
        onClick={() => !locked && onChange && onChange(!value)}
        className="relative w-10 h-6 rounded-full transition-colors flex-shrink-0"
        style={{
          backgroundColor: value ? '#3B82F6' : '#1E2A3D',
          border:          '1px solid #1E2A3D',
          opacity:         locked ? 0.5 : 1,
          cursor:          locked ? 'not-allowed' : 'pointer',
        }}
      >
        <span
          className="absolute top-1 left-1 w-4 h-4 rounded-full transition-transform"
          style={{
            backgroundColor: '#fff',
            transform: value ? 'translateX(16px)' : 'translateX(0)',
          }}
        />
      </button>
    </div>
  );
}

function GuardrailsTab() {
  const [autoExecThreshold, setAutoExecThreshold]    = useState(95);
  const [diagOrderThreshold, setDiagOrderThreshold]  = useState(85);
  const [autoEscalation, setAutoEscalation]          = useState(true);

  return (
    <Card title="Guardrail Configuration">
      <SliderRow
        label="Auto-execute confidence threshold"
        description="Minimum AI confidence required for autonomous action without human approval."
        value={autoExecThreshold}
        onChange={setAutoExecThreshold}
      />
      <ToggleRow
        label="Isolation actions require approval"
        description="All isolation protocol triggers must be reviewed and approved by a clinician."
        value={true}
        locked
      />
      <ToggleRow
        label="Discharge requires approval"
        description="No patient discharge can be initiated by the AI agent without clinician sign-off."
        value={true}
        locked
      />
      <SliderRow
        label="Diagnostic orders confidence threshold"
        description="Minimum confidence for autonomous diagnostic order placement (labs, imaging)."
        value={diagOrderThreshold}
        onChange={setDiagOrderThreshold}
      />
      <ToggleRow
        label="Auto-escalation"
        description="Automatically notify the on-call registrar when risk score breaches Critical tier."
        value={autoEscalation}
        onChange={setAutoEscalation}
      />
    </Card>
  );
}

function ComplianceTab() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Status card */}
      <Card title="Compliance Status">
        <div className="flex flex-col gap-3">
          {[
            { label: 'HIPAA Compliant',      icon: <CheckCircle size={14} />, color: '#36C28B', note: 'Verified' },
            { label: 'SOC 2 Type II',         icon: <AlertCircle size={14} />, color: '#F4A638', note: 'In Progress' },
            { label: 'Audit Logging',         icon: <CheckCircle size={14} />, color: '#36C28B', note: 'On' },
            { label: 'Data Encryption',       icon: <CheckCircle size={14} />, color: '#36C28B', note: 'AES-256' },
            { label: 'Transport Security',    icon: <CheckCircle size={14} />, color: '#36C28B', note: 'TLS 1.3' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-2 border-b border-[#1E2A3D] last:border-0"
            >
              <div className="flex items-center gap-2.5">
                <span style={{ color: item.color }}>{item.icon}</span>
                <span className="text-sm" style={{ color: '#E8EEF7' }}>{item.label}</span>
              </div>
              <span className="text-xs font-semibold" style={{ color: item.color }}>{item.note}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Activity card */}
      <Card title="Compliance Activity">
        <KeyValueRow
          label="Last compliance review"
          value="01 May 2026"
        />
        <KeyValueRow
          label="Break-glass events"
          value={
            <div className="flex items-center gap-2">
              <span style={{ color: '#F4A638' }}>3</span>
              <button className="text-xs underline" style={{ color: '#3B82F6' }} onClick={() => alert('Viewing break-glass log…')}>
                View log
              </button>
            </div>
          }
        />
        <KeyValueRow
          label="Data retention policy"
          value="7 years"
        />
        <KeyValueRow
          label="Last penetration test"
          value="Jun 2026"
        />
        <KeyValueRow
          label="Encryption at rest"
          value={<span style={{ color: '#36C28B' }}>AES-256 ✓</span>}
        />
        <KeyValueRow
          label="Encryption in transit"
          value={<span style={{ color: '#36C28B' }}>TLS 1.3 ✓</span>}
        />
      </Card>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const Administration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Organization');

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <SectionTitle
          title="Administration"
          subtitle="System configuration, data sources, models, and compliance."
          icon={<Settings size={22} />}
        />
      </div>

      {/* Tab bar */}
      <div
        className="flex gap-0 mb-6 border-b border-[#1E2A3D]"
        style={{ overflowX: 'auto' }}
      >
        {TABS.map(({ label, icon }) => {
          const isActive = activeTab === label;
          return (
            <button
              key={label}
              onClick={() => setActiveTab(label)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors"
              style={{
                color:        isActive ? '#3B82F6' : '#5E6E85',
                borderBottom: isActive ? '2px solid #3B82F6' : '2px solid transparent',
                marginBottom: -1,
              }}
            >
              <span style={{ color: isActive ? '#3B82F6' : '#5E6E85' }}>{icon}</span>
              {label}
            </button>
          );
        })}
      </div>

      {/* Active tab content */}
      {activeTab === 'Organization' && <OrgTab />}
      {activeTab === 'Data Sources' && <DataSourcesTab />}
      {activeTab === 'Models'       && <ModelsTab />}
      {activeTab === 'Users'        && <UsersTab />}
      {activeTab === 'Guardrails'   && <GuardrailsTab />}
      {activeTab === 'Compliance'   && <ComplianceTab />}
    </PageContainer>
  );
};

export default Administration;
