import React from 'react';
import { CheckCircle } from 'lucide-react';

interface Stage {
  id: number;
  label: string;
  status: 'done' | 'active' | 'pending';
}

const STAGES: Stage[] = [
  { id: 1, label: 'Data Ingestion', status: 'done' },
  { id: 2, label: 'Imaging AI', status: 'done' },
  { id: 3, label: 'Risk Engine', status: 'done' },
  { id: 4, label: 'Lab / Biomarkers', status: 'done' },
  { id: 5, label: 'Clinician Dashboard', status: 'active' },
];

const StageNode: React.FC<{ stage: Stage }> = ({ stage }) => {
  if (stage.status === 'done') {
    return (
      <div className="flex flex-col items-center gap-1.5">
        <div className="w-7 h-7 rounded-full bg-[#36C28B]/15 border border-[#36C28B]/40 flex items-center justify-center">
          <CheckCircle className="w-3.5 h-3.5 text-[#36C28B]" strokeWidth={2.5} />
        </div>
        <span className="text-[#5E6E85] text-[10px] font-medium tracking-wide whitespace-nowrap">
          {stage.label}
        </span>
      </div>
    );
  }

  if (stage.status === 'active') {
    return (
      <div className="flex flex-col items-center gap-1.5">
        <div className="w-7 h-7 rounded-full border-2 border-[#3B82F6] flex items-center justify-center bg-[#3B82F6]/10">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
        </div>
        <span className="text-[#3B82F6] text-[10px] font-semibold tracking-wide whitespace-nowrap">
          {stage.label}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-7 h-7 rounded-full border border-[#1E2A3D] bg-[#0F1828] flex items-center justify-center">
        <span className="w-2 h-2 rounded-full bg-[#1E2A3D]" />
      </div>
      <span className="text-[#5E6E85] text-[10px] tracking-wide whitespace-nowrap opacity-50">
        {stage.label}
      </span>
    </div>
  );
};

const Connector: React.FC<{ fromStatus: Stage['status']; toStatus: Stage['status'] }> = ({
  fromStatus,
}) => {
  const isDoneConnector = fromStatus === 'done';
  return (
    <div
      className="flex-1 h-px mt-3.5 mx-1"
      style={{
        background: isDoneConnector ? '#36C28B' : '#1E2A3D',
        opacity: isDoneConnector ? 0.5 : 1,
      }}
    />
  );
};

const PipelineTracker: React.FC = () => {
  return (
    <div className="bg-[#0F1828] border-b border-[#1E2A3D] px-6 py-3 shrink-0">
      <div className="flex items-start justify-center max-w-2xl mx-auto">
        {STAGES.map((stage, index) => (
          <React.Fragment key={stage.id}>
            <StageNode stage={stage} />
            {index < STAGES.length - 1 && (
              <Connector
                fromStatus={stage.status}
                toStatus={STAGES[index + 1].status}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PipelineTracker;
