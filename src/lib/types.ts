// ─── Risk ────────────────────────────────────────────────────────────────────

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

// ─── Intervention ─────────────────────────────────────────────────────────────

export type InterventionStatus =
  | 'Generated'
  | 'Queued'
  | 'Pending'
  | 'Triggered'
  | 'Completed'
  | 'Awaiting Approval';

export type InterventionType =
  | 'Diagnostic Order'
  | 'Consult Request'
  | 'Isolation'
  | 'Notification'
  | 'Escalation';

// ─── Prevention ───────────────────────────────────────────────────────────────

export type PreventionImpact = 'High' | 'Medium' | 'Low';

export type PreventionStatus = 'Open' | 'Actioned' | 'Dismissed';

// ─── Lab ──────────────────────────────────────────────────────────────────────

export type LabFlag = 'Normal' | 'Abnormal' | 'Pending' | 'Critical';

// ─── Patient ──────────────────────────────────────────────────────────────────

export interface Patient {
  id: string;
  mrn: number;
  name: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  primarySuspicion: string;
  riskScore: number;
  riskLevel: RiskLevel;
  autonomousActions: number;
  confidence: number;
  ward: string;
  lastUpdated: string;
  status: 'Active' | 'Discharged' | 'Pending' | 'Transferred';
  encounterId: string;
  encounterDate: string;
  symptoms?: string[];
  bmi?: number;
  history?: string;
}

// ─── Audit ────────────────────────────────────────────────────────────────────

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorType: 'Clinician' | 'System' | 'Agent';
  action: string;
  target: string;
  outcome: string;
  confidence?: number;
  session: string;
  ip: string;
}

// ─── Intervention ─────────────────────────────────────────────────────────────

export interface Intervention {
  id: string;
  title: string;
  type: InterventionType;
  status: InterventionStatus;
  trigger: string;
  owner: string;
  destination: string;
  confidence: number;
  createdAt: string;
  rationale: string;
  humanInLoop: boolean;
  auditTrail: AuditEntry[];
}

// ─── Prevention ───────────────────────────────────────────────────────────────

export interface PreventionOpportunity {
  id: string;
  title: string;
  impact: PreventionImpact;
  predictedOutcome: string;
  probability: number;
  suggestedAction: string;
  confidence: number;
  forecastDays: number;
  status: PreventionStatus;
}

// ─── Labs ─────────────────────────────────────────────────────────────────────

export interface LabResult {
  id: string;
  test: string;
  section: string;
  value: number | string | null;
  unit: string;
  refRange: string;
  flag: LabFlag;
  trend: number[];
}

// ─── Imaging ──────────────────────────────────────────────────────────────────

export type ImagingClassification = 'SUSPICIOUS' | 'INDETERMINATE' | 'NORMAL' | 'PENDING';
export type RadiologistStatus = 'Pending Review' | 'Reviewed' | 'Reported' | 'Awaiting';

export interface ImagingStudy {
  id: string;
  modality: string;
  view: string;
  date: string;
  aiClassification: ImagingClassification;
  probability: number | null;
  confidence: 'High' | 'Medium' | 'Low' | 'N/A';
  radiologistStatus: RadiologistStatus;
  findings: string[];
}

// ─── Agent / Care ─────────────────────────────────────────────────────────────

export interface AgentActivity {
  id: string;
  timestamp: string;
  description: string;
  type: 'analysis' | 'order' | 'alert' | 'consult' | 'documentation' | 'monitoring';
}

export interface CareTask {
  id: string;
  title: string;
  assignee: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  dueDate: string;
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export type ReportType =
  | 'Encounter Summary'
  | 'Risk Assessment'
  | 'Imaging Report'
  | 'Intervention Audit'
  | 'Prevention Impact'
  | 'Lab Panel Summary';

export interface Report {
  id: string;
  type: ReportType;
  title: string;
  date: string;
  status: 'Complete' | 'Draft';
  generatedBy: string;
  size: string;
}
