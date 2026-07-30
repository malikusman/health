import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle, AlertTriangle, Database } from 'lucide-react';
import PageContainer from '../layout/PageContainer';
import { Card, Badge, StatCard } from '../components';
import { getDataset } from '../api/endpoints';
import { useAsync } from '../hooks/useAsync';

export default function DatasetDetail() {
  const { datasetId = '' } = useParams<{ datasetId: string }>();
  const navigate = useNavigate();
  const dataset = useAsync(() => getDataset(datasetId), [datasetId]);

  const dist = dataset.data?.class_distribution;

  return (
    <PageContainer>
      <div
        className="flex gap-3 rounded-xl p-3 mb-6 text-sm"
        style={{ backgroundColor: '#F4A63810', border: '1px solid #F4A63855', color: '#F4A638' }}
      >
        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
        Research dataset inventory — anonymized, not for clinical use.
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
        <Database size={20} color="#3B82F6" />
        <div>
          <h2 className="text-[20px] font-semibold" style={{ color: '#E8EEF7' }}>
            {dataset.data?.name ?? 'Dataset'}
          </h2>
          <p className="text-[12px] font-mono mt-0.5" style={{ color: '#5E6E85' }}>
            {datasetId}
          </p>
        </div>
      </div>

      {dataset.loading && (
        <Card>
          <p className="text-sm" style={{ color: '#5E6E85' }}>
            Loading dataset…
          </p>
        </Card>
      )}

      {dataset.error && (
        <Card>
          <div className="flex items-center gap-2" style={{ color: '#F0476A' }}>
            <AlertCircle size={16} />
            <span className="text-sm">{dataset.error}</span>
            <button type="button" className="ml-auto text-xs underline" style={{ color: '#3B82F6' }} onClick={dataset.reload}>
              Retry
            </button>
          </div>
          <Link to="/research" className="inline-block mt-3 text-sm" style={{ color: '#3B82F6' }}>
            Back to Research
          </Link>
        </Card>
      )}

      {dataset.data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard label="Patients" value={dataset.data.patient_count} color="#E8EEF7" />
            <StatCard label="Images" value={dataset.data.image_count} color="#3B82F6" />
            <StatCard label="Modality" value={dataset.data.modality || 'unavailable'} color="#6B8AFE" />
            <StatCard
              label="Primary class"
              value={dataset.data.primary_class || 'unavailable'}
              color={dataset.data.primary_class === 'tb' ? '#F0476A' : '#36C28B'}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card title="Description">
              <p className="text-sm leading-relaxed" style={{ color: '#93A1B5' }}>
                {dataset.data.description || 'unavailable'}
              </p>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt style={{ color: '#5E6E85' }}>Dataset ID</dt>
                  <dd className="font-mono text-xs" style={{ color: '#93A1B5' }}>
                    {dataset.data.dataset_id}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt style={{ color: '#5E6E85' }}>Timepoints</dt>
                  <dd style={{ color: '#E8EEF7' }}>
                    {dataset.data.available_timepoints?.length
                      ? dataset.data.available_timepoints.join(', ')
                      : 'unavailable'}
                  </dd>
                </div>
              </dl>
            </Card>

            <Card title="Class distribution">
              {dist ? (
                <div className="space-y-3">
                  {[
                    { key: 'tb', label: 'TB', value: dist.tb, color: '#F0476A' },
                    { key: 'non_tb', label: 'Non-TB', value: dist.non_tb, color: '#36C28B' },
                    { key: 'unknown', label: 'Unknown', value: dist.unknown, color: '#5E6E85' },
                  ].map((row) => (
                    <div key={row.key} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Badge color={row.color}>{row.label}</Badge>
                      </div>
                      <span className="tabular-nums font-semibold" style={{ color: '#E8EEF7' }}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{ color: '#5E6E85' }}>
                  unavailable
                </p>
              )}
              <Link to="/research" className="inline-block mt-4 text-sm" style={{ color: '#3B82F6' }}>
                Back to Research Mode
              </Link>
            </Card>
          </div>
        </>
      )}
    </PageContainer>
  );
}
