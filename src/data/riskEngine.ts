// ─── Model Card ───────────────────────────────────────────────────────────────

export const modelCard = {
  name: 'Scorpius Risk Engine v1.3',
  version: '1.3.0',
  type: 'Gradient Boosted Ensemble (XGBoost + Neural Feature Extractor)',
  trainedOn: 'De-identified respiratory disease cohort — 142,000 encounters, 38 hospitals (UK NHS, 2018–2024)',
  auroc: 0.943,
  sensitivity: 0.891,
  specificity: 0.912,
  ppv: 0.876,
  npv: 0.924,
  f1Score: 0.883,
  calibrationError: 0.024,
  lastUpdated: '15 February 2026',
  nextReview: '15 August 2026',
  regulatoryStatus: 'Pilot research decision support — not a cleared medical device',
  validatedPopulation: 'Adults ≥18 years presenting to secondary care with respiratory symptoms',
  knownLimitations: [
    'Performance may be reduced in immunocompromised patients (HIV, transplant)',
    'Not validated for paediatric populations',
    'Imaging AI module requires DICOM-standard CXR with minimum 2.5 MP resolution',
    'IP-10 biomarker module requires calibrated immunoassay from approved lab network',
  ],
  inputs: [
    'Chest X-ray (DICOM) — AI probability score',
    'IP-10 (CXCL10) plasma concentration (pg/mL)',
    'Symptom cluster score (NLP-derived from clinical notes)',
    'Full blood count — WBC, neutrophil differential',
    'ESR and CRP values',
    'Interferon-gamma (IFN-γ) quantification',
    'Patient age and sex',
    'Smoking status',
    'Prior TB history flag',
    'BMI',
    'Sputum smear result (when available)',
    'Mycobacterial culture result (when available)',
  ],
} as const;

// ─── What-If Analysis Defaults ────────────────────────────────────────────────

export const whatIfDefaults = {
  imagingProbability: 0.82,    // CXR AI probability (0–1)
  ip10Value: 856,              // pg/mL
  symptomSeverity: 0.88,       // 0–1 cluster score
  cbcAbnormality: 0.72,        // 0–1 composite WBC/neutrophil score
  esrCrpElevation: 0.74,       // 0–1 composite ESR/CRP score
  age: 34,
  bmi: 21.3,
  priorTbHistory: false,
  smoker: false,
  smearPositive: false,
  culturePositive: false,
} as const;

export type WhatIfInputs = typeof whatIfDefaults;
