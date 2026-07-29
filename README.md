# Scorpius Health — Autonomous Clinical Operations Intelligence

> **Important Notice:** ALL patient data displayed in this application is entirely synthetic and fictional. This platform is not approved for clinical decision-making and must not be used in any real clinical context.

---

## Quick Start

```bash
npm install
cp .env.example .env   # optional — defaults to the public API host
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app locally.

### Medical Intelligence API

Patients, Patient Case, Imaging (CT), and Research Mode load live data from the Phase 1 Medical Intelligence API.

| Variable | Description |
|----------|-------------|
| `VITE_HEALTH_API_BASE_URL` | API origin (no trailing slash). Default: `https://health-api.dev-scorpiusnetworks.com` |

- Swagger: https://health-api.dev-scorpiusnetworks.com/docs
- Response catalog: [`docs/API_RESPONSE_CATALOG.md`](docs/API_RESPONSE_CATALOG.md)
- UI gap analysis: [`docs/API_UI_GAP_ANALYSIS.md`](docs/API_UI_GAP_ANALYSIS.md)

**CORS:** The API must allow the UI origin via `MEDICAL_API_CORS_ORIGINS`. Localhost (`http://localhost:5173`) and production (`https://health.dev-scorpiusnetworks.com`) are expected to be listed. For local same-origin requests, leave `VITE_HEALTH_API_BASE_URL` empty and use the Vite `/api` proxy in [`vite.config.ts`](vite.config.ts).

API-backed pages show research outputs (TB/non-TB probabilities, model metrics). Clinical Dashboard, Labs, Risk Engine, Intervention, Prevention, Care, Reports, Audit, and Administration remain on synthetic mock data.

---

## Docker

```bash
docker compose up --build
```

The app will be available at [http://localhost](http://localhost).

---

## Production

Deployments are fully automated via GitHub Actions. Every push to `main` triggers a build, packages a Docker image, and deploys it to the production server.

**Required secret:** `SSH_PRIVATE_KEY` — a private SSH key with access to `root@137.184.98.83`. Add it under **Settings → Secrets and variables → Actions** in the GitHub repository.

Production URL: [https://health.dev-scorpiusnetworks.com](https://health.dev-scorpiusnetworks.com)

---

## Tech Stack

- **React** — UI framework
- **Vite** — build tooling and dev server
- **TypeScript** — type safety
- **Tailwind CSS** — utility-first styling
- **nginx** — static file serving and SPA routing
- **Docker** — containerised deployment
- **GitHub Actions** — CI/CD pipeline

---

## Environment

| Key | Value |
|-----|-------|
| Production URL | https://health.dev-scorpiusnetworks.com |
| Version | v1.0.0 |
| Stage | Pilot |
| Server IP | 137.184.98.83 |

---

## Important Notice

All patient names, diagnoses, lab values, imaging reports, and clinical records shown in Scorpius Health are **entirely synthetic and fictional**, generated for demonstration purposes only. This software has **not** been validated, approved, or certified for clinical use. It must not be used to inform, guide, or replace any clinical decision-making process.
