import { apiGet } from './client';
import type {
  DashboardSummary,
  DatasetDetail,
  DatasetListResponse,
  HealthResponse,
  ModelDetail,
  ModelListResponse,
  ModelRunDetail,
  ModelRunListResponse,
  PatientDetail,
  PatientListParams,
  PatientListResponse,
  Prediction,
  PredictionListParams,
  PredictionListResponse,
  StudyDetail,
  StudyImagesResponse,
} from './types';

const V1 = '/api/v1';

export function getHealth() {
  return apiGet<HealthResponse>(`${V1}/health`);
}

export function getDashboardSummary() {
  return apiGet<DashboardSummary>(`${V1}/dashboard/summary`);
}

export function listPatients(params?: PatientListParams) {
  return apiGet<PatientListResponse>(`${V1}/patients`, params as Record<string, string | number | boolean | undefined>);
}

export function getPatient(patientId: string) {
  return apiGet<PatientDetail>(`${V1}/patients/${encodeURIComponent(patientId)}`);
}

export function getPatientPredictions(patientId: string) {
  return apiGet<Prediction[]>(`${V1}/patients/${encodeURIComponent(patientId)}/predictions`);
}

export function getStudy(studyId: string) {
  return apiGet<StudyDetail>(`${V1}/studies/${encodeURIComponent(studyId)}`);
}

export function getStudyImages(studyId: string, page = 1, pageSize = 24) {
  return apiGet<StudyImagesResponse>(`${V1}/studies/${encodeURIComponent(studyId)}/images`, {
    page,
    page_size: pageSize,
  });
}

export function listModels() {
  return apiGet<ModelListResponse>(`${V1}/models`);
}

export function getModel(modelId: string) {
  return apiGet<ModelDetail>(`${V1}/models/${encodeURIComponent(modelId)}`);
}

export function listModelRuns() {
  return apiGet<ModelRunListResponse>(`${V1}/model-runs`);
}

export function getModelRun(modelRunId: string) {
  return apiGet<ModelRunDetail>(`${V1}/model-runs/${encodeURIComponent(modelRunId)}`);
}

export function listPredictions(params?: PredictionListParams) {
  return apiGet<PredictionListResponse>(`${V1}/predictions`, params as Record<string, string | number | boolean | undefined>);
}

export function getPrediction(predictionId: string) {
  return apiGet<Prediction>(`${V1}/predictions/${encodeURIComponent(predictionId)}`);
}

export function listDatasets() {
  return apiGet<DatasetListResponse>(`${V1}/datasets`);
}

export function getDataset(datasetId: string) {
  return apiGet<DatasetDetail>(`${V1}/datasets/${encodeURIComponent(datasetId)}`);
}
