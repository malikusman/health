import type { PreventionOpportunity } from '../lib/types';
import type { DemoSpine } from '../api/demoSpine';

/** Prevention agent prototypes aligned to live research API (coming soon). */
export function buildAlignedPrevention(spine: DemoSpine): PreventionOpportunity[] {
  const { patient, tbProbabilityLabel, summary, modelName, studyId } = spine;
  const display = patient.display_id;
  const fp = summary.latest_model_run?.confusion_matrix.false_positive ?? 2;

  return [
    {
      id: 'PREV-API-001',
      title: 'Specialist review lag on high research TB probability',
      impact: 'High',
      predictedOutcome: `If ${display} (research TB ${tbProbabilityLabel}) waits without specialist attention, confirmatory pathway and isolation decisions may be delayed once clinical systems are connected.`,
      probability: 73,
      suggestedAction:
        'Coming soon: auto-prioritise in specialist queue and escalate if review not acknowledged within a configured SLA.',
      confidence: 78,
      forecastDays: 5,
      status: 'Open',
    },
    {
      id: 'PREV-API-002',
      title: 'Confirmatory labs not yet connected to research signal',
      impact: 'High',
      predictedOutcome: `${modelName} flagged ${display}, but Phase 1 API has no lab endpoints. Without an agentic bridge, operators may miss confirmatory workup.`,
      probability: 90,
      suggestedAction:
        'Coming soon: when LIS is integrated, agent proposes smear/culture tasks tied to research TB probability and threshold.',
      confidence: 90,
      forecastDays: 1,
      status: 'Open',
    },
    {
      id: 'PREV-API-003',
      title: 'CT study awaiting human verification',
      impact: 'Medium',
      predictedOutcome: `Study ${studyId} is viewable in CT Imaging; without a radiology-priority agent, formal review may lag AI research scoring.`,
      probability: 68,
      suggestedAction:
        'Coming soon: escalate to radiology worklist if research-predicted TB case lacks human verification within policy window.',
      confidence: 72,
      forecastDays: 1,
      status: 'Open',
    },
    {
      id: 'PREV-API-004',
      title: 'False-positive governance on latest model run',
      impact: 'Medium',
      predictedOutcome: `Latest run reports ${fp} false positive(s) on the test cohort. Unreviewed FPs can erode trust if agents auto-escalate without human-in-the-loop.`,
      probability: 55,
      suggestedAction:
        'Coming soon: governance agent flags FP cases from confusion matrix for QA review before autonomous actions.',
      confidence: 70,
      forecastDays: 7,
      status: 'Actioned',
    },
  ];
}

export const preventionOpportunities: PreventionOpportunity[] = [
  {
    id: 'PREV-API-001',
    title: 'Specialist review lag on high research TB probability',
    impact: 'High',
    predictedOutcome:
      'High research TB probability cases may wait without specialist attention until clinical systems connect.',
    probability: 73,
    suggestedAction: 'Coming soon: auto-prioritise specialist queue.',
    confidence: 78,
    forecastDays: 5,
    status: 'Open',
  },
  {
    id: 'PREV-API-002',
    title: 'Confirmatory labs not yet connected to research signal',
    impact: 'High',
    predictedOutcome: 'Phase 1 API has no lab endpoints — confirmatory pathway is a planned agentic bridge.',
    probability: 90,
    suggestedAction: 'Coming soon: LIS-integrated confirmatory orders.',
    confidence: 90,
    forecastDays: 1,
    status: 'Open',
  },
  {
    id: 'PREV-API-003',
    title: 'CT study awaiting human verification',
    impact: 'Medium',
    predictedOutcome: 'Research CT scores may outpace formal radiology verification without a priority agent.',
    probability: 68,
    suggestedAction: 'Coming soon: radiology worklist escalation.',
    confidence: 72,
    forecastDays: 1,
    status: 'Open',
  },
  {
    id: 'PREV-API-004',
    title: 'False-positive governance on latest model run',
    impact: 'Medium',
    predictedOutcome: 'Unreviewed false positives can erode trust if agents auto-escalate.',
    probability: 55,
    suggestedAction: 'Coming soon: FP QA review agent.',
    confidence: 70,
    forecastDays: 7,
    status: 'Actioned',
  },
];
