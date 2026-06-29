import type { AgentActivity, CareTask } from '../lib/types';

// ─── Agent Activity Log ───────────────────────────────────────────────────────
// Timestamped activity for John Smith (PAT-001), 06 May 2026

export const agentActivities: AgentActivity[] = [
  {
    id: 'ACT-001',
    timestamp: '06 May 2026, 10:00 AM',
    description: 'Encounter ENC-789102 created; initial patient data ingestion complete.',
    type: 'analysis',
  },
  {
    id: 'ACT-002',
    timestamp: '06 May 2026, 10:02 AM',
    description: 'Symptom cluster analysed: 6 TB-consistent symptoms identified. Cluster score 0.88.',
    type: 'analysis',
  },
  {
    id: 'ACT-003',
    timestamp: '06 May 2026, 10:05 AM',
    description: 'Automated lab panel generated: FBC, CRP, ESR, LDH, IP-10, IFN-γ.',
    type: 'order',
  },
  {
    id: 'ACT-004',
    timestamp: '06 May 2026, 10:08 AM',
    description: 'CXR PA image routed to imaging AI pipeline for classification.',
    type: 'analysis',
  },
  {
    id: 'ACT-005',
    timestamp: '06 May 2026, 10:12 AM',
    description: 'CXR classified SUSPICIOUS (82% probability). Right upper lobe opacity flagged.',
    type: 'alert',
  },
  {
    id: 'ACT-006',
    timestamp: '06 May 2026, 10:15 AM',
    description: 'Nursing alert dispatched: respiratory precautions recommended for Respiratory Ward B.',
    type: 'alert',
  },
  {
    id: 'ACT-007',
    timestamp: '06 May 2026, 10:20 AM',
    description: 'Risk score recalculated following imaging and lab ingestion: 58 → 76 → 82.',
    type: 'analysis',
  },
  {
    id: 'ACT-008',
    timestamp: '06 May 2026, 10:22 AM',
    description: 'Critical tier threshold breached. Senior registrar escalation notification sent.',
    type: 'alert',
  },
  {
    id: 'ACT-009',
    timestamp: '06 May 2026, 10:24 AM',
    description: 'Sputum smear (AFB) order transmitted to Lab System without human-in-loop.',
    type: 'order',
  },
  {
    id: 'ACT-010',
    timestamp: '06 May 2026, 10:26 AM',
    description: 'Pulmonology consult request drafted and queued for Dr Sharma approval.',
    type: 'consult',
  },
  {
    id: 'ACT-011',
    timestamp: '06 May 2026, 10:28 AM',
    description: 'Infectious disease consult flag raised. Awaiting Dr Marcus Webb acknowledgement.',
    type: 'consult',
  },
  {
    id: 'ACT-012',
    timestamp: '06 May 2026, 10:30 AM',
    description: 'Encounter summary auto-drafted for clinical documentation. Isolation protocol review initiated.',
    type: 'documentation',
  },
];

// ─── Care Tasks ───────────────────────────────────────────────────────────────

export const careTasks: CareTask[] = [
  {
    id: 'TASK-001',
    title: 'Collect induced sputum specimen for AFB smear',
    assignee: 'Staff Nurse Adaeze Okoye',
    status: 'in-progress',
    priority: 'urgent',
    dueDate: '06 May 2026, 12:00 PM',
  },
  {
    id: 'TASK-002',
    title: 'Approve pulmonology consult request (INT-002)',
    assignee: 'Dr Priya Sharma',
    status: 'todo',
    priority: 'urgent',
    dueDate: '06 May 2026, 11:00 AM',
  },
  {
    id: 'TASK-003',
    title: 'Review isolation protocol suitability for Respiratory Ward B',
    assignee: 'Infection Control Nurse',
    status: 'todo',
    priority: 'high',
    dueDate: '06 May 2026, 01:00 PM',
  },
  {
    id: 'TASK-004',
    title: 'Confirm ID consult with Dr Marcus Webb',
    assignee: 'Dr Lena Hoffmann',
    status: 'todo',
    priority: 'high',
    dueDate: '06 May 2026, 12:30 PM',
  },
  {
    id: 'TASK-005',
    title: 'Perform bedside clinical review of PAT-001',
    assignee: 'Dr Lena Hoffmann',
    status: 'done',
    priority: 'urgent',
    dueDate: '06 May 2026, 10:45 AM',
  },
  {
    id: 'TASK-006',
    title: 'Verify radiology report for CXR PA (IMG-001)',
    assignee: 'Dr Raj Patel (Radiology)',
    status: 'in-progress',
    priority: 'high',
    dueDate: '06 May 2026, 11:30 AM',
  },
  {
    id: 'TASK-007',
    title: 'Document PPE and visitor restriction in nursing notes',
    assignee: 'Staff Nurse Adaeze Okoye',
    status: 'done',
    priority: 'medium',
    dueDate: '06 May 2026, 10:30 AM',
  },
  {
    id: 'TASK-008',
    title: 'Schedule CT chest if smear result is negative',
    assignee: 'Dr Priya Sharma',
    status: 'todo',
    priority: 'medium',
    dueDate: '06 May 2026, 05:00 PM',
  },
];
