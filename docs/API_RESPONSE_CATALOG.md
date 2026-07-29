# Medical Intelligence API — Response Catalog

Live probe of Phase 1 API responses for frontend integration planning.

| | |
|---|---|
| **Probed** | 2026-07-29 |
| **Base URL** | `https://health-api.dev-scorpiusnetworks.com` |
| **API prefix** | `/api/v1` |
| **Swagger UI** | https://health-api.dev-scorpiusnetworks.com/docs |
| **OpenAPI** | https://health-api.dev-scorpiusnetworks.com/openapi.json |
| **Access** | Read-only; no authentication currently enabled |
| **Formats** | JSON for data endpoints; browser-renderable PNG for thumbnail/render |

Treat Swagger/OpenAPI as the authoritative contract for exact parameter names and schemas. Samples below were captured from live requests.

---

## 1. Data coverage (at probe time)

| Resource | Count / identity |
|---|---|
| Patients | 422 anonymized (140 TB, 282 non-TB) |
| Studies | 500 CT studies (0 X-ray in current inventory) |
| Images | 79,377 browser-accessible image records |
| Datasets | 2 (`tb-internal-ct`, `external-normal-ct`) |
| Predictions | 417 patient-level prediction records |
| Primary model | `tb-resnet18` (TB CT ResNet-18) |
| Primary model run | `tb-resnet18-run-20260725` |
| Evaluation cohort | 84-patient leakage-free holdout (`test`) |

---

