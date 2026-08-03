import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ScanLine,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react';
import PageContainer from '../layout/PageContainer';
import { Card, Badge, EmptyState } from '../components';
import { getPatient, getStudy, getStudyImages } from '../api/endpoints';
import { formatProbability, resolveMediaUrl } from '../api/client';
import { useApiPatient } from '../api/ApiPatientContext';
import { useAsync } from '../hooks/useAsync';
import { formatClassLabel } from '../lib/format';
import { featuredImagingPath, midVolumePage } from '../api/demoSpine';

type WindowPreset = {
  id: string;
  label: string;
  center?: number;
  width?: number;
};

const WINDOW_PRESETS: WindowPreset[] = [
  { id: 'default', label: 'Default' },
  { id: 'lung', label: 'Lung', center: -600, width: 1500 },
  { id: 'mediastinum', label: 'Mediastinum', center: 40, width: 400 },
  { id: 'bone', label: 'Bone', center: 300, width: 1500 },
];

function buildRenderUrl(
  renderPath: string,
  preset: WindowPreset,
  size = 512,
): string {
  const params = new URLSearchParams({ size: String(size) });
  if (preset.center !== undefined && preset.width !== undefined) {
    params.set('window_center', String(preset.center));
    params.set('window_width', String(preset.width));
  }
  const base = renderPath.includes('?') ? renderPath.split('?')[0] : renderPath;
  return resolveMediaUrl(`${base}?${params.toString()}`);
}

