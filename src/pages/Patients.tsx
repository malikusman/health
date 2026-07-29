import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import PageContainer from '../layout/PageContainer';
import { Card, StatCard, Badge } from '../components';
import { getDashboardSummary, listPatients } from '../api/endpoints';
import { formatProbability } from '../api/client';
import { useApiPatient } from '../api/ApiPatientContext';
import { useAsync } from '../hooks/useAsync';
import type {
  GroundTruthFilter,
  ModalityFilter,
  PartitionFilter,
  PatientListItem,
  PredictedClassFilter,
} from '../api/types';

const chipBase =
  'px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors select-none';

function gtColor(gt: string): string {
  if (gt === 'tb') return '#F0476A';
  if (gt === 'non_tb') return '#36C28B';
  return '#5E6E85';
}

function predColor(cls: string): string {
  if (cls === 'tb') return '#F4A638';
  if (cls === 'non_tb') return '#6B8AFE';
  return '#5E6E85';
}

export default function Patients() {
  const navigate = useNavigate();
  const { selectPatient } = useApiPatient();

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [groundTruth, setGroundTruth] = useState<GroundTruthFilter | ''>('');
  const [modality, setModality] = useState<ModalityFilter | ''>('');
  const [partition, setPartition] = useState<PartitionFilter | ''>('');
  const [predictedClass, setPredictedClass] = useState<PredictedClassFilter | ''>('');
  const [page, setPage] = useState(1);
  const pageSize = 25;

  // Debounce search
  React.useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const summary = useAsync(() => getDashboardSummary(), []);

  const listParams = useMemo(
    () => ({
      page,
      page_size: pageSize,
      search: debouncedSearch || undefined,
      ground_truth: groundTruth || undefined,
      modality: modality || undefined,
      partition: partition || undefined,
      predicted_class: predictedClass || undefined,
      sort_by: 'display_id' as const,
      sort_order: 'asc' as const,
    }),
    [page, debouncedSearch, groundTruth, modality, partition, predictedClass],
  );

  const list = useAsync(() => listPatients(listParams), [listParams]);

  function chipStyle(active: boolean, color = '#3B82F6'): React.CSSProperties {
    if (!active) return { color: '#5E6E85', backgroundColor: '#1E2A3D' };
    return { backgroundColor: `${color}22`, color, border: `1px solid ${color}55` };
  }

  function onSelect(item: PatientListItem) {
    selectPatient(item);
    navigate(`/patients/${encodeURIComponent(item.patient_id)}`);
  }

  const pagination = list.data?.pagination;
  const items = list.data?.items ?? [];

  return (
    <PageContainer>
      <div className="flex items-center gap-3 mb-6">
        <Users size={20} color="#3B82F6" />
        <div>
          <h2 className="text-[20px] font-semibold leading-tight" style={{ color: '#E8EEF7' }}>
            Patients
          </h2>
          <p className="text-[13px] mt-0.5" style={{ color: '#5E6E85' }}>
            Anonymized research cohort from Medical Intelligence API
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Patients"
          value={summary.data ? summary.data.patients.total : '—'}
          color="#E8EEF7"
        />
        <StatCard
          label="Ground Truth TB"
          value={summary.data ? summary.data.patients.tb : '—'}
          color="#F0476A"
        />
        <StatCard
          label="Non-TB"
          value={summary.data ? summary.data.patients.non_tb : '—'}
          color="#36C28B"
        />
        <StatCard
          label="Test Cohort"
          value={
            summary.data?.latest_model_run
              ? summary.data.latest_model_run.test_patient_count
              : 'unavailable'
          }
          color="#3B82F6"
        />
      </div>

      <Card className="mb-4">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: '#5E6E85' }}
            />
            <input
              type="text"
              placeholder="Search display ID or patient ID…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0F1828] border border-[#1E2A3D] rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-[#3B82F6] transition-colors"
              style={{ color: '#E8EEF7' }}
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] uppercase tracking-widest font-semibold mr-1" style={{ color: '#5E6E85' }}>
              Ground truth
            </span>
            {(['', 'tb', 'non_tb'] as const).map((v) => (
              <button
                key={v || 'all'}
                type="button"
                className={chipBase}
                style={chipStyle(groundTruth === v)}
                onClick={() => {
                  setGroundTruth(v);
                  setPage(1);
                }}
              >
                {v === '' ? 'All' : v === 'tb' ? 'TB' : 'Non-TB'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] uppercase tracking-widest font-semibold mr-1" style={{ color: '#5E6E85' }}>
              Partition
            </span>
            {(['', 'train', 'val', 'test'] as const).map((v) => (
              <button
                key={v || 'all'}
                type="button"
                className={chipBase}
                style={chipStyle(partition === v, '#6B8AFE')}
                onClick={() => {
                  setPartition(v);
                  setPage(1);
                }}
              >
                {v === '' ? 'All' : v}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] uppercase tracking-widest font-semibold mr-1" style={{ color: '#5E6E85' }}>
              Predicted
            </span>
            {(['', 'tb', 'non_tb'] as const).map((v) => (
              <button
                key={v || 'all'}
                type="button"
                className={chipBase}
                style={chipStyle(predictedClass === v, '#F4A638')}
                onClick={() => {
                  setPredictedClass(v);
                  setPage(1);
                }}
              >
                {v === '' ? 'All' : v === 'tb' ? 'TB' : 'Non-TB'}
              </button>
            ))}
            <span className="text-[11px] uppercase tracking-widest font-semibold ml-2 mr-1" style={{ color: '#5E6E85' }}>
              Modality
            </span>
            {(['', 'CT'] as const).map((v) => (
              <button
                key={v || 'all'}
                type="button"
                className={chipBase}
                style={chipStyle(modality === v)}
                onClick={() => {
                  setModality(v);
                  setPage(1);
                }}
              >
                {v === '' ? 'All' : v}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {list.error && (
        <Card className="mb-4">
          <div className="flex items-center gap-2" style={{ color: '#F0476A' }}>
            <AlertCircle size={16} />
            <span className="text-sm">{list.error}</span>
            <button type="button" className="ml-auto text-xs underline" style={{ color: '#3B82F6' }} onClick={list.reload}>
              Retry
            </button>
          </div>
        </Card>
      )}

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #1E2A3D' }}>
                {['Display ID', 'Patient ID', 'Ground Truth', 'Predicted', 'TB Prob. (research)', 'Correct', 'Studies', 'Images', 'Partition'].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-[11px] uppercase tracking-widest font-semibold"
                      style={{ color: '#5E6E85' }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {list.loading && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-sm" style={{ color: '#5E6E85' }}>
                    Loading patients…
                  </td>
                </tr>
              )}
              {!list.loading && items.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-sm" style={{ color: '#5E6E85' }}>
                    No patients match these filters.
                  </td>
                </tr>
              )}
              {!list.loading &&
                items.map((p) => {
                  const pred = p.latest_prediction;
                  return (
                    <tr
                      key={p.patient_id}
                      className="cursor-pointer transition-colors hover:bg-[#1E2A3D]/50"
                      style={{ borderBottom: '1px solid #1E2A3D' }}
                      onClick={() => onSelect(p)}
                    >
                      <td className="px-4 py-3 font-medium" style={{ color: '#E8EEF7' }}>
                        {p.display_id}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: '#93A1B5' }}>
                        {p.patient_id}
                      </td>
                      <td className="px-4 py-3">
                        <Badge color={gtColor(p.ground_truth)}>{p.ground_truth}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        {pred ? (
                          <Badge color={predColor(pred.predicted_class)}>{pred.predicted_class}</Badge>
                        ) : (
                          <span style={{ color: '#5E6E85' }}>unavailable</span>
                        )}
                      </td>
                      <td className="px-4 py-3 tabular-nums" style={{ color: '#E8EEF7' }}>
                        {pred ? formatProbability(pred.tb_probability) : 'unavailable'}
                      </td>
                      <td className="px-4 py-3">
                        {pred ? (
                          <span style={{ color: pred.correct ? '#36C28B' : '#F0476A' }}>
                            {pred.correct ? 'Yes' : 'No'}
                          </span>
                        ) : (
                          <span style={{ color: '#5E6E85' }}>unavailable</span>
                        )}
                      </td>
                      <td className="px-4 py-3" style={{ color: '#93A1B5' }}>
                        {p.study_count}
                      </td>
                      <td className="px-4 py-3" style={{ color: '#93A1B5' }}>
                        {p.image_count}
                      </td>
                      <td className="px-4 py-3" style={{ color: '#93A1B5' }}>
                        {pred?.partition ?? 'unavailable'}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {pagination && pagination.total_pages > 0 && (
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderTop: '1px solid #1E2A3D' }}
          >
            <span className="text-xs" style={{ color: '#5E6E85' }}>
              Page {pagination.page} of {pagination.total_pages} · {pagination.total_items} patients
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || list.loading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40"
                style={{ backgroundColor: '#1E2A3D', color: '#E8EEF7' }}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                type="button"
                disabled={page >= pagination.total_pages || list.loading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40"
                style={{ backgroundColor: '#1E2A3D', color: '#E8EEF7' }}
                onClick={() => setPage((p) => p + 1)}
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
