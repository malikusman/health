import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, ScanLine, FlaskConical, Brain,
  Zap, Shield, HeartHandshake, FileText, Microscope,
  ClipboardList, Settings, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';

interface NavItem { label: string; icon: React.ElementType; to: string }
interface NavGroup { group: string; items: NavItem[] }

const NAV_GROUPS: NavGroup[] = [
  {
    group: 'Worklist',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
      { label: 'Patients', icon: Users, to: '/patients' },
      { label: 'CT Imaging', icon: ScanLine, to: '/imaging' },
      { label: 'Labs & Biomarkers', icon: FlaskConical, to: '/labs' },
      { label: 'Risk Engine', icon: Brain, to: '/risk-engine' },
    ],
  },
  {
    group: 'Agentic AI · Coming Soon',
    items: [
      { label: 'Autonomous Intervention', icon: Zap, to: '/intervention' },
      { label: 'Autonomous Prevention', icon: Shield, to: '/prevention' },
      { label: 'Care Coordination', icon: HeartHandshake, to: '/care' },
    ],
  },
  {
    group: 'Intelligence',
    items: [
      { label: 'Research Mode', icon: Microscope, to: '/research' },
    ],
  },
  {
    group: 'Governance',
    items: [
      { label: 'Reports', icon: FileText, to: '/reports' },
      { label: 'Audit & Logs', icon: ClipboardList, to: '/audit' },
      { label: 'Administration', icon: Settings, to: '/administration' },
    ],
  },
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { colors } = useTheme();

  return (
    <aside
      className="relative flex flex-col h-full shrink-0 transition-[width] duration-200 ease-in-out"
      style={{
        width: collapsed ? '64px' : '240px',
        backgroundColor: colors.bgBase,
        borderRight: `1px solid ${colors.border}`,
      }}
    >
      <div
        className="h-16 flex items-center justify-between px-4 shrink-0"
        style={{ borderBottom: `1px solid ${colors.border}` }}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: '#3B82F620' }}>
              <Shield className="w-4 h-4" style={{ color: '#3B82F6' }} strokeWidth={2} />
            </div>
            <span className="font-semibold text-sm tracking-wide" style={{ color: colors.textPrimary }}>
              Scorpius
            </span>
          </div>
        )}
        {collapsed && (
          <div className="w-7 h-7 rounded-md flex items-center justify-center mx-auto" style={{ backgroundColor: '#3B82F620' }}>
            <Shield className="w-4 h-4" style={{ color: '#3B82F6' }} strokeWidth={2} />
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV_GROUPS.map((group) => (
          <div key={group.group} className="mb-1">
            {!collapsed && (
              <p className="text-[10px] font-semibold uppercase tracking-widest px-3 pt-3 pb-1.5" style={{ color: colors.textMuted }}>
                {group.group}
              </p>
            )}
            {collapsed && <div className="h-3" />}
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  title={collapsed ? item.label : undefined}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: collapsed ? 0 : 12,
                    justifyContent: collapsed ? 'center' : undefined,
                    padding: collapsed ? '8px 0' : '8px 12px',
                    borderRadius: 8,
                    fontSize: 14,
                    textDecoration: 'none',
                    transition: 'background 0.15s, color 0.15s',
                    marginBottom: 2,
                    borderLeft: isActive ? `2px solid #3B82F6` : `2px solid transparent`,
                    backgroundColor: isActive ? '#3B82F615' : 'transparent',
                    color: isActive ? '#3B82F6' : colors.textSecondary,
                  })}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    if (!el.style.color.includes('3B82F6')) {
                      el.style.backgroundColor = colors.border;
                      el.style.color = colors.textPrimary;
                    }
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    if (!el.style.borderLeft.includes('3B82F6')) {
                      el.style.backgroundColor = 'transparent';
                      el.style.color = colors.textSecondary;
                    }
                  }}
                >
                  <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="px-3 py-3 shrink-0" style={{ borderTop: `1px solid ${colors.border}` }}>
        {!collapsed ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36C28B] shrink-0" />
              <span className="text-xs" style={{ color: colors.textSecondary }}>System Status</span>
              <span className="ml-auto text-xs font-medium text-[#36C28B]">Operational</span>
            </div>
            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-[#3B82F6]/15 text-[#3B82F6]">
              Pilot · Research
            </span>
            <p className="text-[10px] leading-snug" style={{ color: colors.textMuted }}>
              Agentic workflows coming soon
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="w-2 h-2 rounded-full bg-[#36C28B]" title="Operational" />
          </div>
        )}
      </div>

      <button
        onClick={() => setCollapsed(c => !c)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center z-10 transition-colors"
        style={{
          backgroundColor: colors.bgSurface,
          border: `1px solid ${colors.border}`,
          color: colors.textMuted,
        }}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
};

export default Sidebar;
