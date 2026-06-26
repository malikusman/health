import React from 'react';
import { ChevronLeft, MoreHorizontal } from 'lucide-react';

const PatientHeader: React.FC = () => {
  return (
    <div className="sticky top-16 z-20 bg-[#121C2E] border-b border-[#1E2A3D] px-6 py-3 flex items-center gap-4 shrink-0">
      {/* Back */}
      <button className="p-1 rounded-md text-[#5E6E85] hover:text-[#E8EEF7] hover:bg-[#1E2A3D] transition-colors shrink-0">
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center text-white text-sm font-semibold shrink-0"
        aria-label="Patient initials"
      >
        AM
      </div>

      {/* Identity */}
      <div className="min-w-0">
        <p className="text-[#E8EEF7] font-semibold text-sm leading-tight">
          Arjun Mehta
        </p>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          <span className="text-[#5E6E85] text-xs tabular-nums">MRN 10024567</span>
          <span className="text-[#1E2A3D] text-xs select-none">·</span>
          <span className="text-[#93A1B5] text-xs">34Y</span>
          <span className="text-[#1E2A3D] text-xs select-none">·</span>
          <span className="text-[#93A1B5] text-xs">Male</span>
          <span className="text-[#1E2A3D] text-xs select-none">·</span>
          <span className="text-[#93A1B5] text-xs">Respiratory Ward B</span>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side metadata */}
      <div className="hidden md:flex items-center gap-4">
        <div className="text-right">
          <p className="text-[#5E6E85] text-[11px] uppercase tracking-widest font-medium">
            Encounter
          </p>
          <p className="text-[#93A1B5] text-xs tabular-nums">ENC-789102</p>
        </div>
        <div className="w-px h-6 bg-[#1E2A3D]" />
        <div className="text-right">
          <p className="text-[#5E6E85] text-[11px] uppercase tracking-widest font-medium">
            Admitted
          </p>
          <p className="text-[#93A1B5] text-xs tabular-nums">06 May 2026 · 10:24 AM</p>
        </div>
        <div className="w-px h-6 bg-[#1E2A3D]" />

        {/* Risk pill */}
        <span className="px-2 py-0.5 rounded-full bg-[#F0476A]/15 border border-[#F0476A]/30 text-[#F0476A] text-[11px] font-semibold uppercase tracking-wide">
          High Risk
        </span>

        {/* Risk score */}
        <div className="flex items-baseline gap-1">
          <span className="text-[#E8EEF7] text-lg font-semibold tabular-nums leading-none">
            82%
          </span>
          <span className="text-[#5E6E85] text-[11px]">Risk Score</span>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5">
          <span className="relative flex w-2 h-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#36C28B] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#36C28B]" />
          </span>
          <span className="text-[#36C28B] text-[11px] font-medium uppercase tracking-wide">
            Live
          </span>
        </div>
      </div>

      {/* More */}
      <button className="p-1.5 rounded-md text-[#5E6E85] hover:text-[#E8EEF7] hover:bg-[#1E2A3D] transition-colors shrink-0">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
};

export default PatientHeader;
