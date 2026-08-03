import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle, AlertTriangle } from 'lucide-react';
import PageContainer from '../layout/PageContainer';
import { Card, Badge, StatCard } from '../components';
import { getPrediction } from '../api/endpoints';
import { formatProbability } from '../api/client';
import { useAsync } from '../hooks/useAsync';
import { formatClassLabel, formatPartitionLabel } from '../lib/format';

function clsColor(c: string): string {
  if (c === 'tb') return '#F0476A';
  if (c === 'non_tb') return '#36C28B';
  return '#5E6E85';
}

export default function PredictionDetail() {
  const { predictionId = '' } = useParams<{ predictionId: string }>();
  const navigate = useNavigate();
  const pred = useAsync(() => getPrediction(predictionId), [predictionId]);

  return (
    <PageContainer>
      <div
        className="flex gap-3 rounded-xl p-3 mb-6 text-sm"
        style={{ backgroundColor: '#F4A63810', border: '1px solid #F4A63855', color: '#F4A638' }}
      >
        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
        Research prediction detail — not a clinical diagnosis.
      </div>

      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg"
          style={{ backgroundColor: '#1E2A3D', color: '#93A1B5' }}
          aria-label="Back"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="text-[20px] font-semibold" style={{ color: '#E8EEF7' }}>
            Prediction detail
          </h2>
          <p className="text-[12px] font-mono mt-0.5" style={{ color: '#5E6E85' }}>
            {predictionId}
          </p>
        </div>
      </div>

      {pred.loading && (
        <Card>
          <p className="text-sm" style={{ color: '#5E6E85' }}>
            Loading prediction…
          </p>
        </Card>
      )}

      {pred.error && (
        <Card>
          <div className="flex items-center gap-2" style={{ color: '#F0476A' }}>
            <AlertCircle size={16} />
            <span className="text-sm">{pred.error}</span>
            <button type="button" className="ml-auto text-xs underline" style={{ color: '#3B82F6' }} onClick={pred.reload}>
              Retry
            </button>
          </div>
        </Card>
      )}

      {pred.data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Predicted"
              value={formatClassLabel(pred.data.predicted_class)}
              color={clsColor(pred.data.predicted_class)}
            />
            <StatCard
              label="TB Prob. (research)"
              value={formatProbability(pred.data.tb_probability)}
              color="#F4A638"
            />
            <StatCard
              label="Non-TB Prob."
              value={formatProbability(pred.data.non_tb_probability)}
              color="#6B8AFE"
            />
            <StatCard
              label="Correct"
              value={pred.data.correct ? 'Yes' : 'No'}
              color={pred.data.correct ? '#36C28B' : '#F0476A'}
            />
          </div>

          <Card title="Fields">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt style={{ color: '#5E6E85' }}>Patient</dt>
                <dd>
                  <Link
                    to={`/patients/${encodeURIComponent(pred.data.patient_id)}`}
                    className="font-mono text-xs"
                    style={{ color: '#3B82F6' }}
                  >
                    {pred.data.patient_id}
                  </Link>
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt style={{ color: '#5E6E85' }}>Ground truth</dt>
                <dd>
                  <Badge color={clsColor(pred.data.ground_truth)}>
                    {formatClassLabel(pred.data.ground_truth)}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt style={{ color: '#5E6E85' }}>Predicted class</dt>
                <dd>
                  <Badge color={clsColor(pred.data.predicted_class)}>
                    {formatClassLabel(pred.data.predicted_class)}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt style={{ color: '#5E6E85' }}>Threshold</dt>
                <dd className="tabular-nums" style={{ color: '#93A1B5' }}>
                  {pred.data.threshold}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt style={{ color: '#5E6E85' }}>Partition</dt>
                <dd style={{ color: '#93A1B5' }}>{formatPartitionLabel(pred.data.partition)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt style={{ color: '#5E6E85' }}>Model</dt>
                <dd className="font-mono text-xs" style={{ color: '#93A1B5' }}>
                  {pred.data.model_id}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt style={{ color: '#5E6E85' }}>Model run</dt>
                <dd className="font-mono text-xs" style={{ color: '#93A1B5' }}>
                  {pred.data.model_run_id}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt style={{ color: '#5E6E85' }}>Prediction ID</dt>
                <dd className="font-mono text-xs text-right" style={{ color: '#93A1B5' }}>
                  {pred.data.prediction_id}
                </dd>
              </div>
            </dl>
            <div className="mt-4 flex gap-3 flex-wrap">
              <Link
                to={`/patients/${encodeURIComponent(pred.data.patient_id)}`}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: '#1E2A3D', color: '#3B82F6' }}
              >
                Open patient case
              </Link>
              <Link
                to={`/imaging?patientId=${encodeURIComponent(pred.data.patient_id)}`}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: '#3B82F6', color: '#fff' }}
              >
                Open CT Imaging
              </Link>
            </div>
          </Card>
        </>
      )}
    </PageContainer>
  );
}
