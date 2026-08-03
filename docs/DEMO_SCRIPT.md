# Demo script — Medical Research + Agentic AI

Branch: `feature/medical-demo-readiness`

**Positioning (say verbally):** Scorpius is medical research intelligence plus agentic clinical workflows. CT cohort and model scores are live from the Medical Intelligence API. Agentic Intervention / Prevention / Care / Labs / Risk use product UI with research-aligned triggers — explain verbally that EHR/LIS execution is the next integration layer. Do not label screens “mock” or “coming soon” in the UI.

**Featured case:** TB-210 (`tb-ct-0139`) · study `tb-ct-0139-f0` · model TB CT ResNet-18

## Live vs product UI (for the presenter)

| Live API | Product / agentic UI (not API-backed actions) |
|----------|-----------------------------------------------|
| Patients, Case, CT Imaging, Research, Dashboard cohort/metrics | Intervention, Prevention, Care |
| Footer API health | Labs, Risk Engine, Reports, Audit narratives |
| Prediction / Dataset detail | Admin org config (except Models tab) |

## ~20 minute walkthrough

1. **Dashboard** — cohort, featured CT, model metrics, agents strip.
2. **CT Imaging** — scrubber, window presets, shareable slice URL.
3. **Patient Case** — research probs + CT preview.
4. **Research Mode** — ROC / sens / spec / confusion matrix.
5. **Intervention / Prevention** — agents driven by research signals (explain EHR connect verbally).
6. **Close** — API healthy; research outputs ≠ clinical diagnosis.
