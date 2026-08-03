import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Users,
  Zap,
  Shield,
  ScanLine,
  Microscope,
  AlertCircle,
} from 'lucide-react';

import PageContainer from '../layout/PageContainer';
import { Card } from '../components/Card';
import { Badge, StatCard } from '../components';
import { getDashboardSummary, listPredictions } from '../api/endpoints';
import { formatMetric, formatPercentMetric, formatProbability, resolveMediaUrl } from '../api/client';
import { useAsync } from '../hooks/useAsync';
import {
  featuredCasePath,
  featuredImagingPath,
  loadDemoSpine,
} from '../api/demoSpine';
import { formatClassLabel, formatPartitionLabel } from '../lib/format';
import { buildAlignedInterventions } from '../data/interventions';
import { buildAlignedPrevention } from '../data/prevention';

function LinkButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 text-[12px] font-medium transition-colors"
      style={{ color: '#3B82F6' }}
    >
      {children}
      <ChevronRight size={12} />
    </button>
  );
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const spine = useAsync(() => loadDemoSpine(5), []);
  const summary = useAsync(() => getDashboardSummary(), []);
  const preds = useAsync(
    () =>
      listPredictions({
        partition: 'test',
        sort_by: 'tb_probability',
        sort_order: 'desc',
        page: 1,
        page_size: 5,
      }),
    [],
  );

  const s = spine.data?.summary ?? summary.data;
  const run = s?.latest_model_run;
  const interventions = spine.data ? buildAlignedInterventions(spine.data) : [];
  const prevention = spine.data ? buildAlignedPrevention(spine.data).filter((p) => p.status === 'Open') : [];
  const thumbs = spine.data?.preview?.items?.slice(0, 5) ?? [];

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-[22px] font-bold tracking-tight" style={{ color: '#E8EEF7' }}>
          Medical Research Intelligence
        </h1>
        <p className="text-[13px] mt-1" style={{ color: '#5E6E85' }}>
          Pilot · Live cohort from Medical Intelligence API · Research outputs are not a clinical diagnosis ·
          Agentic workflows coming soon
        </p>
      </div>

      {(spine.error || summary.error) && (
        <Card className="mb-4">
          <div className="flex items-center gap-2 text-sm" style={{ color: '#F0476A' }}>
            <AlertCircle size={16} />
            {spine.error || summary.error}
          </div>
        </Card>
      )}

      {/* Cohort strip */}
      <Card className="mb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div className="flex items-center gap-2">
            <Users size={16} style={{ color: '#3B82F6' }} />
            <div>
              <h2 className="text-[14px] font-semibold" style={{ color: '#E8EEF7' }}>
                Research cohort
              </h2>
              <p className="text-[12px]" style={{ color: '#5E6E85' }}>
                Live counts from GET /dashboard/summary
              </p>
            </div>
          </div>
          <LinkButton onClick={() => navigate('/patients')}>Browse patients</LinkButton>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard label="Patients" value={s ? s.patients.total : '—'} color="#E8EEF7" />
          <StatCard label="TB" value={s ? s.patients.tb : '—'} color="#F0476A" />
          <StatCard label="Non-TB" value={s ? s.patients.non_tb : '—'} color="#36C28B" />
          <StatCard label="CT Studies" value={s ? s.studies.ct : '—'} color="#6B8AFE" />
          <StatCard label="Images" value={s ? s.images.total : '—'} color="#E8EEF7" />
          <StatCard label="Active Models" value={s ? s.models.active : '—'} color="#3B82F6" />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Featured case */}
        <Card
          title="Featured research case"
          className="lg:col-span-2"
          action={<LinkButton onClick={() => navigate(featuredCasePath())}>Open case</LinkButton>}
        >
          {spine.loading && (
            <p className="text-sm" style={{ color: '#5E6E85' }}>
              Loading featured case…
            </p>
          )}
          {spine.data && (
            <>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-lg font-semibold" style={{ color: '#E8EEF7' }}>
                  {spine.data.patient.display_id}
                </span>
                <Badge color="#F0476A">{spine.data.groundTruthLabel}</Badge>
                <Badge color="#F4A638">Predicted {spine.data.predictedLabel}</Badge>
                <span className="text-sm tabular-nums" style={{ color: '#E8EEF7' }}>
                  TB prob. (research) {spine.data.tbProbabilityLabel}
                </span>
              </div>
              <p className="text-[12px] mb-3" style={{ color: '#5E6E85' }}>
                {spine.data.modelName} · Study {spine.data.studyId} · {spine.data.imageCount} slices · Mid-volume
                preview
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1 mb-3">
                {thumbs.map((img) => (
                  <button
                    key={img.image_id}
                    type="button"
                    className="shrink-0 rounded-lg overflow-hidden border"
                    style={{ borderColor: '#1E2A3D', width: 72, height: 72 }}
                    onClick={() => navigate(featuredImagingPath(spine.data!.midPage))}
                  >
                    <img
                      src={resolveMediaUrl(img.thumbnail_url)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
                {thumbs.length === 0 && (
                  <span className="text-xs" style={{ color: '#5E6E85' }}>
                    Thumbnails unavailable
                  </span>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium"
                  style={{ backgroundColor: '#3B82F6', color: '#fff' }}
                  onClick={() => navigate(featuredImagingPath(spine.data!.midPage))}
                >
                  <ScanLine size={13} />
                  Open CT Imaging
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium"
                  style={{ backgroundColor: '#1E2A3D', color: '#E8EEF7' }}
                  onClick={() => navigate(featuredCasePath())}
                >
                  Patient case
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium"
                  style={{ backgroundColor: '#1E2A3D', color: '#93A1B5' }}
                  onClick={() => navigate('/research')}
                >
                  <Microscope size={13} />
                  Research Mode
                </button>
              </div>
            </>
          )}
        </Card>

        {/* Model metrics */}
        <Card
          title="Model metrics (research)"
          action={<LinkButton onClick={() => navigate('/research')}>Details</LinkButton>}
        >
          <p className="text-[11px] mb-3" style={{ color: '#5E6E85' }}>
            Latest model run — not diagnostic confidence
          </p>
          {run ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-2">
                <span style={{ color: '#5E6E85' }}>Model</span>
                <span style={{ color: '#E8EEF7' }}>{spine.data?.modelName ?? run.model_id}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span style={{ color: '#5E6E85' }}>ROC-AUC</span>
                <span className="tabular-nums" style={{ color: '#E8EEF7' }}>
                  {formatMetric(run.roc_auc)}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span style={{ color: '#5E6E85' }}>Sensitivity</span>
                <span className="tabular-nums" style={{ color: '#E8EEF7' }}>
                  {formatPercentMetric(run.sensitivity)}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span style={{ color: '#5E6E85' }}>Specificity</span>
                <span className="tabular-nums" style={{ color: '#E8EEF7' }}>
                  {formatPercentMetric(run.specificity)}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span style={{ color: '#5E6E85' }}>Accuracy</span>
                <span className="tabular-nums" style={{ color: '#E8EEF7' }}>
                  {formatPercentMetric(run.accuracy)}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span style={{ color: '#5E6E85' }}>Test cohort</span>
                <span className="tabular-nums" style={{ color: '#E8EEF7' }}>
                  {run.test_patient_count}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm" style={{ color: '#5E6E85' }}>
              {summary.loading ? 'Loading…' : 'No model run available'}
            </p>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Priority predictions */}
        <Card
          title="Priority predictions"
          badge="Test"
          badgeColor="#3B82F6"
          action={<LinkButton onClick={() => navigate('/research')}>View all</LinkButton>}
        >
          <p className="text-[11px] mb-3" style={{ color: '#5E6E85' }}>
            Highest TB probability in the test partition (research)
          </p>
          {preds.loading && (
            <p className="text-sm" style={{ color: '#5E6E85' }}>
              Loading…
            </p>
          )}
          {(preds.data?.items ?? []).map((p) => (
            <button
              key={p.prediction_id}
              type="button"
              className="w-full flex items-center gap-3 py-2 border-b border-[#1E2A3D] last:border-0 text-left hover:bg-[#1E2A3D]/40"
              onClick={() => navigate(`/patients/${encodeURIComponent(p.patient_id)}`)}
            >
              <span className="font-mono text-xs flex-1 truncate" style={{ color: '#3B82F6' }}>
                {p.patient_id}
              </span>
              <Badge color={p.predicted_class === 'tb' ? '#F4A638' : '#6B8AFE'}>
                {formatClassLabel(p.predicted_class)}
              </Badge>
              <span className="text-xs tabular-nums w-14 text-right" style={{ color: '#E8EEF7' }}>
                {formatProbability(p.tb_probability)}
              </span>
              <span className="text-[11px] w-16 text-right" style={{ color: '#93A1B5' }}>
                {formatPartitionLabel(p.partition)}
              </span>
            </button>
          ))}
        </Card>

        {/* Agentic coming soon */}
        <Card
          title="Autonomous agents"
          badge="Coming Soon"
          badgeColor="#F4A638"
          action={
            <LinkButton onClick={() => navigate('/intervention')}>Open Intervention</LinkButton>
          }
        >
          <p className="text-[11px] mb-3" style={{ color: '#5E6E85' }}>
            Triggers use live research signals; actions are simulated until clinical systems connect
          </p>
          <div className="space-y-2 mb-4">
            {interventions.slice(0, 3).map((i) => (
              <button
                key={i.id}
                type="button"
                className="w-full text-left p-3 rounded-lg border transition-colors"
                style={{ backgroundColor: '#0F1828', borderColor: '#1E2A3D' }}
                onClick={() => navigate('/intervention')}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={12} style={{ color: '#F4A638' }} />
                  <span className="text-[12px] font-medium" style={{ color: '#E8EEF7' }}>
                    {i.title}
                  </span>
                </div>
                <p className="text-[11px] line-clamp-2" style={{ color: '#5E6E85' }}>
                  {i.trigger}
                </p>
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#1E2A3D]">
            <div className="flex items-center gap-1.5 text-[12px]" style={{ color: '#93A1B5' }}>
              <Shield size={12} style={{ color: '#36C28B' }} />
              {prevention.length} open prevention opportunities
            </div>
            <LinkButton onClick={() => navigate('/prevention')}>Prevention</LinkButton>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
