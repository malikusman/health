import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Plus, X } from 'lucide-react';
import { reports as initialReports } from '../data/reports';
import type { Report } from '../lib/types';
import PageContainer from '../layout/PageContainer';
import { Card, StatusPill, Tag, SectionTitle } from '../components';

// ─── Report icon colours by type ─────────────────────────────────────────────

const TYPE_COLOR: Record<string, string> = {
  'Encounter Summary':  '#3B82F6',
  'Risk Assessment':    '#F0476A',
  'Imaging Report':     '#6B8AFE',
  'Intervention Audit': '#F4A638',
  'Prevention Impact':  '#36C28B',
  'Lab Panel Summary':  '#F2C94C',
};

// ─── Modal content by report type ────────────────────────────────────────────

const MODAL_SECTIONS: Record<string, { heading: string; body: string }[]> = {
  'Encounter Summary': [
    {
      heading: 'Clinical Presentation',
      body: 'Patient John Smith, a 34-year-old male, presented to Respiratory Ward B on 06 May 2026 with a 3-week history of productive cough, night sweats, and unintentional weight loss of 4 kg. Fever documented at 38.4°C on admission. No known prior TB diagnosis. BCG vaccination status unknown.',
    },
    {
      heading: 'Diagnostic Findings',
      body: 'Scorpius AI stratified the encounter as Critical tier (risk score 82/100) based on symptom cluster analysis, CXR findings, and biomarker results. Chest radiograph PA view demonstrated right upper lobe opacity consistent with active pulmonary infection. IP-10 at 856 pg/mL and IFN-γ at 4.2 IU/mL returned critical flags. WBC 11.8 × 10⁹/L; CRP 42 mg/L; ESR 68 mm/hr.',
    },
    {
      heading: 'Management Plan',
      body: 'Sputum AFB smear STAT ordered and transmitted to the laboratory (ENC-789102). Pulmonology and Infectious Disease consults initiated pending clinician approval. Respiratory precautions activated per ward protocol. Airborne infection isolation under review by Infection Control team. CT chest to be scheduled contingent on smear result. Patient and next of kin informed of precautionary measures. All actions documented in the tamper-evident audit trail.',
    },
  ],
  'Risk Assessment': [
    {
      heading: 'Risk Score Summary',
      body: 'Patient PAT-001 received an initial risk stratification score of 58 (Medium tier) at encounter creation on 06 May 2026, 06:00 AM. The score escalated progressively as additional clinical data was ingested: imaging classification raised the score to 70 (High), and critical biomarker results (IP-10, IFN-γ) triggered a final score of 82, breaching the Critical tier threshold.',
    },
    {
      heading: 'Feature Contribution',
      body: 'The primary contributors to the final risk score were: symptom cluster concordance (TB-consistent pattern, weight 0.28), IP-10 serum level (critical elevation, weight 0.22), CXR AI classification probability 82% (weight 0.19), IFN-γ positive (weight 0.14), and ESR/CRP inflammatory markers (weight 0.10). Combined AUROC for this encounter type: 0.943 (v1.3 model).',
    },
    {
      heading: 'Confidence & Calibration',
      body: 'Model confidence at final scoring: 91%. The risk engine v1.3 ensemble model is calibrated against a de-identified cohort of 847 cases. Sensitivity 89.1%, Specificity 91.2%. This report is generated for clinician review and does not constitute a standalone diagnostic finding. All autonomous actions taken by the system have been logged and are available in the Audit Logs module.',
    },
  ],
  'Imaging Report': [
    {
      heading: 'Study Details',
      body: 'Imaging study IMG-001: Chest Radiograph PA view, acquired 06 May 2026. Image routed to the Scorpius Imaging AI v2.1 pipeline via PACS integration (Agfa IMPAX). AI classification completed within 3 minutes of image receipt.',
    },
    {
      heading: 'AI Classification Findings',
      body: 'AI classification result: SUSPICIOUS — probability 82%, confidence HIGH. Key findings flagged: (1) Right upper lobe opacity, ~3.2 cm, ill-defined margins; (2) Subtle volume loss right upper zone; (3) No pleural effusion identified; (4) Cardiac silhouette within normal limits; (5) Left lung field unremarkable. Differential priority: active pulmonary TB. Secondary differentials: bacterial pneumonia, fungal infection.',
    },
    {
      heading: 'Radiologist Review Status',
      body: 'Formal radiologist report pending — Dr. Raj Patel (Radiology) assigned for verification. Estimated report completion: 11:30 AM. The AI classification has been shared with the clinical team for situational awareness only and does not replace a formal radiology report. Risk engine has been updated with the AI probability to inform ongoing risk stratification.',
    },
  ],
  'Intervention Audit': [
    {
      heading: 'Autonomous Actions Summary',
      body: 'On 06 May 2026, the Scorpius Care Coordination Agent executed 4 autonomous interventions for patient PAT-001 (ENC-789102). INT-001: Sputum AFB smear order transmitted directly to Lab System at confidence 94% — within auto-execute threshold. INT-002: Pulmonology consult request drafted and queued — awaiting clinician approval (below approval threshold). INT-003: Infectious Disease consult flag raised — pending acknowledgement. INT-004: Isolation protocol review triggered — Infection Control team notified.',
    },
    {
      heading: 'Human-in-Loop Status',
      body: 'Actions requiring human approval: INT-002 (consult request, confidence 89% — below 95% threshold), INT-003 (consult flag, confidence 82%). Actions executed autonomously within policy: INT-001 (lab order, confidence 94% — within diagnostic order threshold of 85%). Nursing alert dispatched autonomously (confidence 95%, threshold 95% — boundary case, logged for review).',
    },
    {
      heading: 'Audit Trail Reference',
      body: 'All interventions are recorded in the tamper-evident audit log. Audit entries AUD-0014 through AUD-0021 cover the full intervention pipeline for this encounter. Session references: AGT-SESSION-4420, AGT-SESSION-4421. Originating IP: 10.0.1.45. All actions comply with the configured Guardrails policy as of 01 Jan 2026.',
    },
  ],
  'Prevention Impact': [
    {
      heading: 'Prevention Opportunities Identified',
      body: 'Scorpius Prevention Model v1.1 identified 3 prevention opportunities for patient PAT-001 based on clinical trajectory. (1) Early isolation to prevent ward transmission — High impact, probability 78%, action: airborne precautions within 2 hours of Critical tier classification. (2) Nutritional support initiation — Medium impact, probability 62%, action: dietitian referral within 24 hours. (3) Contact tracing coordination — High impact, probability 71%, action: public health notification if TB confirmed.',
    },
    {
      heading: 'Predicted Outcomes',
      body: 'Model forecast over 30-day horizon: early isolation reduces estimated secondary transmission risk by 84% (CI 76–91%). Nutritional supplementation predicted to shorten inpatient stay by 1.8 days (CI 0.9–2.7). Contact tracing flag reduces mean time to index case identification from 14.2 to 3.1 days based on historical cohort data.',
    },
    {
      heading: 'Action Status',
      body: 'Isolation review actioned — Infection Control team engaged (INT-004). Nutritional referral: open, not yet actioned. Contact tracing flag: held pending TB confirmation from sputum smear. All opportunities visible in the Autonomous Prevention module for clinician review and override.',
    },
  ],
  'Lab Panel Summary': [
    {
      heading: 'Panel Results Overview',
      body: 'Full workup results for PAT-001 returned across two laboratory batches on 06 May 2026. Batch 1 (08:40 AM): FBC — WBC 11.8 × 10⁹/L (H), Hb 10.9 g/dL (L), Platelets 412 × 10⁹/L (H). CRP 42 mg/L (H). ESR 68 mm/hr (H). LDH 287 U/L (H). Batch 2 (09:50 AM): IP-10 856 pg/mL (Critical), IFN-γ 4.2 IU/mL (Critical).',
    },
    {
      heading: 'Abnormal Flags',
      body: '7 abnormal flags raised across the full panel. Critical flags: IP-10 (reference <150 pg/mL), IFN-γ (reference <0.35 IU/mL). High flags: WBC, CRP, ESR, LDH, Platelets. Low flags: Haemoglobin. All critical flags automatically ingested by the Risk Engine, triggering score recalculation from 70 to 82 and Critical tier escalation.',
    },
    {
      heading: 'Pending Results',
      body: 'Sputum AFB smear (STAT) — collection in progress, expected turnaround 2 hours from collection time. GeneXpert MTB/RIF — to be ordered contingent on smear positivity or clinical decision. Culture & sensitivity — if smear positive, M. tuberculosis culture will be requested (turnaround 4–8 weeks). All pending orders visible in the Labs module.',
    },
  ],
};

