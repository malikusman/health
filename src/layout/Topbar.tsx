import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Search, Bell, ChevronDown, Users, Sun, Moon } from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';

const Topbar: React.FC = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme, colors } = useTheme();
  const handleComingSoon = () => window.alert('Feature coming soon');

  return (
    <header
      className="sticky top-0 z-30 h-16 flex items-center px-6 gap-4 shrink-0"
      style={{ backgroundColor: colors.bgBase, borderBottom: `1px solid ${colors.border}` }}
    >
      {/* Left: Branding */}
      <div className="flex items-center gap-2.5 shrink-0">
        <Shield className="w-5 h-5" style={{ color: '#3B82F6' }} strokeWidth={2} />
        <div className="flex flex-col leading-none">
          <span className="font-semibold text-sm tracking-wide" style={{ color: colors.textPrimary }}>
            SCORPIUS
          </span>
          <span className="hidden sm:block text-[9px] tracking-widest uppercase mt-0.5" style={{ color: colors.textMuted }}>
            Autonomous Clinical Operations
          </span>
        </div>
      </div>

      <div className="w-px h-6 shrink-0" style={{ backgroundColor: colors.border }} />

      {/* Center: Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: colors.textMuted }} strokeWidth={2} />
          <input
            type="text"
            placeholder="Search patients, encounters, alerts..."
            className="w-full rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none transition-colors"
            style={{
              backgroundColor: colors.bgElevated,
              border: `1px solid ${colors.border}`,
              color: colors.textPrimary,
            }}
          />
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2 shrink-0 ml-auto">
        {/* Org selector */}
        <button
          onClick={handleComingSoon}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
          style={{ color: colors.textSecondary }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = colors.border; (e.currentTarget as HTMLElement).style.color = colors.textPrimary; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = colors.textSecondary; }}
        >
          <span>UC Davis Health</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-5" style={{ backgroundColor: colors.border }} />

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg transition-colors"
          style={{ color: colors.textSecondary }}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = colors.border; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button
          onClick={handleComingSoon}
          className="relative p-2 rounded-lg transition-colors"
          style={{ color: colors.textSecondary }}
          aria-label="Notifications"
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = colors.border; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#F0476A] text-white text-[9px] font-semibold flex items-center justify-center leading-none">
            3
          </span>
        </button>

        {/* User chip */}
        <button
          onClick={handleComingSoon}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors"
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = colors.border; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
        >
          <div className="w-7 h-7 rounded-full bg-[#3B82F6] flex items-center justify-center text-white text-xs font-semibold shrink-0">
            RS
          </div>
          <span className="hidden lg:block text-sm font-medium" style={{ color: colors.textPrimary }}>
            Dr. Robert Smith
          </span>
        </button>

        <div className="w-px h-5" style={{ backgroundColor: colors.border }} />

        {/* Action buttons */}
        <button
          onClick={() => navigate('/patients')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3B82F6] hover:bg-[#2563eb] text-white text-sm font-medium transition-colors"
        >
          <Users className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Browse patients</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
