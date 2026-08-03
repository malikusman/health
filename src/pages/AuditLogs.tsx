import React, { useState } from 'react';
import { ClipboardList, Download, Search, Shield } from 'lucide-react';
import { auditEntries } from '../data/auditLog';
import PageContainer from '../layout/PageContainer';
import { Card, Badge, SectionTitle } from '../components';

// ─── Types ────────────────────────────────────────────────────────────────────

type ActorFilter = 'All' | 'Clinician' | 'System' | 'Agent';

const ACTOR_COLOR: Record<string, string> = {
  Clinician: '#3B82F6',
  System:    '#5E6E85',
  Agent:     '#36C28B',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const AuditLogs: React.FC = () => {
  const [searchTerm, setSearchTerm]   = useState('');
  const [actorFilter, setActorFilter] = useState<ActorFilter>('All');

  const filtered = auditEntries.filter((entry) => {
    const matchesActor =
      actorFilter === 'All' || entry.actorType === actorFilter;

    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      entry.actor.toLowerCase().includes(term) ||
      entry.action.toLowerCase().includes(term) ||
      entry.target.toLowerCase().includes(term);

    return matchesActor && matchesSearch;
  });

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <SectionTitle
          title="Audit & Logs"
          subtitle="Tamper-evident audit trail — every system action recorded."
          icon={<ClipboardList size={22} />}
        />
        <button
          onClick={() => alert('Exporting audit log as CSV…')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
          style={{ backgroundColor: '#1E2A3D', color: '#93A1B5', border: '1px solid #1E2A3D' }}
        >
          <Download size={14} />
          Export Log
        </button>
      </div>

      {/* Filter bar */}
      <Card className="mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#5E6E85' }} />
            <input
              type="text"
              placeholder="Search actor, action, target…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-lg text-xs outline-none"
              style={{
                backgroundColor: '#0F1828',
                border:          '1px solid #1E2A3D',
                color:           '#E8EEF7',
              }}
            />
          </div>

          {/* Actor type filter */}
          <div className="flex gap-1">
            {(['All', 'Clinician', 'System', 'Agent'] as ActorFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setActorFilter(f)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                style={{
                  backgroundColor: actorFilter === f
                    ? `${ACTOR_COLOR[f] ?? '#3B82F6'}22`
                    : '#0F1828',
                  color: actorFilter === f
                    ? (ACTOR_COLOR[f] ?? '#3B82F6')
                    : '#5E6E85',
                  border: `1px solid ${actorFilter === f ? `${ACTOR_COLOR[f] ?? '#3B82F6'}44` : '#1E2A3D'}`,
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 900 }}>
            <thead>
              <tr style={{ backgroundColor: '#0F1828' }}>
                {['Timestamp', 'Actor', 'Action', 'Target', 'Outcome', 'Conf.', 'Session', 'IP'].map((h) => (
                  <th
                    key={h}
                    className="py-2.5 px-3 text-left text-[10px] uppercase tracking-widest"
                    style={{ color: '#5E6E85', whiteSpace: 'nowrap' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, i) => (
                <tr
                  key={entry.id}
                  className="border-b border-[#1E2A3D]"
                  style={{ backgroundColor: i % 2 === 0 ? '#0F182830' : 'transparent' }}
                >
                  {/* Timestamp */}
                  <td className="py-2 px-3 font-mono text-[11px] whitespace-nowrap" style={{ color: '#5E6E85' }}>
                    {entry.timestamp}
                  </td>

                  {/* Actor */}
                  <td className="py-2 px-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold" style={{ color: '#E8EEF7' }}>
                        {entry.actor}
                      </span>
                      <Badge color={ACTOR_COLOR[entry.actorType] ?? '#5E6E85'} size="sm">
                        {entry.actorType}
                      </Badge>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-2 px-3 text-xs" style={{ color: '#93A1B5', maxWidth: 220 }}>
                    {entry.action}
                  </td>

                  {/* Target */}
                  <td className="py-2 px-3 text-xs" style={{ color: '#5E6E85', maxWidth: 160 }}>
                    {entry.target}
                  </td>

                  {/* Outcome */}
                  <td className="py-2 px-3 text-xs" style={{ color: '#93A1B5', maxWidth: 200 }}>
                    {entry.outcome}
                  </td>

                  {/* Confidence */}
                  <td className="py-2 px-3 text-xs tabular-nums" style={{ color: '#93A1B5' }}>
                    {entry.confidence != null ? (
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{
                          backgroundColor: entry.confidence >= 90 ? '#36C28B22' : '#F4A63822',
                          color:           entry.confidence >= 90 ? '#36C28B'   : '#F4A638',
                        }}
                      >
                        {entry.confidence}%
                      </span>
                    ) : (
                      <span style={{ color: '#1E2A3D' }}>—</span>
                    )}
                  </td>

                  {/* Session */}
                  <td className="py-2 px-3 font-mono text-[10px] whitespace-nowrap" style={{ color: '#5E6E85' }}>
                    {entry.session}
                  </td>

                  {/* IP */}
                  <td className="py-2 px-3 font-mono text-[10px] whitespace-nowrap" style={{ color: '#5E6E85' }}>
                    {entry.ip}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-xs" style={{ color: '#5E6E85' }}>
                    No matching audit entries.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between mt-4 pt-4 text-xs"
          style={{ borderTop: '1px solid #1E2A3D' }}
        >
          <span style={{ color: '#5E6E85' }}>
            Showing <strong style={{ color: '#93A1B5' }}>{filtered.length}</strong> of{' '}
            <strong style={{ color: '#93A1B5' }}>{auditEntries.length}</strong> entries
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => alert('Exporting CSV…')}
              className="text-xs font-semibold"
              style={{ color: '#3B82F6' }}
            >
              Export to CSV
            </button>
            <div className="flex items-center gap-1.5" style={{ color: '#5E6E85' }}>
              <Shield size={12} />
              <span>Pilot · Tamper-evident audit trail · Research use</span>
            </div>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default AuditLogs;
