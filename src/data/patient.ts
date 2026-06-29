import type { Patient } from '../lib/types';

// ─── Primary Patient ──────────────────────────────────────────────────────────

export const patient: Patient = {
  id: 'PAT-001',
  mrn: 10024567,
  name: 'John Smith',
  age: 34,
  sex: 'Male',
  primarySuspicion: 'Pulmonary Tuberculosis',
  riskScore: 82,
  riskLevel: 'critical',
  autonomousActions: 4,
  confidence: 82,
  ward: 'Respiratory Ward B',
  lastUpdated: '06 May 2026, 10:34 AM',
  status: 'Active',
  encounterId: 'ENC-789102',
  encounterDate: '06 May 2026 10:24 AM',
  symptoms: [
    'Persistent productive cough (>3 weeks)',
    'Night sweats on 5 of past 7 nights',
    'Unexplained weight loss of 6 kg over 6 weeks',
    'Low-grade fever (37.9 °C) for 2 weeks',
    'Haemoptysis (blood-tinged sputum, 2 episodes)',
    'Progressive exertional dyspnoea',
  ],
  bmi: 21.3,
  history: 'No prior TB diagnosis or treatment. BCG vaccination confirmed at birth. No known TB contacts declared. Non-smoker. No immunosuppressive medications.',
};

// ─── Risk Trajectory ──────────────────────────────────────────────────────────
// 7-day rolling scores leading to current encounter

export const riskTrajectory: { day: string; score: number }[] = [
  { day: '30 Apr', score: 48 },
  { day: '01 May', score: 53 },
  { day: '02 May', score: 59 },
  { day: '03 May', score: 64 },
  { day: '04 May', score: 70 },
  { day: '05 May', score: 76 },
  { day: '06 May', score: 82 },
];

// ─── Outcome Predictions ──────────────────────────────────────────────────────

export const predictions: { label: string; value: number; color: string }[] = [
  { label: 'Clinical stability',    value: 15, color: '#16A34A' },
  { label: 'Disease progression',   value: 68, color: '#D97706' },
  { label: 'Hospital admission',    value: 42, color: '#D97706' },
  { label: 'Specialist escalation', value: 77, color: '#DC2626' },
];

// ─── Risk Drivers ─────────────────────────────────────────────────────────────

export const riskDrivers: {
  factor: string;
  contribution: number;
  direction: 'positive' | 'negative';
}[] = [
  { factor: 'Imaging CXR AI',        contribution: 28, direction: 'positive' },
  { factor: 'IP-10 Biomarker',       contribution: 14, direction: 'positive' },
  { factor: 'Symptom Cluster',       contribution: 12, direction: 'positive' },
  { factor: 'CBC Abnormality',       contribution:  9, direction: 'positive' },
  { factor: 'ESR / CRP Elevation',   contribution:  7, direction: 'positive' },
  { factor: 'Age / Demographics',    contribution:  4, direction: 'positive' },
  { factor: 'No Prior TB History',   contribution:  5, direction: 'negative' },
  { factor: 'Non-Smoker Status',     contribution:  3, direction: 'negative' },
];