function getModalSections(type: string) {
  return MODAL_SECTIONS[type] ?? MODAL_SECTIONS['Encounter Summary'];
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const Reports: React.FC = () => {
  const [reportsList, setReportsList]     = useState<Report[]>(initialReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [toast, setToast]                 = useState<string | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  function handleGenerate() {
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')} ${now.toLocaleString('en-GB', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
    const newReport: Report = {
      id:          `RPT-${String(reportsList.length + 1).padStart(3, '0')}`,
      type:        'Encounter Summary',
      title:       'Encounter Summary — John Smith (ENC-789102)',
      date:        dateStr,
      status:      'Draft',
      generatedBy: 'Scorpius AI',
      size:        '148 KB',
    };
    setReportsList((prev) => [newReport, ...prev]);
    setToast('Report generated successfully');
  }

  const sections = selectedReport ? getModalSections(selectedReport.type) : [];

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <SectionTitle
          title="Reports"
          icon={<FileText size={22} />}
        />
        <button
          onClick={handleGenerate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          style={{ backgroundColor: '#3B82F6', color: '#fff' }}
        >
          <Plus size={15} />
          Generate Report
        </button>
      </div>

      {/* Report Grid */}
      <div className="grid grid-cols-3 gap-4">
        {reportsList.map((report) => {
          const color = TYPE_COLOR[report.type] ?? '#5E6E85';
          return (
            <Card key={report.id} className="flex flex-col gap-3">
              {/* Icon + title */}
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}18` }}
                >
                  <FileText size={17} style={{ color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug" style={{ color: '#E8EEF7' }}>
                    {report.title}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: '#5E6E85' }}>
                    {report.type}
                  </p>
                </div>
              </div>

              {/* Meta */}
              <div className="flex flex-col gap-1.5 text-xs" style={{ color: '#93A1B5' }}>
                <div className="flex items-center justify-between">
                  <span>Date</span>
                  <span style={{ color: '#E8EEF7' }}>{report.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <StatusPill status={report.status} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Generated by</span>
                  <span style={{ color: '#E8EEF7' }}>{report.generatedBy}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Size</span>
                  <span style={{ color: '#E8EEF7' }}>{report.size}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1 border-t border-[#1E2A3D]">
                <button
                  onClick={() => setSelectedReport(report)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                  style={{ backgroundColor: '#3B82F618', color: '#3B82F6' }}
                >
                  <Eye size={13} />
                  View Report
                </button>
                <button
                  onClick={() => alert(`Downloading ${report.title}`)}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                  style={{ backgroundColor: '#1E2A3D', color: '#93A1B5' }}
                >
                  <Download size={13} />
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div
            className="max-w-3xl w-full rounded-xl overflow-hidden flex flex-col"
            style={{ backgroundColor: '#E8EEF7', color: '#0B1220', maxHeight: '90vh' }}
          >
            {/* Modal header */}
            <div
              className="flex items-center justify-between px-6 py-4 flex-shrink-0"
              style={{ backgroundColor: '#D4DCE8', borderBottom: '1px solid #B8C4D6' }}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#5E6E85' }}>
                  {selectedReport.type}
                </p>
                <h3 className="text-base font-bold mt-0.5" style={{ color: '#0B1220' }}>
                  {selectedReport.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: '#B8C4D6', color: '#0B1220' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto flex-1 p-10" style={{ fontFamily: 'Georgia, serif' }}>
              {/* Letterhead */}
              <div className="flex items-start justify-between mb-8 pb-6" style={{ borderBottom: '2px solid #B8C4D6' }}>
                <div>
                  <div className="text-xl font-bold tracking-tight" style={{ color: '#0B1220', fontFamily: 'Inter, sans-serif' }}>
                    SCORPIUS HEALTH
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: '#5E6E85', fontFamily: 'Inter, sans-serif' }}>
                    Pilot Environment · UC Davis Health
                  </div>
                </div>
                <div className="text-right text-xs" style={{ color: '#5E6E85', fontFamily: 'Inter, sans-serif', lineHeight: 1.8 }}>
                  <div><strong style={{ color: '#0B1220' }}>Patient:</strong> John Smith</div>
                  <div><strong style={{ color: '#0B1220' }}>MRN:</strong> PAT-001</div>
                  <div><strong style={{ color: '#0B1220' }}>Encounter:</strong> ENC-789102</div>
                  <div><strong style={{ color: '#0B1220' }}>Date:</strong> {selectedReport.date}</div>
                </div>
              </div>

              {/* Report sections */}
              {sections.map((section, i) => (
                <div key={i} className="mb-7">
                  <h4
                    className="text-sm font-bold uppercase tracking-wider mb-3"
                    style={{ color: '#0B1220', fontFamily: 'Inter, sans-serif' }}
                  >
                    {section.heading}
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: '#2A3A50' }}>
                    {section.body}
                  </p>
                </div>
              ))}

              {/* Footer */}
              <div
                className="mt-10 pt-6 text-center text-xs"
                style={{ borderTop: '1px solid #B8C4D6', color: '#93A1B5', fontFamily: 'Inter, sans-serif' }}
              >
                Generated by Scorpius AI · Not for clinical use · Pilot environment
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 px-4 py-3 rounded-lg text-sm font-semibold z-50"
          style={{ backgroundColor: '#36C28B', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}
        >
          {toast}
        </div>
      )}
    </PageContainer>
  );
};

export default Reports;