export default function Imaging() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { patientId: ctxPatientId, detail, setDetail } = useApiPatient();

  const patientId = searchParams.get('patientId') || ctxPatientId || '';
  const studyIdParam = searchParams.get('studyId') || '';
  const pageFromUrl = Number(searchParams.get('page') || '');
  const sliceFromUrl = Number(searchParams.get('slice') || '');

  const [imagePage, setImagePage] = useState(pageFromUrl > 0 ? pageFromUrl : 0);
  const [selectedIndex, setSelectedIndex] = useState(sliceFromUrl >= 0 && !Number.isNaN(sliceFromUrl) ? sliceFromUrl : 0);
  const [windowPresetId, setWindowPresetId] = useState('default');
  const [jumpPageInput, setJumpPageInput] = useState('');
  const pageSize = 24;

  const windowPreset = WINDOW_PRESETS.find((p) => p.id === windowPresetId) ?? WINDOW_PRESETS[0];

  const patient = useAsync(
    () => (patientId ? getPatient(patientId) : Promise.reject(new Error('No patient selected'))),
    [patientId],
  );

  useEffect(() => {
    if (patient.data) setDetail(patient.data);
  }, [patient.data, setDetail]);

  const studyId = studyIdParam || patient.data?.studies[0]?.study_id || detail?.studies[0]?.study_id || '';

  const study = useAsync(
    () => (studyId ? getStudy(studyId) : Promise.reject(new Error('No study'))),
    [studyId],
  );

  // Mid-volume default when no page in URL
  useEffect(() => {
    if (imagePage > 0) return;
    if (pageFromUrl > 0) {
      setImagePage(pageFromUrl);
      return;
    }
    const count = study.data?.image_count;
    if (count && count > 0) {
      setImagePage(midVolumePage(count, pageSize));
    } else if (studyId && study.data) {
      setImagePage(1);
    }
  }, [study.data, studyId, imagePage, pageFromUrl]);

  // Study change: honor URL page or reset to mid-volume
  useEffect(() => {
    if (pageFromUrl > 0) {
      setImagePage(pageFromUrl);
    } else {
      setImagePage(0);
    }
    if (sliceFromUrl >= 0 && !Number.isNaN(sliceFromUrl)) {
      setSelectedIndex(sliceFromUrl);
    } else {
      setSelectedIndex(0);
    }
  }, [studyId]); // eslint-disable-line react-hooks/exhaustive-deps

  const images = useAsync(
    () =>
      studyId && imagePage > 0
        ? getStudyImages(studyId, imagePage, pageSize)
        : Promise.reject(new Error('No study')),
    [studyId, imagePage],
  );

  const items = images.data?.items ?? [];
  const pagination = images.data?.pagination;
  const selected = items[selectedIndex] ?? items[0] ?? null;
  const heatmapAvailable = study.data?.available_predictions?.some((p) => p.heatmap_available) ?? false;

  const prediction = useMemo(() => patient.data?.predictions?.[0] ?? null, [patient.data]);

  const renderUrl = selected ? buildRenderUrl(selected.render_url, windowPreset) : null;

  const absoluteSlice =
    pagination && selected
      ? (pagination.page - 1) * pageSize + selectedIndex
      : selectedIndex;

  const totalSlices = pagination?.total_items ?? study.data?.image_count ?? 0;

  // Keep URL shareable: page + slice
  const syncUrl = useCallback(
    (page: number, slice: number, nextStudyId = studyId) => {
      if (!patientId || !nextStudyId || page < 1) return;
      const next = new URLSearchParams();
      next.set('patientId', patientId);
      next.set('studyId', nextStudyId);
      next.set('page', String(page));
      next.set('slice', String(Math.max(0, slice)));
      setSearchParams(next, { replace: true });
    },
    [patientId, studyId, setSearchParams],
  );

  useEffect(() => {
    if (imagePage > 0 && items.length > 0) {
      const idx = Math.min(selectedIndex, items.length - 1);
      if (idx !== selectedIndex) setSelectedIndex(idx);
      syncUrl(imagePage, idx);
    }
  }, [imagePage, selectedIndex, items.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const goToAbsoluteSlice = useCallback(
    (abs: number) => {
      if (!totalSlices) return;
      const clamped = Math.max(0, Math.min(totalSlices - 1, abs));
      const nextPage = Math.floor(clamped / pageSize) + 1;
      const nextIndex = clamped % pageSize;
      if (nextPage !== imagePage) {
        setImagePage(nextPage);
        setSelectedIndex(nextIndex);
      } else {
        setSelectedIndex(nextIndex);
      }
    },
    [totalSlices, pageSize, imagePage],
  );

  // Keyboard + wheel scrub on viewer
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!patientId || !items.length) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goToAbsoluteSlice(absoluteSlice + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goToAbsoluteSlice(absoluteSlice - 1);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [patientId, items.length, absoluteSlice, goToAbsoluteSlice]);

  function onViewerWheel(e: React.WheelEvent) {
    if (!items.length) return;
    e.preventDefault();
    if (e.deltaY > 0) goToAbsoluteSlice(absoluteSlice + 1);
    else if (e.deltaY < 0) goToAbsoluteSlice(absoluteSlice - 1);
  }

  function jumpToPage() {
    const n = Number(jumpPageInput);
    if (!pagination || Number.isNaN(n)) return;
    const page = Math.max(1, Math.min(pagination.total_pages, Math.floor(n)));
    setImagePage(page);
    setSelectedIndex(0);
    setJumpPageInput('');
  }

  if (!patientId) {
    return (
      <PageContainer>
        <div className="flex items-center gap-3 mb-6">
          <ScanLine size={20} color="#3B82F6" />
          <h2 className="text-[20px] font-semibold" style={{ color: '#E8EEF7' }}>
            CT Imaging
          </h2>
        </div>
        <Card>
          <EmptyState
            icon={<Users size={24} />}
            title="Select a patient or open the featured research case"
            subtitle="Open a patient case, then choose Open Imaging — or jump straight to the demo CT case."
          />
          <div className="flex justify-center gap-3 pb-4 flex-wrap">
            <Link
              to={featuredImagingPath()}
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ backgroundColor: '#3B82F6', color: '#fff' }}
            >
              Open featured case TB-210
            </Link>
            <Link
              to="/patients"
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ backgroundColor: '#1E2A3D', color: '#E8EEF7' }}
            >
              Browse patients
            </Link>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <ScanLine size={20} color="#3B82F6" />
          <div>
            <h2 className="text-[20px] font-semibold leading-tight" style={{ color: '#E8EEF7' }}>
              CT Imaging
            </h2>
            <p className="text-[13px] mt-0.5" style={{ color: '#5E6E85' }}>
              {patient.data?.display_id ?? patientId}
              {study.data?.modality ? ` · ${study.data.modality}` : ''}
              {studyId ? ` · Study ${studyId}` : ''}
              {totalSlices ? ` · Slice ${absoluteSlice + 1} / ${totalSlices}` : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/patients"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: '#1E2A3D', color: '#93A1B5' }}
          >
            Change patient
          </Link>
          <button
            type="button"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: '#1E2A3D', color: '#3B82F6' }}
            onClick={() => navigate(`/patients/${encodeURIComponent(patientId)}`)}
          >
            Back to case
          </button>
        </div>
      </div>

      {/* Study chips */}
      {patient.data?.studies && patient.data.studies.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {patient.data.studies.map((s) => (
            <button
              key={s.study_id}
              type="button"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{
                backgroundColor: s.study_id === studyId ? '#3B82F633' : '#1E2A3D',
                color: s.study_id === studyId ? '#3B82F6' : '#93A1B5',
                border: s.study_id === studyId ? '1px solid #3B82F655' : '1px solid transparent',
              }}
              onClick={() => {
                setImagePage(0);
                setSelectedIndex(0);
                navigate(
                  `/imaging?patientId=${encodeURIComponent(patientId)}&studyId=${encodeURIComponent(s.study_id)}`,
                );
              }}
            >
              {s.modality} · {s.timepoint || s.study_id} · {s.image_count} slices
            </button>
          ))}
        </div>
      )}

      <div
        className="rounded-xl p-3 mb-4 text-sm"
        style={{ backgroundColor: '#F4A63810', border: '1px solid #F4A63855', color: '#F4A638' }}
      >
        Research imaging viewer — outputs are not clinical diagnoses. Scroll or use arrow keys to scrub slices.
        {!heatmapAvailable && ' Heatmap overlays are currently unavailable.'}
      </div>

      {(patient.error || study.error || images.error) && (
        <Card className="mb-4">
          <div className="flex items-center gap-2" style={{ color: '#F0476A' }}>
            <AlertCircle size={16} />
            <span className="text-sm">{patient.error || study.error || images.error}</span>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <Card className="xl:col-span-2" title="CT viewer">
          {/* Window presets */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[11px] uppercase tracking-widest font-semibold mr-1" style={{ color: '#5E6E85' }}>
              Window
            </span>
            {WINDOW_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                style={{
                  backgroundColor: windowPresetId === p.id ? '#3B82F622' : '#1E2A3D',
                  color: windowPresetId === p.id ? '#3B82F6' : '#93A1B5',
                  border: windowPresetId === p.id ? '1px solid #3B82F655' : '1px solid transparent',
                }}
                onClick={() => setWindowPresetId(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div
            className="flex items-center justify-center rounded-lg mb-4 overflow-hidden select-none"
            style={{ backgroundColor: '#0B1220', minHeight: 420, cursor: items.length ? 'ns-resize' : 'default' }}
            onWheel={onViewerWheel}
          >
            {images.loading && (
              <span className="text-sm" style={{ color: '#5E6E85' }}>
                Loading slices…
              </span>
            )}
            {!images.loading && renderUrl && (
              <img
                src={renderUrl}
                alt={`CT slice ${selected?.index ?? ''}`}
                className="max-w-full max-h-[520px] object-contain"
                draggable={false}
              />
            )}
            {!images.loading && !renderUrl && (
              <span className="text-sm" style={{ color: '#5E6E85' }}>
                No images in this page.
              </span>
            )}
          </div>

          {selected && (
            <p className="text-xs mb-3" style={{ color: '#5E6E85' }}>
              Absolute slice {absoluteSlice + 1}
              {totalSlices ? ` / ${totalSlices}` : ''} · index {selected.index} · instance{' '}
              {selected.instance_number} · {selected.image_id}
            </p>
          )}

          {/* Slice scrubber (absolute across study) */}
          {totalSlices > 1 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: '#5E6E85' }}>
                  Slice scrubber
                </span>
                <span className="text-xs tabular-nums" style={{ color: '#93A1B5' }}>
                  {absoluteSlice + 1} / {totalSlices}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.max(0, totalSlices - 1)}
                value={absoluteSlice}
                onChange={(e) => goToAbsoluteSlice(Number(e.target.value))}
                className="w-full accent-[#3B82F6]"
              />
            </div>
          )}

          <div className="flex gap-2 overflow-x-auto pb-2">
            {items.map((img, i) => (
              <button
                key={img.image_id}
                type="button"
                onClick={() => setSelectedIndex(i)}
                className="shrink-0 rounded border-2 overflow-hidden"
                style={{
                  borderColor: i === selectedIndex ? '#3B82F6' : '#1E2A3D',
                  width: 72,
                  height: 72,
                }}
              >
                <img
                  src={resolveMediaUrl(img.thumbnail_url)}
                  alt={`thumb ${img.index}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>

          {pagination && (
            <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
              <span className="text-xs" style={{ color: '#5E6E85' }}>
                Page {pagination.page} / {pagination.total_pages} · {pagination.total_items} slices
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  disabled={imagePage <= 1 || images.loading}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40"
                  style={{ backgroundColor: '#1E2A3D', color: '#E8EEF7' }}
                  onClick={() => {
                    setImagePage((p) => Math.max(1, p - 1));
                    setSelectedIndex(0);
                  }}
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                <button
                  type="button"
                  disabled={!pagination || imagePage >= pagination.total_pages || images.loading}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40"
                  style={{ backgroundColor: '#1E2A3D', color: '#E8EEF7' }}
                  onClick={() => {
                    setImagePage((p) => p + 1);
                    setSelectedIndex(0);
                  }}
                >
                  Next <ChevronRight size={14} />
                </button>
                <div className="flex items-center gap-1.5 ml-1">
                  <input
                    type="number"
                    min={1}
                    max={pagination.total_pages}
                    placeholder="Page"
                    value={jumpPageInput}
                    onChange={(e) => setJumpPageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && jumpToPage()}
                    className="w-16 px-2 py-1.5 rounded-lg text-xs outline-none"
                    style={{ backgroundColor: '#0F1828', border: '1px solid #1E2A3D', color: '#E8EEF7' }}
                  />
                  <button
                    type="button"
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold"
                    style={{ backgroundColor: '#1E2A3D', color: '#3B82F6' }}
                    onClick={jumpToPage}
                  >
                    Go
                  </button>
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card title="AI classification (research)">
          {study.loading || patient.loading ? (
            <p className="text-sm" style={{ color: '#5E6E85' }}>
              Loading…
            </p>
          ) : (
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-2">
                <dt style={{ color: '#5E6E85' }}>Study</dt>
                <dd className="font-mono text-xs text-right" style={{ color: '#93A1B5' }}>
                  {study.data?.study_id ?? 'unavailable'}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt style={{ color: '#5E6E85' }}>Modality</dt>
                <dd style={{ color: '#E8EEF7' }}>{study.data?.modality ?? 'unavailable'}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt style={{ color: '#5E6E85' }}>Description</dt>
                <dd className="text-right" style={{ color: '#E8EEF7' }}>
                  {study.data?.description || 'unavailable'}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt style={{ color: '#5E6E85' }}>Predicted</dt>
                <dd>
                  {prediction ? (
                    <Badge color={prediction.predicted_class === 'tb' ? '#F0476A' : '#36C28B'}>
                      {formatClassLabel(prediction.predicted_class)}
                    </Badge>
                  ) : (
                    <span style={{ color: '#5E6E85' }}>unavailable</span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt style={{ color: '#5E6E85' }}>TB probability (research)</dt>
                <dd className="tabular-nums" style={{ color: '#E8EEF7' }}>
                  {prediction ? formatProbability(prediction.tb_probability) : 'unavailable'}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt style={{ color: '#5E6E85' }}>Ground truth</dt>
                <dd>
                  {prediction ? (
                    <Badge color={prediction.ground_truth === 'tb' ? '#F0476A' : '#36C28B'}>
                      {formatClassLabel(prediction.ground_truth)}
                    </Badge>
                  ) : (
                    <span style={{ color: '#5E6E85' }}>unavailable</span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt style={{ color: '#5E6E85' }}>Window</dt>
                <dd style={{ color: '#E8EEF7' }}>{windowPreset.label}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt style={{ color: '#5E6E85' }}>Heatmap</dt>
                <dd style={{ color: '#5E6E85' }}>
                  {heatmapAvailable ? 'Available' : 'Unavailable'}
                </dd>
              </div>
            </dl>
          )}
        </Card>
      </div>
    </PageContainer>
  );
}
