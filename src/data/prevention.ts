import type { PreventionOpportunity } from '../lib/types';

export const preventionOpportunities: PreventionOpportunity[] = [
  {
    id: 'PREV-001',
    title: 'Likely delay in pulmonology review',
    impact: 'High',
    predictedOutcome:
      'Without specialist input within 24 hours, empirical TB therapy may be delayed by 3–5 days, increasing infection transmission risk and worsening patient prognosis.',
    probability: 73,
    suggestedAction:
      'Auto-prioritise patient in pulmonology specialist queue and send escalation alert if review not completed within 4 hours.',
    confidence: 78,
    forecastDays: 5,
    status: 'Open',
  },
  {
    id: 'PREV-002',
    title: 'Missing smear result reducing diagnostic confidence',
    impact: 'High',
    predictedOutcome:
      'Absence of sputum smear result leaves the diagnosis unconfirmed, creating a 90% probability that isolation and treatment decisions will be made without microbiological evidence.',
    probability: 90,
    suggestedAction:
      'Trigger nursing task to collect induced sputum sample within 2 hours; alert duty doctor if specimen not received by lab by 12:00 PM.',
    confidence: 90,
    forecastDays: 1,
    status: 'Open',
  },
  {
    id: 'PREV-003',
    title: 'Contact tracing initiation delay',
    impact: 'High',
    predictedOutcome:
      'Each 24-hour delay in public health notification risks undetected transmission to household contacts, with an estimated 3–5 individuals at exposure risk.',
    probability: 68,
    suggestedAction:
      'Notify Public Health England contact tracing team automatically upon clinical confirmation of TB suspicion, ahead of laboratory confirmation.',
    confidence: 72,
    forecastDays: 7,
    status: 'Actioned',
  },
  {
    id: 'PREV-004',
    title: 'Radiology report overdue',
    impact: 'Medium',
    predictedOutcome:
      'AI-classified CXR remains without radiologist verification for >2 hours, creating a governance gap and delaying definitive imaging interpretation.',
    probability: 82,
    suggestedAction:
      'Escalate to on-call radiologist via PACS alert if formal report not submitted within 90 minutes of AI classification.',
    confidence: 85,
    forecastDays: 1,
    status: 'Actioned',
  },
  {
    id: 'PREV-005',
    title: 'Nutritional assessment not yet requested',
    impact: 'Medium',
    predictedOutcome:
      'BMI of 21.3 combined with documented 6 kg weight loss indicates significant nutritional compromise; without dietitian involvement, recovery trajectory may be slower.',
    probability: 61,
    suggestedAction:
      'Auto-generate dietitian referral for all TB-suspected patients with BMI <22 and weight loss >5% body weight.',
    confidence: 67,
    forecastDays: 14,
    status: 'Dismissed',
  },
  {
    id: 'PREV-006',
    title: 'Medication reconciliation gap on admission',
    impact: 'Low',
    predictedOutcome:
      'No prior medication list documented in the encounter record. If anti-TB therapy is initiated without reconciliation, drug interactions cannot be screened.',
    probability: 44,
    suggestedAction:
      'Prompt ward pharmacist to complete medication reconciliation before any new prescription is generated for this patient.',
    confidence: 58,
    forecastDays: 2,
    status: 'Dismissed',
  },
];
