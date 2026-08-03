/** Featured demo spine — live Medical Intelligence API case for demos. */
import { getDashboardSummary, getPatient, getStudyImages, listModels } from './endpoints';
import type { DashboardSummary, ModelListItem, PatientDetail, StudyImagesResponse } from './types';
import { formatProbability } from './client';
import { formatClassLabel } from '../lib/format';

export const FEATURED_PATIENT_ID = 'tb-ct-0139';
export const FEATURED_STUDY_ID = 'tb-ct-0139-f0';

export function featuredCasePath(): string {
  return `/patients/${encodeURIComponent(FEATURED_PATIENT_ID)}`;
}

export function featuredImagingPath(page?: number): string {
  const base = `/imaging?patientId=${encodeURIComponent(FEATURED_PATIENT_ID)}&studyId=${encodeURIComponent(FEATURED_STUDY_ID)}`;
  return page && page > 1 ? `${base}&page=${page}` : base;
}

/** Prefer mid-volume page so demos open near lung parenchyma, not apex slice 0. */
export function midVolumePage(totalItems: number, pageSize: number): number {
  if (!totalItems || !pageSize) return 1;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  return Math.max(1, Math.ceil(totalPages / 2));
}

export interface DemoSpine {
  summary: DashboardSummary;
  patient: PatientDetail;
  modelName: string;
  studyId: string;
  imageCount: number;
  midPage: number;
  preview: StudyImagesResponse | null;
  tbProbabilityLabel: string;
  predictedLabel: string;
  groundTruthLabel: string;
  researchTrigger: string;
}

export async function loadDemoSpine(previewCount = 5): Promise<DemoSpine> {
  const [summary, patient, models] = await Promise.all([
    getDashboardSummary(),
    getPatient(FEATURED_PATIENT_ID),
    listModels().catch(() => ({ items: [] as ModelListItem[] })),
  ]);

  const study = patient.studies.find((s) => s.study_id === FEATURED_STUDY_ID) ?? patient.studies[0];
  const studyId = study?.study_id ?? FEATURED_STUDY_ID;
  const imageCount = study?.image_count ?? patient.image_count;
  const pageSize = Math.max(previewCount, 5);
  const midPage = midVolumePage(imageCount, pageSize);

  let preview: StudyImagesResponse | null = null;
  if (previewCount > 0) {
    try {
      preview = await getStudyImages(studyId, midPage, pageSize);
    } catch {
      preview = null;
    }
  }

  const pred = patient.predictions[0];
  const modelMeta = models.items?.find((m) => m.model_id === (pred?.model_id ?? summary.latest_model_run?.model_id));
  const modelName = modelMeta?.name ?? pred?.model_id ?? summary.latest_model_run?.model_id ?? 'TB model';
  const tbProbabilityLabel = pred ? formatProbability(pred.tb_probability) : 'unavailable';
  const predictedLabel = pred ? formatClassLabel(pred.predicted_class) : 'unavailable';
  const groundTruthLabel = formatClassLabel(patient.ground_truth);
  const thresholdPct = pred ? formatProbability(pred.threshold) : summary.latest_model_run
    ? formatProbability(summary.latest_model_run.threshold)
    : '2.0%';

  const researchTrigger = pred
    ? `${patient.display_id}: research TB probability ${tbProbabilityLabel} (predicted ${predictedLabel}, ground truth ${groundTruthLabel}) exceeds model threshold ${thresholdPct}`
    : `${patient.display_id}: live research case from Medical Intelligence API`;

  return {
    summary,
    patient,
    modelName,
    studyId,
    imageCount,
    midPage,
    preview,
    tbProbabilityLabel,
    predictedLabel,
    groundTruthLabel,
    researchTrigger,
  };
}
