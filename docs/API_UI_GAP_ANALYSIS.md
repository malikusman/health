# API ↔ UI Gap Analysis (Option 2 + remaining endpoints)

Branch: `feature/api-integration`. Clinical ops pages stay on mock data except where noted.

## Product domains (intentionally separate)

Clinical Operations mock data (John Smith, MRN, encounter risk 82%, CXR, labs, interventions) and Medical Intelligence API responses (`display_id`, `tb_probability`, CT studies, partitions) are **not interchangeable**. They share one Scorpius Health shell with section labels **Clinical Operations** and **Medical Intelligence**, but different data shapes. Do not map clinical risk scores onto research TB probabilities.

Display helpers: `formatClassLabel` / `formatPartitionLabel` in `src/lib/format.ts` map API enums (`non_tb` → Non-TB, `val` → Validation, etc.).

## All Phase 1 endpoints — UI wired

| Endpoint | UI surface |
|----------|------------|
| `GET /health` | App footer `ApiHealthStatus` |
| `GET /dashboard/summary` | Patients stats, Research defaults, **Dashboard cohort strip + model metrics** |
| `GET /patients` | Patients list |
| `GET /patients/{id}` | Patient Case, Imaging |
| `GET /patients/{id}/predictions` | Patient Case prediction history |
| `GET /studies/{id}` | Imaging |
| `GET /studies/{id}/images` | Imaging slice strip |
| `GET /images/{id}/thumbnail` | Imaging (via URL) |
| `GET /images/{id}/render` | Imaging main viewer |
| `GET /models` | Research picker, Administration Models tab |
| `GET /models/{id}` | Research detail, Admin expand |
| `GET /model-runs` | Research run picker |
| `GET /model-runs/{id}` | Research metrics / confusion matrix |
| `GET /predictions` | Research predictions table, **Dashboard priority queue** |
| `GET /predictions/{id}` | Prediction Detail page |
| `GET /datasets` | Research pie + links |
| `GET /datasets/{id}` | Dataset Detail page |

## Remain mock (no API)

Dashboard clinical encounter cards (John Smith status, CXR assist, labs, prevention, care, recommendations), Labs, Risk Engine, Intervention, Prevention, Care, Reports, Audit, Admin tabs other than Models.

## Field rules

- `tb_probability` → % labeled **TB probability (research)**
- Null → “unavailable”
- Heatmap controls hidden while `heatmap_available` is false
- Class / partition strings → human labels via shared formatters (never raw `non_tb` in UI)

## Env / CORS

Docker/nginx proxies `/api/` so `http://localhost` avoids CORS. See README.

See also: [API_RESPONSE_CATALOG.md](./API_RESPONSE_CATALOG.md)
