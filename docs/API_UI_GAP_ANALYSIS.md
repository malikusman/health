# API ↔ UI Gap Analysis (Option 2: Wire Overlaps Only)

Branch strategy: `feature/api-integration`. Clinical ops pages stay on mock data.

## Wired to API

| Page | Endpoints | Notes |
|------|-----------|-------|
| Patients | `GET /dashboard/summary`, `GET /patients` | Pagination + research filters |
| Patient Case | `GET /patients/{id}` | Studies + predictions; link to Imaging |
| Imaging | `GET /patients/{id}`, `GET /studies/{id}`, `GET /studies/{id}/images`, thumbnail/render | Real CT; heatmap disabled |
| Research Mode | `GET /model-runs/{id}`, `GET /dashboard/summary`, `GET /datasets`, `GET /predictions` | Live metrics; no fake calibration |

## Remain mock

Dashboard (clinical John Smith), Labs, Risk Engine, Intervention, Prevention, Care Coordination, Reports, Audit, Administration.

## Field rules

- `tb_probability` → display as % labeled **TB probability (research)** — never “clinical confidence”
- Anonymized `display_id` / `patient_id` only (no name/MRN/ward)
- Null → “unavailable” (never substitute `0`)
- `heatmap_available: false` → hide/disable heatmap controls

## Env / CORS

- Frontend: `VITE_HEALTH_API_BASE_URL=https://health-api.dev-scorpiusnetworks.com`
- Backend must allow UI origins in `MEDICAL_API_CORS_ORIGINS` (localhost:5173 and https://health.dev-scorpiusnetworks.com already observed as allowed at probe time)

See also: [API_RESPONSE_CATALOG.md](./API_RESPONSE_CATALOG.md)