## 2. Endpoint index

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/health` | API availability |
| GET | `/api/v1/dashboard/summary` | Counts + latest model-run metrics |
| GET | `/api/v1/patients` | Paginated patient list |
| GET | `/api/v1/patients/{patient_id}` | Full patient case |
| GET | `/api/v1/patients/{patient_id}/predictions` | Predictions for one patient |
| GET | `/api/v1/studies/{study_id}` | Study metadata |
| GET | `/api/v1/studies/{study_id}/images` | Paginated image refs |
| GET | `/api/v1/images/{image_id}/thumbnail` | Thumbnail PNG |
| GET | `/api/v1/images/{image_id}/render` | Full render PNG |
| GET | `/api/v1/models` | Model inventory |
| GET | `/api/v1/models/{model_id}` | Model detail |
| GET | `/api/v1/model-runs` | Model run list |
| GET | `/api/v1/model-runs/{model_run_id}` | Run metrics + cohorts |
| GET | `/api/v1/predictions` | Paginated predictions |
| GET | `/api/v1/predictions/{prediction_id}` | One prediction |
| GET | `/api/v1/datasets` | Dataset inventory |
| GET | `/api/v1/datasets/{dataset_id}` | Dataset detail |

All identifiers (`patient_id`, `study_id`, `image_id`, `model_id`, `model_run_id`, `prediction_id`, `dataset_id`) are opaque stable strings. Timestamps are ISO 8601 UTC. Probabilities are decimals in `[0.0, 1.0]` — display as percentages if needed, but **do not** label them as clinical confidence scores. Null means unavailable — **do not** substitute `0`.

---

## 3. Health

### `GET /api/v1/health`

**Status:** `200`

```json
{
  "status": "healthy",
  "service": "medical-intelligence-api",
  "version": "1.0.0",
  "timestamp": "2026-07-29T16:36:09.782056Z"
}
```

---

## 4. Dashboard

### `GET /api/v1/dashboard/summary`

**Status:** `200`

Project totals plus latest completed model-run performance (including confidence intervals and confusion matrix).

```json
{
  "patients": {
    "total": 422,
    "tb": 140,
    "non_tb": 282,
    "unknown": 0
  },
  "studies": {
    "total": 500,
    "ct": 500,
    "xray": 0
  },
  "images": {
    "total": 79377
  },
  "datasets": {
    "total": 2
  },
  "models": {
    "total": 1,
    "active": 1
  },
  "model_runs": {
    "total": 1,
    "completed": 1
  },
  "latest_model_run": {
    "model_run_id": "tb-resnet18-run-20260725",
    "model_id": "tb-resnet18",
    "status": "completed",
    "completed_at": "2026-07-25T07:17:43.958162Z",
    "test_patient_count": 84,
    "threshold": 0.02,
    "accuracy": 0.9761904761904762,
    "sensitivity": 1.0,
    "specificity": 0.9649122807017544,
    "roc_auc": 1.0,
    "ppv": 0.9310344827586207,
    "npv": 1.0,
    "accuracy_metric": {
      "value": 0.9761904761904762,
      "ci_lower": 0.9172839887867145,
      "ci_upper": 0.9934462347064822
    },
    "sensitivity_metric": {
      "value": 1.0,
      "ci_lower": 0.8754409628553641,
      "ci_upper": 1.0
    },
    "specificity_metric": {
      "value": 0.9649122807017544,
      "ci_lower": 0.8807899619581051,
      "ci_upper": 0.9903245386467442
    },
    "confusion_matrix": {
      "true_negative": 55,
      "false_positive": 2,
      "false_negative": 0,
      "true_positive": 27
    }
  }
}
```

---

## 5. Patients

### `GET /api/v1/patients`

**Query parameters**

| Param | Notes |
|---|---|
| `page`, `page_size` | Pagination (max page size 100) |
| `search` | Free-text search |
| `dataset_id` | Filter by dataset |
| `ground_truth` | `tb` \| `non_tb` \| `unknown` |
| `modality` | `CT` \| `XRAY` |
| `has_prediction` | boolean |
| `predicted_class` | `tb` \| `non_tb` |
| `prediction_correct` | boolean |
| `partition` | `train` \| `val` \| `test` |
| `sort_by` | `display_id`, `patient_id`, `ground_truth`, `study_count`, `image_count`, `tb_probability` |
| `sort_order` | `asc` \| `desc` |

**Example:** `GET /api/v1/patients?page=1&page_size=2`

**Status:** `200`

```json
{
  "items": [
    {
      "patient_id": "control-ct-0001",
      "display_id": "CONTROL-0001",
      "dataset_id": "external-normal-ct",
      "ground_truth": "non_tb",
      "modalities": ["CT"],
      "study_count": 1,
      "image_count": 43,
      "latest_prediction": {
        "prediction_id": "prediction-tb-resnet18-run-20260725-control-ct-0001",
        "patient_id": "control-ct-0001",
        "model_id": "tb-resnet18",
        "model_run_id": "tb-resnet18-run-20260725",
        "partition": "train",
        "ground_truth": "non_tb",
        "predicted_class": "non_tb",
        "tb_probability": 0.015764636918902397,
        "non_tb_probability": 0.9842353630810976,
        "threshold": 0.02,
        "correct": true
      }
    },
    {
      "patient_id": "control-ct-0002",
      "display_id": "CONTROL-0002",
      "dataset_id": "external-normal-ct",
      "ground_truth": "non_tb",
      "modalities": ["CT"],
      "study_count": 1,
      "image_count": 46,
      "latest_prediction": {
        "prediction_id": "prediction-tb-resnet18-run-20260725-control-ct-0002",
        "patient_id": "control-ct-0002",
        "model_id": "tb-resnet18",
        "model_run_id": "tb-resnet18-run-20260725",
        "partition": "train",
        "ground_truth": "non_tb",
        "predicted_class": "non_tb",
        "tb_probability": 0.002723503392189741,
        "non_tb_probability": 0.9972764966078103,
        "threshold": 0.02,
        "correct": true
      }
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 2,
    "total_items": 422,
    "total_pages": 211
  }
}
```

**Filtered example:** `GET /api/v1/patients?page=1&page_size=1&ground_truth=tb&partition=test` → `total_items: 27` (test TB cohort).

---

### `GET /api/v1/patients/{patient_id}`

**Example:** `GET /api/v1/patients/tb-ct-0004`

**Status:** `200`

```json
{
  "patient_id": "tb-ct-0004",
  "display_id": "TB-07",
  "dataset_id": "tb-internal-ct",
  "ground_truth": "tb",
  "modalities": ["CT"],
  "timepoints": ["F0"],
  "study_count": 1,
  "image_count": 375,
  "studies": [
    {
      "study_id": "tb-ct-0004-f0",
      "modality": "CT",
      "timepoint": "F0",
      "description": "Baseline chest CT",
      "image_count": 375
    }
  ],
  "predictions": [
    {
      "prediction_id": "prediction-tb-resnet18-run-20260725-tb-ct-0004",
      "patient_id": "tb-ct-0004",
      "model_id": "tb-resnet18",
      "model_run_id": "tb-resnet18-run-20260725",
      "partition": "test",
      "ground_truth": "tb",
      "predicted_class": "tb",
      "tb_probability": 0.9997953772544861,
      "non_tb_probability": 0.00020462274551391602,
      "threshold": 0.02,
      "correct": true
    }
  ]
}
```

**Not found (`404`):**

```json
{
  "code": "PATIENT_NOT_FOUND",
  "message": "The requested patient was not found.",
  "details": {
    "patient_id": "does-not-exist"
  }
}
```

---

### `GET /api/v1/patients/{patient_id}/predictions`

**Example:** `GET /api/v1/patients/tb-ct-0004/predictions`

**Status:** `200` — bare array (not wrapped in `{ items, pagination }`)

```json
[
  {
    "prediction_id": "prediction-tb-resnet18-run-20260725-tb-ct-0004",
    "patient_id": "tb-ct-0004",
    "model_id": "tb-resnet18",
    "model_run_id": "tb-resnet18-run-20260725",
    "partition": "test",
    "ground_truth": "tb",
    "predicted_class": "tb",
    "tb_probability": 0.9997953772544861,
    "non_tb_probability": 0.00020462274551391602,
    "threshold": 0.02,
    "correct": true
  }
]
```

---

## 6. Studies and images

### `GET /api/v1/studies/{study_id}`

**Example:** `GET /api/v1/studies/tb-ct-0004-f0`

**Status:** `200`

```json
{
  "study_id": "tb-ct-0004-f0",
  "patient_id": "tb-ct-0004",
  "modality": "CT",
  "timepoint": "F0",
  "description": "Baseline chest CT",
  "image_count": 334,
  "images_url": "/api/v1/studies/tb-ct-0004-f0/images",
  "available_predictions": [
    {
      "prediction_id": "prediction-tb-resnet18-run-20260725-tb-ct-0004",
      "model_id": "tb-resnet18",
      "model_run_id": "tb-resnet18-run-20260725",
      "heatmap_available": false
    }
  ]
}
```

**Note:** Patient detail reported `image_count: 375` for the same study summary; study detail returned `image_count: 334` with paginated images totaling 334. Prefer study/images pagination totals when building the viewer.

---

### `GET /api/v1/studies/{study_id}/images`

**Query:** `page`, `page_size` (max 100)

**Example:** `GET /api/v1/studies/tb-ct-0004-f0/images?page=1&page_size=2`

**Status:** `200`

```json
{
  "study_id": "tb-ct-0004-f0",
  "modality": "CT",
  "items": [
    {
      "image_id": "tb-ct-0004-f0-image-00000",
      "index": 0,
      "instance_number": 78,
      "thumbnail_url": "/api/v1/images/tb-ct-0004-f0-image-00000/thumbnail",
      "render_url": "/api/v1/images/tb-ct-0004-f0-image-00000/render"
    },
    {
      "image_id": "tb-ct-0004-f0-image-00001",
      "index": 1,
      "instance_number": 232,
      "thumbnail_url": "/api/v1/images/tb-ct-0004-f0-image-00001/thumbnail",
      "render_url": "/api/v1/images/tb-ct-0004-f0-image-00001/render"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 2,
    "total_items": 334,
    "total_pages": 167
  }
}
```

**URL handling:** `thumbnail_url` and `render_url` are API-relative. Prepend the API host:

`https://health-api.dev-scorpiusnetworks.com` + `/api/v1/images/.../thumbnail`

Load CT slices on demand; do not download the entire study at once.

---

### `GET /api/v1/images/{image_id}/thumbnail`

**Example:** `GET /api/v1/images/tb-ct-0004-f0-image-00000/thumbnail`

| | |
|---|---|
| **Status** | `200` |
| **Content-Type** | `image/png` |
| **Observed size** | ~19 KB |
| **Dimensions** | 192 × 192, 8-bit grayscale |

`HEAD` returns `405 Method Not Allowed` (`Allow: GET`). Use `GET` only.

---

### `GET /api/v1/images/{image_id}/render`

**Query parameters**

| Param | Notes |
|---|---|
| `window_center` | optional number |
| `window_width` | optional number (> 0) |
| `size` | optional integer; supported range 64–2048 |

**Default render** (`GET .../render`)

| | |
|---|---|
| **Status** | `200` |
| **Content-Type** | `image/png` |
| **Observed size** | ~165 KB |
| **Dimensions** | 512 × 512, 8-bit grayscale |

**With windowing** (`...?window_center=40&window_width=400&size=256`)

| | |
|---|---|
| **Status** | `200` |
| **Content-Type** | `image/png` |
| **Observed size** | ~30 KB |
| **Dimensions** | 256 × 256, 8-bit grayscale |

---

### Heatmaps

Public Grad-CAM / overlay endpoints are deferred. Study predictions currently report `heatmap_available: false`. Frontend must hide or disable heatmap controls when this flag is false.

---

## 7. Models

### `GET /api/v1/models`

**Status:** `200`

```json
{
  "items": [
    {
      "model_id": "tb-resnet18",
      "name": "TB CT ResNet-18",
      "version": "2026-07-25",
      "task": "TB versus non-TB classification",
      "modality": "CT",
      "architecture": "ResNet-18",
      "status": "evaluated",
      "latest_run_id": "tb-resnet18-run-20260725"
    }
  ]
}
```

---

### `GET /api/v1/models/{model_id}`

**Example:** `GET /api/v1/models/tb-resnet18`

**Status:** `200`

```json
{
  "model_id": "tb-resnet18",
  "name": "TB CT ResNet-18",
  "version": "2026-07-25",
  "task": "TB versus non-TB classification",
  "modality": "CT",
  "architecture": "ResNet-18",
  "status": "evaluated",
  "latest_run_id": "tb-resnet18-run-20260725",
  "description": "CT classification model trained to distinguish tuberculosis from non-TB controls.",
  "input_method": "Three adjacent axial CT slices stacked as three input channels",
  "output_classes": ["non_tb", "tb"],
  "weight_file_size_bytes": 44787467,
  "updated_at": "2026-07-25T06:54:23.364929Z"
}
```

---

## 8. Model runs

### `GET /api/v1/model-runs`

**Status:** `200`

```json
{
  "items": [
    {
      "model_run_id": "tb-resnet18-run-20260725",
      "model_id": "tb-resnet18",
      "status": "completed",
      "evaluation_level": "patient",
      "test_patient_count": 84,
      "accuracy": 0.9761904761904762,
      "sensitivity": 1.0,
      "specificity": 0.9649122807017544,
      "roc_auc": 1.0,
      "completed_at": "2026-07-25T07:17:43.958162Z"
    }
  ]
}
```

---

### `GET /api/v1/model-runs/{model_run_id}`

**Example:** `GET /api/v1/model-runs/tb-resnet18-run-20260725`

**Status:** `200`

```json
{
  "model_run_id": "tb-resnet18-run-20260725",
  "model_id": "tb-resnet18",
  "status": "completed",
  "evaluation_level": "patient",
  "test_patient_count": 84,
  "accuracy": 0.9761904761904762,
  "sensitivity": 1.0,
  "specificity": 0.9649122807017544,
  "roc_auc": 1.0,
  "completed_at": "2026-07-25T07:17:43.958162Z",
  "threshold": 0.02,
  "threshold_selection": "Selected on the validation cohort and applied unchanged to the test cohort",
  "accuracy_metric": {
    "value": 0.9761904761904762,
    "ci_lower": 0.9172839887867145,
    "ci_upper": 0.9934462347064822
  },
  "sensitivity_metric": {
    "value": 1.0,
    "ci_lower": 0.8754409628553641,
    "ci_upper": 1.0
  },
  "specificity_metric": {
    "value": 0.9649122807017544,
    "ci_lower": 0.8807899619581051,
    "ci_upper": 0.9903245386467442
  },
  "ppv": 0.9310344827586207,
  "npv": 1.0,
  "confusion_matrix": {
    "true_negative": 55,
    "false_positive": 2,
    "false_negative": 0,
    "true_positive": 27
  },
  "train_cohort": {
    "tb": 88,
    "non_tb": 183,
    "total": 271
  },
  "validation_cohort": {
    "tb": 20,
    "non_tb": 42,
    "total": 62
  },
  "test_cohort": {
    "tb": 27,
    "non_tb": 57,
    "total": 84
  },
  "cross_split_patient_overlap": 0,
  "split_method": "Patient-grouped split with one canonical control volume per unique patient",
  "notes": [
    "The model was retrained after duplicate control-patient leakage was identified.",
    "The test cohort was held out at the patient level with no patient overlap.",
    "Results represent internal retrospective evaluation, not independent clinical validation."
  ]
}
```

---

## 9. Predictions

### `GET /api/v1/predictions`

**Query parameters**

| Param | Notes |
|---|---|
| `page`, `page_size` | Pagination |
| `patient_id` | Filter |
| `model_run_id` | Filter |
| `predicted_class` | `tb` \| `non_tb` |
| `ground_truth` | `tb` \| `non_tb` |
| `correct` | boolean |
| `partition` | `train` \| `val` \| `test` |
| `sort_by` | `patient_id`, `tb_probability`, `non_tb_probability`, `partition`, `ground_truth`, `predicted_class`, `correct` |
| `sort_order` | `asc` \| `desc` |

**Example:** `GET /api/v1/predictions?page=1&page_size=2`

**Status:** `200` — `total_items: 417`

```json
{
  "items": [
    {
      "prediction_id": "prediction-tb-resnet18-run-20260725-control-ct-0001",
      "patient_id": "control-ct-0001",
      "model_id": "tb-resnet18",
      "model_run_id": "tb-resnet18-run-20260725",
      "partition": "train",
      "ground_truth": "non_tb",
      "predicted_class": "non_tb",
      "tb_probability": 0.015764636918902397,
      "non_tb_probability": 0.9842353630810976,
      "threshold": 0.02,
      "correct": true
    },
    {
      "prediction_id": "prediction-tb-resnet18-run-20260725-control-ct-0002",
      "patient_id": "control-ct-0002",
      "model_id": "tb-resnet18",
      "model_run_id": "tb-resnet18-run-20260725",
      "partition": "train",
      "ground_truth": "non_tb",
      "predicted_class": "non_tb",
      "tb_probability": 0.002723503392189741,
      "non_tb_probability": 0.9972764966078103,
      "threshold": 0.02,
      "correct": true
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 2,
    "total_items": 417,
    "total_pages": 209
  }
}
```

---

### `GET /api/v1/predictions/{prediction_id}`

**Example:** `GET /api/v1/predictions/prediction-tb-resnet18-run-20260725-tb-ct-0004`

**Status:** `200`

```json
{
  "prediction_id": "prediction-tb-resnet18-run-20260725-tb-ct-0004",
  "patient_id": "tb-ct-0004",
  "model_id": "tb-resnet18",
  "model_run_id": "tb-resnet18-run-20260725",
  "partition": "test",
  "ground_truth": "tb",
  "predicted_class": "tb",
  "tb_probability": 0.9997953772544861,
  "non_tb_probability": 0.00020462274551391602,
  "threshold": 0.02,
  "correct": true
}
```

---

## 10. Datasets

### `GET /api/v1/datasets`

**Status:** `200`

```json
{
  "items": [
    {
      "dataset_id": "tb-internal-ct",
      "name": "TB Internal CT",
      "modality": "CT",
      "patient_count": 140,
      "image_count": 61455,
      "primary_class": "tb"
    },
    {
      "dataset_id": "external-normal-ct",
      "name": "External Normal CT Controls",
      "modality": "CT",
      "patient_count": 282,
      "image_count": 17922,
      "primary_class": "non_tb"
    }
  ]
}
```

---

### `GET /api/v1/datasets/{dataset_id}`

**TB dataset** — `GET /api/v1/datasets/tb-internal-ct`

```json
{
  "dataset_id": "tb-internal-ct",
  "name": "TB Internal CT",
  "description": "Anonymized baseline TB CT scans",
  "modality": "CT",
  "patient_count": 140,
  "image_count": 61455,
  "class_distribution": {
    "tb": 140,
    "non_tb": 0,
    "unknown": 0
  },
  "available_timepoints": ["F0"]
}
```

**Control dataset** — `GET /api/v1/datasets/external-normal-ct`

```json
{
  "dataset_id": "external-normal-ct",
  "name": "External Normal CT Controls",
  "description": "Anonymized normal CT scans used as external non-TB controls",
  "modality": "CT",
  "patient_count": 282,
  "image_count": 17922,
  "class_distribution": {
    "tb": 0,
    "non_tb": 282,
    "unknown": 0
  },
  "available_timepoints": []
}
```

---

## 11. Error handling (observed + guide)

| HTTP | Meaning | Frontend behavior |
|---|---|---|
| 200 | Success | Render JSON or image |
| 400 | Invalid request | Concise validation message; keep filters |
| 404 | Not found | Not-found state + navigate back (e.g. `PATIENT_NOT_FOUND`) |
| 405 | Method not allowed | Observed on `HEAD` for image endpoints — use `GET` |
| 422 | Schema/param validation | FastAPI `detail` structure; highlight invalid field |
| 500 | Server error | Generic retry message |
| 503 | Unavailable | Temporary outage + retry |

Do not assume a custom error envelope for all failures until it appears in OpenAPI. Handle standard HTTP failures defensively.

---

## 12. Frontend configuration notes

| Topic | Guidance |
|---|---|
| Base URL env | `HEALTH_API_BASE_URL=https://health-api.dev-scorpiusnetworks.com` (do not hard-code throughout the app) |
| CORS | Deployed UI origin must be added to backend `MEDICAL_API_CORS_ORIGINS` |
| Auth | None today — do not design as if anonymous access is permanent |
| Nulls | Render as “unavailable”; never show `0` for missing values |
| Probabilities | `0.0`–`1.0`; may display as %; not clinical confidence scores |
| Safety | Research/demo only; predictions are research outputs, not diagnoses |
| Heatmaps | Hide/disable when `heatmap_available` is `false` |
| Read-only | No upload, edit, or training APIs |

---

## 13. Recommended UI workflow (from API guide)

1. **Dashboard** → `GET /dashboard/summary`
2. **Patient list** → `GET /patients` (pagination, search, filters, sort)
3. **Patient detail** → `GET /patients/{patient_id}` (studies + prediction IDs)
4. **Image viewer** → `GET /studies/{study_id}` then `GET /studies/{study_id}/images`; use `thumbnail_url` / `render_url`
5. **Prediction detail** → `GET /predictions/{prediction_id}` (or list by patient / model run)
6. **Analytics** → `GET /model-runs/{model_run_id}` (metrics, threshold, CIs, confusion matrix)

---

## 14. Reference links

- Swagger: https://health-api.dev-scorpiusnetworks.com/docs
- OpenAPI: https://health-api.dev-scorpiusnetworks.com/openapi.json
- Health: https://health-api.dev-scorpiusnetworks.com/api/v1/health
