import type { PreventionOpportunity } from '../lib/types';
import type { DemoSpine } from '../api/demoSpine';

/** Prevention opportunities aligned to live Medical Intelligence research signals. */
export function buildAlignedPrevention(spine: DemoSpine): PreventionOpportunity[] {
  const { patient, tbProbabilityLabel, summary, modelName, studyId } = spine;
  const display = patient.display_id;
  const fp = summary.latest_model_run?.confusion_matrix.false_positive ?? 2;

  return [
    {
      id: 'PREV-API-001',
      title: 'Specialist review lag on high research TB probability',
      impact: 'High',
      predictedOutcome: `If ${display} (research TB ${tbProbabilityLabel}) waits without specialist attention, confirmatory pathway and isolation decisions may be delayed.`,
      probability: 73,
      suggestedAction:
        'Auto-prioritise in specialist queue and escalate if review not acknowledged within the configured SLA.',
      confidence: 78,
      forecastDays: 5,
      status: 'Open',
    },
    {
      id: 'PREV-API-002',
      title: 'Confirmatory labs pending for research signal',
      impact: 'High',
      predictedOutcome: `${modelName} flagged ${display}. Without confirmatory microbiology, operators may proceed without a closed diagnostic loop.`,
      probability: 90,
      suggestedAction:
        'Propose smear/culture tasks tied to research TB probability and model threshold, with clinician approval.',
      confidence: 90,
      forecastDays: 1,
      status: 'Open',
    },
    {
      id: 'PREV-API-003',
      title: 'CT study awaiting human verification',
      impact: 'Medium',
      predictedOutcome: `Study ${studyId} is viewable in CT Imaging; without radiology priority, formal review may lag AI research scoring.`,
      probability: 68,
      suggestedAction:
        'Escalate to radiology worklist if a research-predicted TB case lacks human verification within the policy window.',
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
        'Flag FP cases from the confusion matrix for QA review before autonomous actions.',
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
      'High research TB probability cases may wait without specialist attention.',
    probability: 73,
    suggestedAction: 'Auto-prioritise specialist queue.',
    confidence: 78,
    forecastDays: 5,
    status: 'Open',
  },
  {
    id: 'PREV-API-002',
    title: 'Confirmatory labs pending for research signal',
    impact: 'High',
    predictedOutcome: 'Research signal without confirmatory microbiology leaves the pathway open.',
    probability: 90,
    suggestedAction: 'Propose smear/culture tasks with clinician approval.',
    confidence: 90,
    forecastDays: 1,
    status: 'Open',
  },
  {
    id: 'PREV-API-003',
    title: 'CT study awaiting human verification',
    impact: 'Medium',
    predictedOutcome: 'Research CT scores may outpace formal radiology verification.',
    probability: 68,
    suggestedAction: 'Escalate to radiology worklist.',
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
    suggestedAction: 'Flag FP cases for QA review.',
    confidence: 70,
    forecastDays: 7,
    status: 'Actioned',
  },
];
