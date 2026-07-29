/** Types matching Medical Intelligence API (Phase 1) responses. */

export interface Pagination {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  timestamp: string;
}

export interface MetricInterval {
  value: number;
  ci_lower: number;
  ci_upper: number;
}

export interface ConfusionMatrix {
  true_negative: number;
  false_positive: number;
  false_negative: number;
  true_positive: number;
}

export interface CohortCounts {
  tb: number;
  non_tb: number;
  total: number;
}

export interface LatestModelRun {
  model_run_id: string;
  model_id: string;
  status: string;
  completed_at: string;
  test_patient_count: number;
  threshold: number;
  accuracy: number;
  sensitivity: number;
  specificity: number;
  roc_auc: number;
  ppv: number;
  npv: number;
  accuracy_metric: MetricInterval;
  sensitivity_metric: MetricInterval;
  specificity_metric: MetricInterval;
  confusion_matrix: ConfusionMatrix;
}

export interface DashboardSummary {
  patients: { total: number; tb: number; non_tb: number; unknown: number };
  studies: { total: number; ct: number; xray: number };
  images: { total: number };
  datasets: { total: number };
  models: { total: number; active: number };
  model_runs: { total: number; completed: number };
  latest_model_run: LatestModelRun | null;
}

export interface Prediction {
  prediction_id: string;
  patient_id: string;
  model_id: string;
  model_run_id: string;
  partition: string;
  ground_truth: string;
  predicted_class: string;
  tb_probability: number;
  non_tb_probability: number;
  threshold: number;
  correct: boolean;
}

export interface PatientListItem {
  patient_id: string;
  display_id: string;
  dataset_id: string;
  ground_truth: string;
  modalities: string[];
  study_count: number;
  image_count: number;
  latest_prediction: Prediction | null;
}

export interface PatientListResponse {
  items: PatientListItem[];
  pagination: Pagination;
}

export interface StudySummary {
  study_id: string;
  modality: string;
  timepoint: string;
  description: string;
  image_count: number;
}

export interface PatientDetail {
  patient_id: string;
  display_id: string;
  dataset_id: string;
  ground_truth: string;
  modalities: string[];
  timepoints: string[];
  study_count: number;
  image_count: number;
  studies: StudySummary[];
  predictions: Prediction[];
}

export interface AvailablePrediction {
  prediction_id: string;
  model_id: string;
  model_run_id: string;
  heatmap_available: boolean;
}

export interface StudyDetail {
  study_id: string;
  patient_id: string;
  modality: string;
  timepoint: string;
  description: string;
  image_count: number;
  images_url: string;
  available_predictions: AvailablePrediction[];
}

export interface ImageListItem {
  image_id: string;
  index: number;
  instance_number: number;
  thumbnail_url: string;
  render_url: string;
}

export interface StudyImagesResponse {
  study_id: string;
  modality: string;
  items: ImageListItem[];
  pagination: Pagination;
}

export interface ModelListItem {
  model_id: string;
  name: string;
  version: string;
  task: string;
  modality: string;
  architecture: string;
  status: string;
  latest_run_id: string;
}

export interface ModelListResponse {
  items: ModelListItem[];
}

export interface ModelDetail extends ModelListItem {
  description: string;
  input_method: string;
  output_classes: string[];
  weight_file_size_bytes: number;
  updated_at: string;
}

export interface ModelRunListItem {
  model_run_id: string;
  model_id: string;
  status: string;
  evaluation_level: string;
  test_patient_count: number;
  accuracy: number;
  sensitivity: number;
  specificity: number;
  roc_auc: number;
  completed_at: string;
}

export interface ModelRunListResponse {
  items: ModelRunListItem[];
}

export interface ModelRunDetail extends ModelRunListItem {
  threshold: number;
  threshold_selection: string;
  accuracy_metric: MetricInterval;
  sensitivity_metric: MetricInterval;
  specificity_metric: MetricInterval;
  ppv: number;
  npv: number;
  confusion_matrix: ConfusionMatrix;
  train_cohort: CohortCounts;
  validation_cohort: CohortCounts;
  test_cohort: CohortCounts;
  cross_split_patient_overlap: number;
  split_method: string;
  notes: string[];
}

export interface PredictionListResponse {
  items: Prediction[];
  pagination: Pagination;
}

export interface DatasetListItem {
  dataset_id: string;
  name: string;
  modality: string;
  patient_count: number;
  image_count: number;
  primary_class: string;
}

export interface DatasetListResponse {
  items: DatasetListItem[];
}

export interface DatasetDetail extends DatasetListItem {
  description: string;
  class_distribution: { tb: number; non_tb: number; unknown: number };
  available_timepoints: string[];
}

export interface ApiErrorBody {
  code?: string;
  message?: string;
  details?: Record<string, unknown>;
  detail?: unknown;
}

export class ApiError extends Error {
  status: number;
  body: ApiErrorBody | null;

  constructor(status: number, message: string, body: ApiErrorBody | null = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export type GroundTruthFilter = 'tb' | 'non_tb' | 'unknown';
export type ModalityFilter = 'CT' | 'XRAY';
export type PartitionFilter = 'train' | 'val' | 'test';
export type PredictedClassFilter = 'tb' | 'non_tb';

export interface PatientListParams {
  page?: number;
  page_size?: number;
  search?: string;
  dataset_id?: string;
  ground_truth?: GroundTruthFilter | '';
  modality?: ModalityFilter | '';
  has_prediction?: boolean;
  predicted_class?: PredictedClassFilter | '';
  prediction_correct?: boolean;
  partition?: PartitionFilter | '';
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PredictionListParams {
  page?: number;
  page_size?: number;
  partition?: PartitionFilter | '';
  patient_id?: string;
  model_run_id?: string;
  predicted_class?: PredictedClassFilter | '';
  ground_truth?: 'tb' | 'non_tb' | '';
  correct?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
