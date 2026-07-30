// ─── Medical Intelligence API labels ─────────────────────────────────────────

/** Map API class values (tb / non_tb / unknown) to display labels. */
export function formatClassLabel(value: string | null | undefined): string {
  if (value == null || value === '') return 'unavailable';
  const key = value.toLowerCase();
  if (key === 'tb') return 'TB';
  if (key === 'non_tb') return 'Non-TB';
  if (key === 'unknown') return 'Unknown';
  return titleCaseApiToken(value);
}

/** Map API partition values (train / val / test) to display labels. */
export function formatPartitionLabel(value: string | null | undefined): string {
  if (value == null || value === '') return 'unavailable';
  const key = value.toLowerCase();
  if (key === 'train') return 'Train';
  if (key === 'val') return 'Validation';
  if (key === 'test') return 'Test';
  return titleCaseApiToken(value);
}

function titleCaseApiToken(value: string): string {
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

// ─── Risk Formatting ──────────────────────────────────────────────────────────

export function formatRisk(score: number): string {
  if (score >= 80) return 'Critical';
  if (score >= 60) return 'High';
  if (score >= 35) return 'Medium';
  return 'Low';
}

export function riskColor(score: number): string {
  if (score >= 80) return '#DC2626'; // red-600
  if (score >= 60) return '#D97706'; // amber-600
  if (score >= 35) return '#2563EB'; // blue-600
  return '#16A34A';                  // green-600
}

// ─── Flag / Status / Impact Colors ───────────────────────────────────────────

export function flagColor(flag: string): string {
  switch (flag) {
    case 'Critical':  return '#DC2626';
    case 'Abnormal':  return '#D97706';
    case 'Normal':    return '#16A34A';
    case 'Pending':   return '#6B7280';
    default:          return '#6B7280';
  }
}

export function statusColor(status: string): string {
  switch (status) {
    case 'Generated':          return '#2563EB';
    case 'Queued':             return '#7C3AED';
    case 'Pending':            return '#D97706';
    case 'Triggered':          return '#DC2626';
    case 'Completed':          return '#16A34A';
    case 'Awaiting Approval':  return '#EA580C';
    case 'Active':             return '#2563EB';
    case 'Discharged':         return '#16A34A';
    case 'Transferred':        return '#7C3AED';
    case 'Open':               return '#D97706';
    case 'Actioned':           return '#16A34A';
    case 'Dismissed':          return '#6B7280';
    default:                   return '#6B7280';
  }
}

export function impactColor(impact: string): string {
  switch (impact) {
    case 'High':    return '#DC2626';
    case 'Medium':  return '#D97706';
    case 'Low':     return '#16A34A';
    default:        return '#6B7280';
  }
}

// ─── Risk Engine ──────────────────────────────────────────────────────────────

interface RecomputeInputs {
  imaging?: number;        // 0–1 probability from imaging AI
  ip10?: number;           // raw IP-10 value in pg/mL
  symptoms?: number;       // 0–1 symptom cluster severity
  cbc?: number;            // 0–1 CBC abnormality score
  esrCrp?: number;         // 0–1 ESR/CRP elevation score
  history?: boolean;       // true = prior TB history (reduces score)
  smearPositive?: boolean; // confirmed smear positive
  culturePositive?: boolean; // confirmed culture positive
}

export function recomputeRisk(inputs: RecomputeInputs): number {
  let score = 30; // base

  // Imaging: contributes up to 28 points
  if (inputs.imaging !== undefined) {
    score += Math.round(inputs.imaging * 28);
  }

  // IP-10: contributes up to 14 points (>1000 pg/mL = max)
  if (inputs.ip10 !== undefined) {
    const normalised = Math.min(inputs.ip10 / 1000, 1);
    score += Math.round(normalised * 14);
  }

  // Symptoms: contributes up to 12 points
  if (inputs.symptoms !== undefined) {
    score += Math.round(inputs.symptoms * 12);
  }

  // CBC: contributes up to 9 points
  if (inputs.cbc !== undefined) {
    score += Math.round(inputs.cbc * 9);
  }

  // ESR/CRP: contributes up to 7 points
  if (inputs.esrCrp !== undefined) {
    score += Math.round(inputs.esrCrp * 7);
  }

  // Prior TB history reduces by up to 5 points
  if (inputs.history === true) {
    score -= 5;
  }

  // Smear positive: adds 10 points
  if (inputs.smearPositive === true) {
    score += 10;
  }

  // Culture positive: adds 12 points
  if (inputs.culturePositive === true) {
    score += 12;
  }

  // Clamp to 0–100
  return Math.max(0, Math.min(100, score));
}
