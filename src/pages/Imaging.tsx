import React, { useEffect, useMemo, useState } from 'react';
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

export default function Imaging() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { patientId: ctxPatientId, detail, setDetail } = useApiPatient();

  const patientId = searchParams.get('patientId') || ctxPatientId || '';
  const studyIdParam = searchParams.get('studyId') || '';
  const pageFromUrl = Number(searchParams.get('page') || '');

  const [imagePage, setImagePage] = useState(pageFromUrl > 0 ? pageFromUrl : 0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const pageSize = 24;

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

  // Open mid-volume by default (or URL page) so demos land near lung parenchyma
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

  const images = useAsync(
    () =>
      studyId && imagePage > 0
        ? getStudyImages(studyId, imagePage, pageSize)
        : Promise.reject(new Error('No study')),
    [studyId, imagePage],
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [imagePage, studyId]);

  // Reset page when study changes (unless URL pinned a page)
  useEffect(() => {
    if (pageFromUrl > 0) {
      setImagePage(pageFromUrl);
    } else {
      setImagePage(0);
    }
  }, [studyId, pageFromUrl]);

  const items = images.data?.items ?? [];
  const selected = items[selectedIndex] ?? null;
  const heatmapAvailable = study.data?.available_predictions?.some((p) => p.heatmap_available) ?? false;

  const prediction = useMemo(() => {
    const fromPatient = patient.data?.predictions?.[0];
    return fromPatient ?? null;
  }, [patient.data]);

  const renderUrl = selected
    ? resolveMediaUrl(`${selected.render_url}?size=512`)
    : null;
  const pagination = images.data?.pagination;

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

      <div
        className="rounded-xl p-3 mb-4 text-sm"
        style={{ backgroundColor: '#F4A63810', border: '1px solid #F4A63855', color: '#F4A638' }}
      >
        Research imaging viewer — outputs are not clinical diagnoses.
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
          <div
            className="flex items-center justify-center rounded-lg mb-4 overflow-hidden"
            style={{ backgroundColor: '#0B1220', minHeight: 420 }}
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
              Slice index {selected.index} · instance {selected.instance_number} · {selected.image_id}
            </p>
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
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs" style={{ color: '#5E6E85' }}>
                Image page {pagination.page} / {pagination.total_pages} · {pagination.total_items} slices
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={imagePage <= 1 || images.loading}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40"
                  style={{ backgroundColor: '#1E2A3D', color: '#E8EEF7' }}
                  onClick={() => setImagePage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                <button
                  type="button"
                  disabled={!pagination || imagePage >= pagination.total_pages || images.loading}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40"
                  style={{ backgroundColor: '#1E2A3D', color: '#E8EEF7' }}
                  onClick={() => setImagePage((p) => p + 1)}
                >
                  Next <ChevronRight size={14} />
                </button>
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
                <dt style={{ color: '#5E6E85' }}>Radiologist status</dt>
                <dd style={{ color: '#5E6E85' }}>N/A (research API)</dd>
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

      <Card title="Studies">
        {!patient.data?.studies?.length ? (
          <p className="text-sm" style={{ color: '#5E6E85' }}>
            {patient.loading ? 'Loading studies…' : 'No studies.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #1E2A3D' }}>
                  {['Study ID', 'Modality', 'Timepoint', 'Images', 'TB Prob. (research)', ''].map((h) => (
                    <th
                      key={h || 'a'}
                      className="text-left px-2 py-2 text-[11px] uppercase tracking-widest font-semibold"
                      style={{ color: '#5E6E85' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {patient.data.studies.map((s) => (
                  <tr key={s.study_id} style={{ borderBottom: '1px solid #1E2A3D' }}>
                    <td className="px-2 py-3 font-mono text-xs" style={{ color: '#93A1B5' }}>
                      {s.study_id}
                    </td>
                    <td className="px-2 py-3" style={{ color: '#E8EEF7' }}>
                      {s.modality}
                    </td>
                    <td className="px-2 py-3" style={{ color: '#93A1B5' }}>
                      {s.timepoint || 'unavailable'}
                    </td>
                    <td className="px-2 py-3" style={{ color: '#93A1B5' }}>
                      {s.image_count}
                    </td>
                    <td className="px-2 py-3 tabular-nums" style={{ color: '#E8EEF7' }}>
                      {prediction ? formatProbability(prediction.tb_probability) : 'unavailable'}
                    </td>
                    <td className="px-2 py-3">
                      <button
                        type="button"
                        className="text-xs font-semibold px-3 py-1 rounded-lg"
                        style={{
                          backgroundColor: s.study_id === studyId ? '#3B82F633' : '#1E2A3D',
                          color: '#3B82F6',
                        }}
                        onClick={() => {
                          setImagePage(1);
                          navigate(
                            `/imaging?patientId=${encodeURIComponent(patientId)}&studyId=${encodeURIComponent(s.study_id)}`,
                          );
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </PageContainer>
  );
}
