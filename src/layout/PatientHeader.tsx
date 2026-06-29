import React from 'react';
import { ChevronLeft, MoreHorizontal } from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';

const PatientHeader: React.FC = () => {
  const { colors } = useTheme();
  const sep = <span className="text-xs select-none" style={{ color: colors.border }}>·</span>;

  return (
    <div
      className="sticky top-16 z-20 px-6 py-3 flex items-center gap-4 shrink-0"
      style={{ backgroundColor: colors.bgSurface, borderBottom: `1px solid ${colors.border}` }}
    >
      <button
        className="p-1 rounded-md transition-colors shrink-0"
        style={{ color: colors.textMuted }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = colors.border; (e.currentTarget as HTMLElement).style.color = colors.textPrimary; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = colors.textMuted; }}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center text-white text-sm font-semibold shrink-0">
        JS
      </div>

      <div className="min-w-0">
        <p className="font-semibold text-sm leading-tight" style={{ color: colors.textPrimary }}>John Smith</p>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          <span className="text-xs tabular-nums" style={{ color: colors.textMuted }}>MRN 10024567</span>
          {sep}
          <span className="text-xs" style={{ color: colors.textSecondary }}>34Y</span>
          {sep}
          <span className="text-xs" style={{ color: colors.textSecondary }}>Male</span>
          {sep}
          <span className="text-xs" style={{ color: colors.textSecondary }}>Respiratory Ward B</span>
        </div>
      </div>

      <div className="flex-1" />

      <div className="hidden md:flex items-center gap-4">
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-widest font-medium" style={{ color: colors.textMuted }}>Encounter</p>
          <p className="text-xs tabular-nums" style={{ color: colors.textSecondary }}>ENC-789102</p>
        </div>
        <div className="w-px h-6" style={{ backgroundColor: colors.border }} />
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-widest font-medium" style={{ color: colors.textMuted }}>Admitted</p>
          <p className="text-xs tabular-nums" style={{ color: colors.textSecondary }}>06 May 2026 · 10:24 AM</p>
        </div>
        <div className="w-px h-6" style={{ backgroundColor: colors.border }} />

        <span className="px-2 py-0.5 rounded-full text-[#F0476A] text-[11px] font-semibold uppercase tracking-wide"
          style={{ backgroundColor: '#F0476A18', border: '1px solid #F0476A30' }}>
          High Risk
        </span>

        <div className="flex items-baseline gap-1">
          <span className="text-lg font-semibold tabular-nums leading-none" style={{ color: colors.textPrimary }}>82%</span>
          <span className="text-[11px]" style={{ color: colors.textMuted }}>Risk Score</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="relative flex w-2 h-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#36C28B] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#36C28B]" />
          </span>
          <span className="text-[#36C28B] text-[11px] font-medium uppercase tracking-wide">Live</span>
        </div>
      </div>

      <button
        className="p-1.5 rounded-md transition-colors shrink-0"
        style={{ color: colors.textMuted }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = colors.border; (e.currentTarget as HTMLElement).style.color = colors.textPrimary; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = colors.textMuted; }}
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
};

export default PatientHeader;
