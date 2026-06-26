import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ScanLine,
  FlaskConical,
  Brain,
  Zap,
  Shield,
  HeartHandshake,
  FileText,
  Microscope,
  ClipboardList,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ElementType;
  to: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    group: 'Monitor',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
      { label: 'Patients', icon: Users, to: '/patients' },
      { label: 'Imaging', icon: ScanLine, to: '/imaging' },
      { label: 'Labs & Biomarkers', icon: FlaskConical, to: '/labs' },
      { label: 'Risk Engine', icon: Brain, to: '/risk-engine' },
    ],
  },
  {
    group: 'Intelligence',
    items: [
      { label: 'Autonomous Intervention', icon: Zap, to: '/intervention' },
      { label: 'Autonomous Prevention', icon: Shield, to: '/prevention' },
    ],
  },
  {
    group: 'Operate',
    items: [
      { label: 'Care Coordination', icon: HeartHandshake, to: '/care' },
      { label: 'Reports', icon: FileText, to: '/reports' },
      { label: 'Research Mode', icon: Microscope, to: '/research' },
    ],
  },
  {
    group: 'Govern',
    items: [
      { label: 'Audit & Logs', icon: ClipboardList, to: '/audit' },
      { label: 'Administration', icon: Settings, to: '/administration' },
    ],
  },
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="relative flex flex-col h-full bg-[#0B1220] border-r border-[#1E2A3D] shrink-0 transition-[width] duration-200 ease-in-out"
      style={{ width: collapsed ? '64px' : '240px' }}
    >
      {/* Logo area */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#1E2A3D] shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#3B82F6]/15 flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#3B82F6]" strokeWidth={2} />
            </div>
            <span className="text-[#E8EEF7] font-semibold text-sm tracking-wide">
              Scorpius
            </span>
          </div>
        )}
        {collapsed && (
          <div className="w-7 h-7 rounded-md bg-[#3B82F6]/15 flex items-center justify-center mx-auto">
            <Shield className="w-4 h-4 text-[#3B82F6]" strokeWidth={2} />
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV_GROUPS.map((group) => (
          <div key={group.group} className="mb-1">
            {!collapsed && (
              <p className="text-[#5E6E85] text-[10px] font-semibold uppercase tracking-widest px-3 pt-3 pb-1.5">
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
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-3 py-2 px-3 rounded-lg text-sm transition-colors',
                      isActive
                        ? 'bg-[#1a2844] text-[#3B82F6] border-l-2 border-[#3B82F6]'
                        : 'text-[#93A1B5] hover:bg-[#1E2A3D] hover:text-[#E8EEF7] border-l-2 border-transparent',
                      collapsed ? 'justify-center px-0' : '',
                    ].join(' ')
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#1E2A3D] px-3 py-3 shrink-0">
        {!collapsed ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36C28B] shrink-0" />
              <span className="text-[#93A1B5] text-xs">System Status</span>
              <span className="ml-auto text-[#36C28B] text-xs font-medium">
                Operational
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#5E6E85] text-[11px]">Uptime</span>
              <span className="text-[#93A1B5] text-[11px] tabular-nums ml-auto">
                99.9%
              </span>
            </div>
            <div>
              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#F4A638]/15 text-[#F4A638] uppercase tracking-wide">
                Demo
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="w-2 h-2 rounded-full bg-[#36C28B]" title="System Operational" />
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#121C2E] border border-[#1E2A3D] flex items-center justify-center text-[#5E6E85] hover:text-[#E8EEF7] hover:bg-[#1E2A3D] transition-colors z-10"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </aside>
  );
};

export default Sidebar;
