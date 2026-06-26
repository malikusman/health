import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users } from 'lucide-react';
import PageContainer from '../layout/PageContainer';
import { Card, StatCard, StatusPill } from '../components';
import { patients } from '../data/patients';

function getInitialsColor(riskLevel: string): string {
  if (riskLevel === 'critical') return '#F0476A';
  if (riskLevel === 'high') return '#F4A638';
  return '#3B82F6';
}

function getRiskScoreColor(score: number): string {
  if (score >= 80) return '#F0476A';
  if (score >= 60) return '#F4A638';
  if (score >= 35) return '#6B8AFE';
  return '#36C28B';
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const ALL_WARDS = ['All', ...Array.from(new Set(patients.map((p) => p.ward)))];

const chipBase =
  'px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors select-none';

export default function Patients() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [wardFilter, setWardFilter] = useState('All');

  const filtered = patients.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk =
      riskFilter === 'All' ||
      p.riskLevel === riskFilter.toLowerCase();
    const matchesWard = wardFilter === 'All' || p.ward === wardFilter;
    return matchesSearch && matchesRisk && matchesWard;
  });

  function riskChipStyle(label: string): { className: string; style: React.CSSProperties } {
    const active = riskFilter === label;
    if (!active) {
      return {
        className: `${chipBase} bg-[#1E2A3D] hover:bg-[#243047]`,
        style: { color: '#5E6E85' },
      };
    }
    const colors: Record<string, string> = {
      All: '#3B82F6', Critical: '#F0476A', High: '#F4A638', Medium: '#6B8AFE', Low: '#36C28B',
    };
    const c = colors[label] ?? '#3B82F6';
    return {
      className: chipBase,
      style: { backgroundColor: `${c}22`, color: c, border: `1px solid ${c}55` },
    };
  }

  function wardChipStyle(label: string): { className: string; style: React.CSSProperties } {
    const active = wardFilter === label;
    if (!active) {
      return {
        className: `${chipBase} bg-[#1E2A3D] hover:bg-[#243047]`,
        style: { color: '#5E6E85' },
      };
    }
    return {
      className: chipBase,
      style: { backgroundColor: '#3B82F622', color: '#3B82F6', border: '1px solid #3B82F655' },
    };
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Users size={20} color="#3B82F6" />
        <h2 className="text-[20px] font-semibold leading-tight" style={{ color: '#E8EEF7' }}>
          Patients
        </h2>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Active Cases" value={14} color="#E8EEF7" />
        <StatCard label="High Risk" value={5} color="#F0476A" />
        <StatCard label="Autonomous Actions Today" value={23} color="#3B82F6" />
        <StatCard label="Avg Confidence" value="79%" color="#36C28B" />
      </div>

      {/* Filter Bar */}
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
              placeholder="Search patients by name…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0F1828] border border-[#1E2A3D] rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-[#3B82F6] transition-colors"
              style={{ color: '#E8EEF7' }}
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] uppercase tracking-widest font-semibold mr-1" style={{ color: '#5E6E85' }}>
              Risk
            </span>
            {(['All', 'Critical', 'High', 'Medium', 'Low'] as const).map((label) => {
              const s = riskChipStyle(label);
              return (
                <span
                  key={label}
                  className={s.className}
                  style={s.style}
                  onClick={() => setRiskFilter(label)}
                >
                  {label}
                </span>
              );
            })}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] uppercase tracking-widest font-semibold mr-1" style={{ color: '#5E6E85' }}>
              Ward
            </span>
            {ALL_WARDS.map((label) => {
              const s = wardChipStyle(label);
              return (
                <span
                  key={label}
                  className={s.className}
                  style={s.style}
                  onClick={() => setWardFilter(label)}
                >
                  {label}
                </span>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Patient Table */}
      <div className="rounded-xl border border-[#1E2A3D] overflow-hidden">
        {/* Header row */}
        <div
          className="grid px-4 py-3 gap-4"
          style={{
            backgroundColor: '#0F1828',
            gridTemplateColumns: '2fr 1fr 0.8fr 1fr 0.7fr 0.8fr 1.4fr 1.5fr 0.9fr',
          }}
        >
          {['Patient', 'MRN', 'Age / Sex', 'Risk Score', 'Actions', 'Confidence', 'Ward', 'Updated', 'Status'].map((h) => (
            <span key={h} className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: '#5E6E85' }}>
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {filtered.map((p, i) => {
          const initColor = getInitialsColor(p.riskLevel);
          const scoreColor = getRiskScoreColor(p.riskScore);
          const isLast = i === filtered.length - 1;

          return (
            <div
              key={p.id}
              className={`grid px-4 py-3 gap-4 items-center cursor-pointer transition-colors${isLast ? '' : ' border-b border-[#1E2A3D]'}`}
              style={{
                gridTemplateColumns: '2fr 1fr 0.8fr 1fr 0.7fr 0.8fr 1.4fr 1.5fr 0.9fr',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(30,42,61,0.3)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
              }}
              onClick={() => navigate('/')}
            >
              {/* Patient */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                  style={{ backgroundColor: `${initColor}22`, color: initColor }}
                >
                  {getInitials(p.name)}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: '#E8EEF7' }}>
                    {p.name}
                  </div>
                  <div className="text-[11px] truncate mt-0.5" style={{ color: '#5E6E85' }}>
                    {p.primarySuspicion}
                  </div>
                </div>
              </div>

              {/* MRN */}
              <span
                className="text-sm font-mono tabular-nums"
                style={{ color: '#93A1B5', fontVariantNumeric: 'tabular-nums' }}
              >
                {p.mrn}
              </span>

              {/* Age/Sex */}
              <span className="text-sm" style={{ color: '#93A1B5' }}>
                {p.age} {p.sex[0]}
              </span>

              {/* Risk Score */}
              <div className="flex flex-col gap-1.5">
                <span
                  className="text-sm font-semibold tabular-nums"
                  style={{ color: scoreColor, fontVariantNumeric: 'tabular-nums' }}
                >
                  {p.riskScore}
                </span>
                <div className="w-full rounded-full overflow-hidden" style={{ height: 4, backgroundColor: '#1E2A3D' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${p.riskScore}%`, backgroundColor: scoreColor }}
                  />
                </div>
              </div>

              {/* Actions */}
              <span className="text-sm" style={{ color: '#93A1B5' }}>
                {p.autonomousActions}
              </span>

              {/* Confidence */}
              <span
                className="text-sm tabular-nums"
                style={{ color: '#93A1B5', fontVariantNumeric: 'tabular-nums' }}
              >
                {p.confidence}%
              </span>

              {/* Ward */}
              <span className="text-sm truncate" style={{ color: '#93A1B5' }}>
                {p.ward}
              </span>

              {/* Updated */}
              <span className="text-[12px]" style={{ color: '#5E6E85' }}>
                {p.lastUpdated}
              </span>

              {/* Status */}
              <StatusPill status={p.status} size="sm" />
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-3 text-[12px]" style={{ color: '#5E6E85' }}>
        Showing {filtered.length} of {patients.length} patients
      </div>
    </PageContainer>
  );
}
