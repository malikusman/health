import React from 'react';
import {
  Shield,
  Search,
  Bell,
  ChevronDown,
  Plus,
  Upload,
} from 'lucide-react';

const Topbar: React.FC = () => {
  const handleComingSoon = () => window.alert('Feature coming soon');

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0B1220] border-b border-[#1E2A3D] flex items-center px-6 gap-4 shrink-0">
      {/* Left: Branding */}
      <div className="flex items-center gap-2.5 shrink-0">
        <Shield className="w-5 h-5 text-[#3B82F6]" strokeWidth={2} />
        <div className="flex flex-col leading-none">
          <span className="text-[#E8EEF7] font-semibold text-sm tracking-wide">
            SCORPIUS
          </span>
          <span className="hidden sm:block text-[#5E6E85] text-[9px] tracking-widest uppercase mt-0.5">
            Autonomous Clinical Operations
          </span>
        </div>
      </div>

      <div className="w-px h-6 bg-[#1E2A3D] shrink-0" />

      {/* Center: Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5E6E85]"
            strokeWidth={2}
          />
          <input
            type="text"
            placeholder="Search patients, encounters, alerts..."
            className="w-full bg-[#0F1828] border border-[#1E2A3D] rounded-lg pl-9 pr-4 py-2 text-sm text-[#E8EEF7] placeholder-[#5E6E85] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors"
          />
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2 shrink-0 ml-auto">
        {/* Org selector */}
        <button
          onClick={handleComingSoon}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[#93A1B5] hover:bg-[#1E2A3D] hover:text-[#E8EEF7] transition-colors"
        >
          <span>UC Davis Health</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-5 bg-[#1E2A3D]" />

        {/* Notifications */}
        <button
          onClick={handleComingSoon}
          className="relative p-2 rounded-lg text-[#93A1B5] hover:bg-[#1E2A3D] hover:text-[#E8EEF7] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#F0476A] text-white text-[9px] font-semibold flex items-center justify-center leading-none">
            3
          </span>
        </button>

        {/* User chip */}
        <button
          onClick={handleComingSoon}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#1E2A3D] transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-[#3B82F6] flex items-center justify-center text-white text-xs font-semibold shrink-0">
            EM
          </div>
          <span className="hidden lg:block text-sm text-[#E8EEF7] font-medium">
            Dr. Elena Martinez
          </span>
        </button>

        <div className="w-px h-5 bg-[#1E2A3D]" />

        {/* Action buttons */}
        <button
          onClick={handleComingSoon}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3B82F6] hover:bg-[#2563eb] text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Case</span>
        </button>

        <button
          onClick={handleComingSoon}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1E2A3D] text-[#93A1B5] hover:bg-[#1E2A3D] hover:text-[#E8EEF7] text-sm transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Imaging</span>
        </button>

        <button
          onClick={handleComingSoon}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1E2A3D] text-[#93A1B5] hover:bg-[#1E2A3D] hover:text-[#E8EEF7] text-sm transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Labs</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
