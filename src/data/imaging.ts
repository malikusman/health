import type { ImagingStudy } from '../lib/types';

export const imagingStudies: ImagingStudy[] = [
  {
    id: 'IMG-001',
    modality: 'CXR',
    view: 'PA',
    date: '06 May 2026 10:12 AM',
    aiClassification: 'SUSPICIOUS',
    probability: 82,
    confidence: 'High',
    radiologistStatus: 'Pending Review',
    findings: [
      'Right upper lobe heterogeneous opacity with ill-defined margins, approximately 3.2 × 2.8 cm.',
      'Bilateral hilar fullness suggesting possible lymphadenopathy.',
      'No pleural effusion identified on this projection.',
      'Tracheal midline; cardiac silhouette within normal limits.',
    ],
  },
  {
    id: 'IMG-002',
    modality: 'CXR',
    view: 'Lateral',
    date: '02 Apr 2026',
    aiClassification: 'INDETERMINATE',
    probability: 54,
    confidence: 'Medium',
    radiologistStatus: 'Reported',
    findings: [
      'Subtle posterior segment right upper lobe haziness — non-specific.',
      'No cavitation or pleural abnormality detected on lateral projection.',
      'Retrosternal space clear; no mediastinal widening.',
    ],
  },
  {
    id: 'IMG-003',
    modality: 'CT',
    view: 'Chest (with contrast)',
    date: 'Planned — awaiting approval',
    aiClassification: 'PENDING',
    probability: null,
    confidence: 'N/A',
    radiologistStatus: 'Awaiting',
    findings: [
      'Study not yet performed.',
      'Requested to characterise upper lobe opacity and evaluate mediastinal lymph nodes.',
    ],
  },
];
