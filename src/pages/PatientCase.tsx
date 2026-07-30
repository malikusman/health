import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ScanLine, AlertCircle, User } from 'lucide-react';
import PageContainer from '../layout/PageContainer';
import { Card, Badge, StatCard } from '../components';
import { getPatient, getPatientPredictions } from '../api/endpoints';
import { formatProbability } from '../api/client';
import { useApiPatient } from '../api/ApiPatientContext';
import { useAsync } from '../hooks/useAsync';

function gtColor(gt: string): string {
  if (gt === 'tb') return '#F0476A';
  if (gt === 'non_tb') return '#36C28B';
  return '#5E6E85';
}

export default function PatientCase() {
  const { patientId = '' } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { setDetail, selectPatient } = useApiPatient();

  const patient = useAsync(() => getPatient(patientId), [patientId]);
  const predHistory = useAsync(
    () => (patientId ? getPatientPredictions(patientId) : Promise.reject(new Error('No patient'))),
    [patientId],
  );

  useEffect(() => {
    if (patient.data) {
      setDetail(patient.data);
      selectPatient({
        patient_id: patient.data.patient_id,
        display_id: patient.data.display_id,
        dataset_id: patient.data.dataset_id,
        ground_truth: patient.data.ground_truth,
        modalities: patient.data.modalities,
        study_count: patient.data.study_count,
        image_count: patient.data.image_count,
        latest_prediction: patient.data.predictions[0] ?? null,
      });
    }
  }, [patient.data, setDetail, selectPatient]);

  const pred = patient.data?.predictions[0];
  const primaryStudy = patient.data?.studies[0];

  return (
    <PageContainer>
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate('/patients')}
          className="p-2 rounded-lg transition-colors"
          style={{ backgroundColor: '#1E2A3D', color: '#93A1B5' }}
          aria-label="Back to patients"
        >
          <ArrowLeft size={16} />
        </button>
        <User size={20} color="#3B82F6" />
        <div>
          <h2 className="text-[20px] font-semibold leading-tight" style={{ color: '#E8EEF7' }}>
            {patient.data?.display_id ?? 'Patient case'}
          </h2>
          <p className="text-[13px] mt-0.5 font-mono" style={{ color: '#5E6E85' }}>
            {patientId}
          </p>
        </div>
      </div>

      {patient.loading && (
        <Card>
          <p className="text-sm" style={{ color: '#5E6E85' }}>
            Loading case…
          </p>
        </Card>
      )}

      {patient.error && (
        <Card>
          <div className="flex items-center gap-2" style={{ color: '#F0476A' }}>
            <AlertCircle size={16} />
            <span className="text-sm">{patient.error}</span>
            <button type="button" className="ml-auto text-xs underline" style={{ color: '#3B82F6' }} onClick={patient.reload}>
              Retry
            </button>
          </div>
          <Link to="/patients" className="inline-block mt-3 text-sm" style={{ color: '#3B82F6' }}>
            Back to patient list
          </Link>
        </Card>
      )}

      {patient.data && (
        <>
          <div
            className="rounded-xl p-3 mb-6 text-sm"
            style={{ backgroundColor: '#F4A63810', border: '1px solid #F4A63855', color: '#F4A638' }}
          >
            Research / demo outputs only — not for clinical diagnosis. Probabilities are model scores, not clinical confidence.
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard label="Ground Truth" value={patient.data.ground_truth} color={gtColor(patient.data.ground_truth)} />
            <StatCard
              label="TB Prob. (research)"
              value={pred ? formatProbability(pred.tb_probability) : 'unavailable'}
              color="#F4A638"
            />
            <StatCard label="Studies" value={patient.data.study_count} color="#E8EEF7" />
            <StatCard label="Images" value={patient.data.image_count} color="#3B82F6" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <Card title="Case summary">
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt style={{ color: '#5E6E85' }}>Display ID</dt>
                  <dd style={{ color: '#E8EEF7' }}>{patient.data.display_id}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt style={{ color: '#5E6E85' }}>Dataset</dt>
                  <dd className="font-mono text-xs" style={{ color: '#93A1B5' }}>
                    {patient.data.dataset_id}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt style={{ color: '#5E6E85' }}>Modalities</dt>
                  <dd style={{ color: '#E8EEF7' }}>{patient.data.modalities.join(', ') || 'unavailable'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt style={{ color: '#5E6E85' }}>Timepoints</dt>
                  <dd style={{ color: '#E8EEF7' }}>
                    {patient.data.timepoints.length ? patient.data.timepoints.join(', ') : 'unavailable'}
                  </dd>
                </div>
              </dl>
            </Card>

            <Card title="Latest prediction">
              {pred ? (
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt style={{ color: '#5E6E85' }}>Predicted class</dt>
                    <dd>
                      <Badge color={gtColor(pred.predicted_class)}>{pred.predicted_class}</Badge>
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt style={{ color: '#5E6E85' }}>TB probability (research)</dt>
                    <dd className="tabular-nums" style={{ color: '#E8EEF7' }}>
                      {formatProbability(pred.tb_probability)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt style={{ color: '#5E6E85' }}>Non-TB probability</dt>
                    <dd className="tabular-nums" style={{ color: '#E8EEF7' }}>
                      {formatProbability(pred.non_tb_probability)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt style={{ color: '#5E6E85' }}>Threshold</dt>
                    <dd className="tabular-nums" style={{ color: '#93A1B5' }}>
                      {pred.threshold}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt style={{ color: '#5E6E85' }}>Correct</dt>
                    <dd style={{ color: pred.correct ? '#36C28B' : '#F0476A' }}>
                      {pred.correct ? 'Yes' : 'No'}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt style={{ color: '#5E6E85' }}>Partition</dt>
                    <dd style={{ color: '#93A1B5' }}>{pred.partition}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt style={{ color: '#5E6E85' }}>Model run</dt>
                    <dd className="font-mono text-xs" style={{ color: '#93A1B5' }}>
                      {pred.model_run_id}
                    </dd>
                  </div>
                  <Link
                    to={`/predictions/${encodeURIComponent(pred.prediction_id)}`}
                    className="inline-block text-xs font-semibold mt-1"
                    style={{ color: '#3B82F6' }}
                  >
                    Open prediction detail →
                  </Link>
                </dl>
              ) : (
                <p className="text-sm" style={{ color: '#5E6E85' }}>
                  No prediction available for this patient.
                </p>
              )}
            </Card>
          </div>

          <Card title="Prediction history" className="mb-6">
            {predHistory.loading && (
              <p className="text-sm" style={{ color: '#5E6E85' }}>
                Loading predictions…
              </p>
            )}
            {predHistory.error && (
              <div className="flex items-center gap-2 text-sm" style={{ color: '#F0476A' }}>
                <AlertCircle size={14} />
                {predHistory.error}
                <button type="button" className="ml-auto text-xs underline" style={{ color: '#3B82F6' }} onClick={predHistory.reload}>
                  Retry
                </button>
              </div>
            )}
            {!predHistory.loading && !predHistory.error && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #1E2A3D' }}>
                      {['Predicted', 'TB Prob. (research)', 'Correct', 'Partition', 'Model run', ''].map((h) => (
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
                    {(predHistory.data ?? []).length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-2 py-4" style={{ color: '#5E6E85' }}>
                          No predictions for this patient.
                        </td>
                      </tr>
                    )}
                    {(predHistory.data ?? []).map((p) => (
                      <tr key={p.prediction_id} style={{ borderBottom: '1px solid #1E2A3D' }}>
                        <td className="px-2 py-3">
                          <Badge color={gtColor(p.predicted_class)}>{p.predicted_class}</Badge>
                        </td>
                        <td className="px-2 py-3 tabular-nums" style={{ color: '#E8EEF7' }}>
                          {formatProbability(p.tb_probability)}
                        </td>
                        <td className="px-2 py-3" style={{ color: p.correct ? '#36C28B' : '#F0476A' }}>
                          {p.correct ? 'Yes' : 'No'}
                        </td>
                        <td className="px-2 py-3" style={{ color: '#93A1B5' }}>
                          {p.partition}
                        </td>
                        <td className="px-2 py-3 font-mono text-xs" style={{ color: '#93A1B5' }}>
                          {p.model_run_id}
                        </td>
                        <td className="px-2 py-3">
                          <Link
                            to={`/predictions/${encodeURIComponent(p.prediction_id)}`}
                            className="text-xs font-semibold"
                            style={{ color: '#3B82F6' }}
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card title="Studies">
            {patient.data.studies.length === 0 ? (
              <p className="text-sm" style={{ color: '#5E6E85' }}>
                No studies on this case.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #1E2A3D' }}>
                      {['Study ID', 'Modality', 'Timepoint', 'Description', 'Images', ''].map((h) => (
                        <th
                          key={h || 'actions'}
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
                        <td className="px-2 py-3" style={{ color: '#E8EEF7' }}>
                          {s.description || 'unavailable'}
                        </td>
                        <td className="px-2 py-3" style={{ color: '#93A1B5' }}>
                          {s.image_count}
                        </td>
                        <td className="px-2 py-3">
                          <button
                            type="button"
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold"
                            style={{ backgroundColor: '#3B82F622', color: '#3B82F6', border: '1px solid #3B82F644' }}
                            onClick={() =>
                              navigate(
                                `/imaging?patientId=${encodeURIComponent(patient.data!.patient_id)}&studyId=${encodeURIComponent(s.study_id)}`,
                              )
                            }
                          >
                            <ScanLine size={12} />
                            Open Imaging
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {primaryStudy && (
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{ backgroundColor: '#3B82F6', color: '#fff' }}
                  onClick={() =>
                    navigate(
                      `/imaging?patientId=${encodeURIComponent(patient.data!.patient_id)}&studyId=${encodeURIComponent(primaryStudy.study_id)}`,
                    )
                  }
                >
                  <ScanLine size={16} />
                  Open primary study in Imaging
                </button>
              </div>
            )}
          </Card>
        </>
      )}
    </PageContainer>
  );
}
