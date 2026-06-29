import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Layers, ZoomIn, ZoomOut, RotateCcw, ScanLine } from 'lucide-react';
import PageContainer from '../layout/PageContainer';
import { Card, StatusPill, Badge, DataTable } from '../components';
import ChestXray from '../components/ChestXray';
import { imagingStudies } from '../data/imaging';
import type { ImagingStudy } from '../lib/types';

function classificationColor(c: string): string {
  if (c === 'SUSPICIOUS') return '#F0476A';
  if (c === 'INDETERMINATE') return '#F4A638';
  if (c === 'NORMAL') return '#36C28B';
  return '#5E6E85';
}

function confidenceColor(c: string): string {
  if (c === 'High') return '#36C28B';
  if (c === 'Medium') return '#F4A638';
  if (c === 'Low') return '#F0476A';
  return '#5E6E85';
}

export default function Imaging() {
  const navigate = useNavigate();
  const [showHeatmap, setShowHeatmap] = useState(false);

  const primary = imagingStudies[0];

  const columns = [
    { key: 'modality', label: 'Modality' },
    { key: 'view', label: 'View' },
    { key: 'date', label: 'Date' },
    {
      key: 'aiClassification',
      label: 'AI Classification',
      render: (row: ImagingStudy) => (
        <Badge color={classificationColor(row.aiClassification)}>
          {row.aiClassification}
        </Badge>
      ),
    },
    {
      key: 'probability',
      label: 'Probability',
      render: (row: ImagingStudy) => (
        <span style={{ color: '#E8EEF7', fontVariantNumeric: 'tabular-nums' }}>
          {row.probability !== null ? `${row.probability}%` : '—'}
        </span>
      ),
    },
    {
      key: 'confidence',
      label: 'Confidence',
      render: (row: ImagingStudy) => (
        <span style={{ color: confidenceColor(row.confidence) }}>{row.confidence}</span>
      ),
    },
    {
      key: 'radiologistStatus',
      label: 'Radiologist Status',
      render: (row: ImagingStudy) => <StatusPill status={row.radiologistStatus} size="sm" />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_row: ImagingStudy) => (
        <button
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
          style={{ backgroundColor: '#3B82F622', color: '#3B82F6', border: '1px solid #3B82F644' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3B82F633';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3B82F622';
          }}
          onClick={() => navigate('/')}
        >
          <Eye size={12} />
          View
        </button>
      ),
    },
  ] as { key: string; label: string; render?: (row: ImagingStudy) => React.ReactNode }[];

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <ScanLine size={20} color="#3B82F6" />
        <div>
          <h2 className="text-[20px] font-semibold leading-tight" style={{ color: '#E8EEF7' }}>
            Imaging
          </h2>
          <p className="text-[13px] mt-0.5" style={{ color: '#5E6E85' }}>
            AI-powered imaging analysis and radiologist workflow
          </p>
        </div>
      </div>

      {/* Main grid: viewer + findings panel */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* LEFT — Image Viewer col-span-2 */}
        <div className="col-span-2">
          <Card title="Image Viewer">
            {/* Viewer area */}
            <div
              className="relative rounded-xl overflow-hidden mb-4 flex items-center justify-center"
              style={{ backgroundColor: '#0a0e18' }}
            >
              <div style={{ width: '100%', maxWidth: '480px' }}>
                <ChestXray showHeatmap={showHeatmap} />
              </div>

              {/* Top-right badge */}
              <div className="absolute top-3 right-3">
                <Badge color="#F0476A" size="md">SUSPICIOUS · 82%</Badge>
              </div>

              {/* Watermark bottom-left */}
              <div
                className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest"
                style={{ color: '#2e4060' }}
              >
                Scorpius Imaging AI v2.1
              </div>
            </div>

            {/* Control bar */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowHeatmap((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                style={
                  showHeatmap
                    ? { backgroundColor: '#3B82F622', color: '#3B82F6', border: '1px solid #3B82F644' }
                    : { backgroundColor: '#1E2A3D', color: '#93A1B5', border: '1px solid #1E2A3D' }
                }
              >
                <Layers size={12} />
                Heatmap
              </button>
              {[
                { icon: <ZoomIn size={12} />, label: 'Zoom +' },
                { icon: <ZoomOut size={12} />, label: 'Zoom −' },
                { icon: <RotateCcw size={12} />, label: 'Reset' },
                { icon: <Eye size={12} />, label: 'Window / Level' },
                { icon: <ScanLine size={12} />, label: 'Compare Prior' },
              ].map(({ icon, label }) => (
                <button
                  key={label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                  style={{ backgroundColor: '#1E2A3D', color: '#93A1B5' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#243047';
                    (e.currentTarget as HTMLButtonElement).style.color = '#E8EEF7';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1E2A3D';
                    (e.currentTarget as HTMLButtonElement).style.color = '#93A1B5';
                  }}
                  onClick={() => {}}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT — AI Classification / Findings */}
        <div className="col-span-1 flex flex-col gap-4">
          <Card title="AI Classification">
            {/* Classification badge large */}
            <div className="mb-4">
              <Badge color="#F0476A" size="lg">SUSPICIOUS</Badge>
            </div>

            {/* Probability */}
            <div className="mb-4">
              <div className="text-[11px] uppercase tracking-widest font-semibold mb-1" style={{ color: '#5E6E85' }}>
                Prob. Tuberculosis
              </div>
              <div className="text-[36px] font-bold leading-none tabular-nums" style={{ color: '#F0476A', fontVariantNumeric: 'tabular-nums' }}>
                82%
              </div>
            </div>

            {/* Confidence */}
            <div className="flex items-center justify-between py-2 border-b border-[#1E2A3D]">
              <span className="text-[13px]" style={{ color: '#5E6E85' }}>Confidence</span>
              <Badge color="#36C28B" size="sm">High</Badge>
            </div>

            {/* Model version */}
            <div className="flex items-center justify-between py-2 border-b border-[#1E2A3D]">
              <span className="text-[13px]" style={{ color: '#5E6E85' }}>Model</span>
              <span className="text-[13px] font-medium" style={{ color: '#93A1B5' }}>
                Scorpius Imaging AI v2.1
              </span>
            </div>

            {/* Radiologist status */}
            <div className="flex items-center justify-between py-2 border-b border-[#1E2A3D]">
              <span className="text-[13px]" style={{ color: '#5E6E85' }}>Radiologist</span>
              <StatusPill status="Pending" size="sm" />
            </div>

            {/* Findings */}
            <div className="mt-4 mb-4">
              <div className="text-[11px] uppercase tracking-widest font-semibold mb-3" style={{ color: '#5E6E85' }}>
                Findings
              </div>
              <ul className="flex flex-col gap-2">
                {primary.findings.map((f, i) => (
                  <li key={i} className="flex gap-2 text-[13px]" style={{ color: '#93A1B5' }}>
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#3B82F6' }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                className="w-full py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{ backgroundColor: '#3B82F6', color: '#fff' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2563EB'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3B82F6'; }}
              >
                Request Radiologist Review
              </button>
              <button
                className="w-full py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{ backgroundColor: '#1E2A3D', color: '#93A1B5', border: '1px solid #1E2A3D' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#243047';
                  (e.currentTarget as HTMLButtonElement).style.color = '#E8EEF7';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1E2A3D';
                  (e.currentTarget as HTMLButtonElement).style.color = '#93A1B5';
                }}
              >
                Add to Report
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Studies Table */}
      <Card title="Studies" badge={imagingStudies.length}>
        <DataTable
          columns={columns}
          rows={imagingStudies}
        />
      </Card>
    </PageContainer>
  );
}
