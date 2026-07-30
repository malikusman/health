import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Microscope, AlertTriangle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import PageContainer from '../layout/PageContainer';
import { Card, StatCard, Badge, SectionTitle } from '../components';
import {
  getDashboardSummary,
  getModel,
  getModelRun,
  listDatasets,
  listModelRuns,
  listModels,
  listPredictions,
} from '../api/endpoints';
import { formatMetric, formatPercentMetric, formatProbability } from '../api/client';
import { useAsync } from '../hooks/useAsync';
import { formatClassLabel, formatPartitionLabel } from '../lib/format';

const PIE_COLORS = ['#F0476A', '#36C28B', '#5E6E85'];

const selectClass =
  'bg-[#0F1828] border border-[#1E2A3D] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3B82F6] w-full max-w-md';

export default function ResearchMode() {
  const [predPage, setPredPage] = useState(1);
  const [selectedModelId, setSelectedModelId] = useState('');
  const [selectedRunId, setSelectedRunId] = useState('');
  const pageSize = 25;

  const summary = useAsync(() => getDashboardSummary(), []);
  const models = useAsync(() => listModels(), []);
  const runs = useAsync(() => listModelRuns(), []);
  const datasets = useAsync(() => listDatasets(), []);

  // Default selection from dashboard summary / first list item
  useEffect(() => {
    const latestModel = summary.data?.latest_model_run?.model_id;
    const latestRun = summary.data?.latest_model_run?.model_run_id;
    if (!selectedModelId) {
      const fallback = latestModel || models.data?.items[0]?.model_id || '';
      if (fallback) setSelectedModelId(fallback);
    }
    if (!selectedRunId) {
      const fallback = latestRun || runs.data?.items[0]?.model_run_id || '';
      if (fallback) setSelectedRunId(fallback);
    }
  }, [summary.data, models.data, runs.data, selectedModelId, selectedRunId]);

  const modelId = selectedModelId;
  const runId = selectedRunId;

  const run = useAsync(
    () => (runId ? getModelRun(runId) : Promise.reject(new Error('No model run selected'))),
    [runId],
  );
  const model = useAsync(
    () => (modelId ? getModel(modelId) : Promise.reject(new Error('No model selected'))),
    [modelId],
  );
  const predictions = useAsync(
    () =>
      runId
        ? listPredictions({
            page: predPage,
            page_size: pageSize,
            model_run_id: runId,
            partition: 'test',
            sort_by: 'tb_probability',
            sort_order: 'desc',
          })
        : Promise.reject(new Error('No model run selected')),
    [predPage, runId],
  );

  const runsForModel = useMemo(() => {
    const items = runs.data?.items ?? [];
    if (!modelId) return items;
    return items.filter((r) => r.model_id === modelId);
  }, [runs.data, modelId]);

  const pieData =
    datasets.data?.items.map((d) => ({
      id: d.dataset_id,
      name: formatClassLabel(d.primary_class) !== 'unavailable'
        ? formatClassLabel(d.primary_class)
        : d.name,
      value: d.patient_count,
      color: d.primary_class === 'tb' ? PIE_COLORS[0] : d.primary_class === 'non_tb' ? PIE_COLORS[1] : PIE_COLORS[2],
    })) ?? [];

  const cm = run.data?.confusion_matrix;
  const predItems = predictions.data?.items ?? [];
  const predPagination = predictions.data?.pagination;

  return (
    <PageContainer>
      <div
        className="flex gap-3 rounded-xl p-4 mb-6"
        style={{ backgroundColor: '#F4A63810', border: '1px solid #F4A638' }}
      >
        <AlertTriangle size={18} style={{ color: '#F4A638', flexShrink: 0, marginTop: 2 }} />
        <div>
          <p className="text-sm font-semibold" style={{ color: '#F4A638' }}>
            Not for clinical use
          </p>
          <p className="text-[13px] mt-1" style={{ color: '#93A1B5' }}>
            Metrics and predictions are research outputs from the Medical Intelligence API. Do not treat
            probabilities as clinical confidence scores.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <Microscope size={20} color="#3B82F6" />
        <div>
          <h2 className="text-[20px] font-semibold leading-tight" style={{ color: '#E8EEF7' }}>
            Research Mode
          </h2>
          <p className="text-[13px] mt-0.5" style={{ color: '#5E6E85' }}>
            Live model-run evaluation · anonymized holdout cohort
          </p>
        </div>
      </div>

      <Card className="mb-6" title="Model & run selection">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block text-sm">
            <span className="text-[11px] uppercase tracking-widest font-semibold block mb-1.5" style={{ color: '#5E6E85' }}>
              Model
            </span>
            <select
              className={selectClass}
              style={{ color: '#E8EEF7' }}
              value={selectedModelId}
              onChange={(e) => {
                const next = e.target.value;
                setSelectedModelId(next);
                setPredPage(1);
                const firstRun = (runs.data?.items ?? []).find((r) => r.model_id === next);
                if (firstRun) setSelectedRunId(firstRun.model_run_id);
              }}
            >
              {(models.data?.items ?? []).length === 0 && (
                <option value="">{models.loading ? 'Loading…' : 'No models'}</option>
              )}
              {(models.data?.items ?? []).map((m) => (
                <option key={m.model_id} value={m.model_id}>
                  {m.name} ({m.version})
                </option>
              ))}
            </select>
            {models.error && (
              <span className="text-xs mt-1 block" style={{ color: '#F0476A' }}>
                {models.error}
              </span>
            )}
          </label>
          <label className="block text-sm">
            <span className="text-[11px] uppercase tracking-widest font-semibold block mb-1.5" style={{ color: '#5E6E85' }}>
              Model run
            </span>
            <select
              className={selectClass}
              style={{ color: '#E8EEF7' }}
              value={selectedRunId}
              onChange={(e) => {
                setSelectedRunId(e.target.value);
                setPredPage(1);
              }}
            >
              {runsForModel.length === 0 && (
                <option value="">{runs.loading ? 'Loading…' : 'No runs'}</option>
              )}
              {runsForModel.map((r) => (
                <option key={r.model_run_id} value={r.model_run_id}>
                  {r.model_run_id} · {r.status}
                </option>
              ))}
            </select>
            {runs.error && (
              <span className="text-xs mt-1 block" style={{ color: '#F0476A' }}>
                {runs.error}
              </span>
            )}
          </label>
        </div>
      </Card>

      {(summary.error || run.error) && (
        <Card className="mb-4">
          <div className="flex items-center gap-2" style={{ color: '#F0476A' }}>
            <AlertCircle size={16} />
            <span className="text-sm">{summary.error || run.error}</span>
            <button type="button" className="ml-auto text-xs underline" style={{ color: '#3B82F6' }} onClick={run.reload}>
              Retry
            </button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Test cohort"
          value={run.data ? run.data.test_patient_count : summary.loading || run.loading ? '…' : 'unavailable'}
          color="#E8EEF7"
        />
        <StatCard
          label="ROC-AUC (research)"
          value={run.data ? formatMetric(run.data.roc_auc) : 'unavailable'}
          color="#3B82F6"
        />
        <StatCard
          label="Sensitivity (research)"
          value={run.data ? formatPercentMetric(run.data.sensitivity) : 'unavailable'}
          color="#36C28B"
        />
        <StatCard
          label="Specificity (research)"
          value={run.data ? formatPercentMetric(run.data.specificity) : 'unavailable'}
          color="#6B8AFE"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card title="Active model">
          {model.loading || !model.data ? (
            <p className="text-sm" style={{ color: '#5E6E85' }}>
              {model.error || (model.loading ? 'Loading model…' : 'unavailable')}
            </p>
          ) : (
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt style={{ color: '#5E6E85' }}>Name</dt>
                <dd style={{ color: '#E8EEF7' }}>{model.data.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt style={{ color: '#5E6E85' }}>Model ID</dt>
                <dd className="font-mono text-xs" style={{ color: '#93A1B5' }}>
                  {model.data.model_id}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt style={{ color: '#5E6E85' }}>Version</dt>
                <dd style={{ color: '#E8EEF7' }}>{model.data.version}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt style={{ color: '#5E6E85' }}>Architecture</dt>
                <dd style={{ color: '#E8EEF7' }}>{model.data.architecture}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt style={{ color: '#5E6E85' }}>Task</dt>
                <dd className="text-right" style={{ color: '#93A1B5' }}>
                  {model.data.task}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt style={{ color: '#5E6E85' }}>Status</dt>
                <dd>
                  <Badge color="#36C28B">{model.data.status}</Badge>
                </dd>
              </div>
              <p className="text-[13px] pt-2" style={{ color: '#5E6E85' }}>
                {model.data.description}
              </p>
            </dl>
          )}
        </Card>

        <Card title="Model run metrics">
          {run.data ? (
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt style={{ color: '#5E6E85' }}>Run ID</dt>
                <dd className="font-mono text-xs" style={{ color: '#93A1B5' }}>
                  {run.data.model_run_id}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt style={{ color: '#5E6E85' }}>Accuracy</dt>
                <dd className="tabular-nums" style={{ color: '#E8EEF7' }}>
                  {formatPercentMetric(run.data.accuracy)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt style={{ color: '#5E6E85' }}>PPV / NPV</dt>
                <dd className="tabular-nums" style={{ color: '#E8EEF7' }}>
                  {formatPercentMetric(run.data.ppv)} / {formatPercentMetric(run.data.npv)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt style={{ color: '#5E6E85' }}>Decision threshold</dt>
                <dd className="tabular-nums" style={{ color: '#93A1B5' }}>
                  {run.data.threshold}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt style={{ color: '#5E6E85' }}>Accuracy 95% CI</dt>
                <dd className="tabular-nums text-xs" style={{ color: '#93A1B5' }}>
                  {formatMetric(run.data.accuracy_metric.ci_lower)} – {formatMetric(run.data.accuracy_metric.ci_upper)}
                </dd>
              </div>
              <p className="text-[12px] pt-1" style={{ color: '#5E6E85' }}>
                {run.data.threshold_selection}
              </p>
            </dl>
          ) : (
            <p className="text-sm" style={{ color: '#5E6E85' }}>
              {run.loading ? 'Loading…' : 'unavailable'}
            </p>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card title="Dataset class distribution">
          {pieData.length === 0 ? (
            <p className="text-sm" style={{ color: '#5E6E85' }}>
              {datasets.loading ? 'Loading…' : datasets.error || 'unavailable'}
            </p>
          ) : (
            <>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                      {pieData.map((d) => (
                        <Cell key={d.id} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#121C2E', border: '1px solid #1E2A3D', borderRadius: 8 }}
                      labelStyle={{ color: '#E8EEF7' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
                {pieData.map((d) => (
                  <Link
                    key={d.id}
                    to={`/datasets/${encodeURIComponent(d.id)}`}
                    className="flex items-center gap-1.5 hover:opacity-80"
                  >
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-xs" style={{ color: '#3B82F6' }}>
                      {d.name} <span style={{ color: '#5E6E85' }}>({d.value})</span>
                    </span>
                  </Link>
                ))}
              </div>
              {(datasets.data?.items ?? []).length > 0 && (
                <ul className="mt-3 space-y-1">
                  {datasets.data!.items.map((d) => (
                    <li key={d.dataset_id}>
                      <Link
                        to={`/datasets/${encodeURIComponent(d.dataset_id)}`}
                        className="text-xs font-mono"
                        style={{ color: '#3B82F6' }}
                      >
                        {d.dataset_id} →
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </Card>

        <Card title="Confusion matrix (test)">
          {!cm ? (
            <p className="text-sm" style={{ color: '#5E6E85' }}>
              {run.loading ? 'Loading…' : 'unavailable'}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-w-sm">
              {[
                { label: 'True negative', value: cm.true_negative, color: '#36C28B' },
                { label: 'False positive', value: cm.false_positive, color: '#F4A638' },
                { label: 'False negative', value: cm.false_negative, color: '#F0476A' },
                { label: 'True positive', value: cm.true_positive, color: '#3B82F6' },
              ].map((cell) => (
                <div
                  key={cell.label}
                  className="rounded-lg p-4 text-center"
                  style={{ backgroundColor: '#0F1828', border: `1px solid ${cell.color}44` }}
                >
                  <div className="text-2xl font-bold tabular-nums" style={{ color: cell.color }}>
                    {cell.value}
                  </div>
                  <div className="text-[11px] mt-1 uppercase tracking-wide" style={{ color: '#5E6E85' }}>
                    {cell.label}
                  </div>
                </div>
              ))}
            </div>
          )}
          {run.data?.notes?.length ? (
            <ul className="mt-4 space-y-1">
              {run.data.notes.map((n) => (
                <li key={n} className="text-[12px]" style={{ color: '#5E6E85' }}>
                  · {n}
                </li>
              ))}
            </ul>
          ) : null}
        </Card>
      </div>

      <SectionTitle title="Test-partition predictions" />
      <Card className="!p-0 overflow-hidden mt-3">
        {predictions.error && (
          <div className="px-4 py-3 text-sm" style={{ color: '#F0476A' }}>
            {predictions.error}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #1E2A3D' }}>
                {['Patient', 'Ground truth', 'Predicted', 'TB Prob. (research)', 'Correct', 'Partition', ''].map((h) => (
                  <th
                    key={h || 'a'}
                    className="text-left px-4 py-3 text-[11px] uppercase tracking-widest font-semibold"
                    style={{ color: '#5E6E85' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {predictions.loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center" style={{ color: '#5E6E85' }}>
                    Loading predictions…
                  </td>
                </tr>
              )}
              {!predictions.loading &&
                predItems.map((p) => (
                  <tr key={p.prediction_id} style={{ borderBottom: '1px solid #1E2A3D' }}>
                    <td className="px-4 py-3">
                      <Link
                        to={`/patients/${encodeURIComponent(p.patient_id)}`}
                        className="font-mono text-xs"
                        style={{ color: '#3B82F6' }}
                      >
                        {p.patient_id}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={p.ground_truth === 'tb' ? '#F0476A' : '#36C28B'}>
                        {formatClassLabel(p.ground_truth)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={p.predicted_class === 'tb' ? '#F4A638' : '#6B8AFE'}>
                        {formatClassLabel(p.predicted_class)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 tabular-nums" style={{ color: '#E8EEF7' }}>
                      {formatProbability(p.tb_probability)}
                    </td>
                    <td className="px-4 py-3" style={{ color: p.correct ? '#36C28B' : '#F0476A' }}>
                      {p.correct ? 'Yes' : 'No'}
                    </td>
                    <td className="px-4 py-3" style={{ color: '#93A1B5' }}>
                      {formatPartitionLabel(p.partition)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/predictions/${encodeURIComponent(p.prediction_id)}`}
                        className="text-xs font-semibold"
                        style={{ color: '#3B82F6' }}
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {predPagination && (
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderTop: '1px solid #1E2A3D' }}
          >
            <span className="text-xs" style={{ color: '#5E6E85' }}>
              Page {predPagination.page} of {predPagination.total_pages} · {predPagination.total_items} predictions
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={predPage <= 1 || predictions.loading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40"
                style={{ backgroundColor: '#1E2A3D', color: '#E8EEF7' }}
                onClick={() => setPredPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                type="button"
                disabled={predPage >= predPagination.total_pages || predictions.loading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40"
                style={{ backgroundColor: '#1E2A3D', color: '#E8EEF7' }}
                onClick={() => setPredPage((p) => p + 1)}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </Card>
    </PageContainer>
  );
}
