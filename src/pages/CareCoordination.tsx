import React, { useState } from 'react';
import {
  HeartHandshake,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  User,
} from 'lucide-react';
import { agentActivities, careTasks } from '../data/careAgent';
import PageContainer from '../layout/PageContainer';
import {
  Card,
  StatCard,
  Timeline,
  Badge,
  Tag,
  SectionTitle,
} from '../components';

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterType = 'all' | 'analysis' | 'alert' | 'order' | 'consult' | 'documentation';

// ─── Static Data ──────────────────────────────────────────────────────────────

const TEAM_MEMBERS = [
  { initials: 'RS', name: 'Dr. Robert Smith', role: 'Pulmonologist',       status: 'active',     color: '#3B82F6' },
  { initials: 'JO', name: 'Dr. James Osei',     role: 'Infectious Disease',  status: 'active',     color: '#36C28B' },
  { initials: 'SK', name: 'Nurse Sarah Kim',    role: 'Respiratory',         status: 'active',     color: '#6B8AFE' },
  { initials: 'PN', name: 'Dr. Priya Nair',     role: 'Radiology',           status: 'away',       color: '#F4A638' },
  { initials: '?',  name: 'TB Nurse Specialist',role: 'Vacant',              status: 'unassigned', color: '#5E6E85' },
];

const STATUS_DOT: Record<string, string> = {
  active:     '#36C28B',
  away:       '#F4A638',
  unassigned: '#F0476A',
};

const STATUS_LABEL: Record<string, string> = {
  active:     'Active',
  away:       'Away',
  unassigned: 'Vacant',
};

const COMMUNICATIONS = [
  { direction: 'out', sender: 'Care Agent',       recipient: 'Lab System',          message: 'Priority flag set on sputum smear order ENC-789102. AFB collection urgency: STAT.',                                                       timestamp: '10:24 AM' },
  { direction: 'in',  sender: 'Lab System',        recipient: 'Care Agent',          message: 'Acknowledged — STAT order ENC-789102 received. Estimated processing time ~2 hours.',                                                         timestamp: '10:24 AM' },
  { direction: 'out', sender: 'Care Agent',       recipient: 'Pulmonology Dept',     message: 'Urgent referral: Arjun Mehta ENC-789102. TB suspicion 82%. CXR: right upper lobe opacity. Awaiting clinician approval to transmit.',        timestamp: '10:26 AM' },
  { direction: 'in',  sender: 'Pulmonology Dept', recipient: 'Care Agent',          message: 'Referral received. Dr. Robert Smith will review within 30 minutes. Consult slot reserved 11:00 AM.',                                       timestamp: '10:27 AM' },
  { direction: 'out', sender: 'Care Agent',       recipient: 'Infection Control',    message: 'Isolation review triggered for patient PAT-001, Respiratory Ward B. Airborne precaution assessment requested.',                              timestamp: '10:30 AM' },
  { direction: 'in',  sender: 'Infection Control',recipient: 'Care Agent',          message: 'Acknowledged. Physical review scheduled for 11:15 AM. Single-room transfer pre-approved pending confirmation.',                              timestamp: '10:31 AM' },
];

const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
  { label: 'All',           value: 'all'           },
  { label: 'Analysis',      value: 'analysis'      },
  { label: 'Alert',         value: 'alert'         },
  { label: 'Order',         value: 'order'         },
  { label: 'Consult',       value: 'consult'       },
  { label: 'Documentation', value: 'documentation' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter((p) => p.length > 1)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
}

function getPriorityVariant(priority: string): 'critical' | 'warning' | 'caution' | 'muted' {
  if (priority === 'urgent') return 'critical';
  if (priority === 'high')   return 'warning';
  if (priority === 'medium') return 'caution';
  return 'muted';
}

// ─── Task Column ──────────────────────────────────────────────────────────────

interface TaskColumnProps {
  title: string;
  count: number;
  tasks: typeof careTasks;
  dotColor: string;
}

function TaskColumn({ title, count, tasks, dotColor }: TaskColumnProps) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: '#5E6E85' }}>
          {title}
        </span>
        <span
          className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
          style={{ backgroundColor: `${dotColor}22`, color: dotColor }}
        >
          {count}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="rounded-lg border border-[#1E2A3D] bg-[#0F1828] p-3 flex flex-col gap-2"
          >
            <Tag variant={getPriorityVariant(task.priority)}>{task.priority}</Tag>
            <p className="text-xs leading-snug" style={{ color: '#E8EEF7' }}>
              {task.title}
            </p>
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                  style={{ backgroundColor: '#1E2A3D', color: '#93A1B5' }}
                >
                  {getInitials(task.assignee)}
                </div>
                <span className="text-[10px] truncate" style={{ color: '#93A1B5' }}>
                  {task.assignee.split(' ').slice(0, 2).join(' ')}
                </span>
              </div>
              <span className="text-[10px] flex-shrink-0" style={{ color: '#5E6E85' }}>
                {task.dueDate.split(',')[1]?.trim() ?? task.dueDate}
              </span>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div
            className="rounded-lg border border-dashed border-[#1E2A3D] p-4 text-center text-xs"
            style={{ color: '#5E6E85' }}
          >
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const CareCoordination: React.FC = () => {
  const [filterType, setFilterType] = useState<FilterType>('all');

  const filteredActivities =
    filterType === 'all'
      ? agentActivities
      : agentActivities.filter((a) => a.type === filterType);

  const todoTasks       = careTasks.filter((t) => t.status === 'todo');
  const inProgressTasks = careTasks.filter((t) => t.status === 'in-progress');
  const doneTasks       = careTasks.filter((t) => t.status === 'done');

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <SectionTitle
          title="Care Coordination"
          subtitle="Autonomous care agent — coordinating the full clinical pathway in real-time."
          icon={<HeartHandshake size={22} />}
        />
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Tasks Completed" value={8}  color="#36C28B" icon={<CheckCircle size={16} />} />
        <StatCard label="In Progress"     value={3}  color="#3B82F6" icon={<Clock size={16} />} />
        <StatCard label="Overdue"         value={1}  color="#F0476A" icon={<AlertCircle size={16} />} />
        <StatCard label="Messages Sent"   value={12} color="#5E6E85" icon={<MessageSquare size={16} />} />
      </div>

      {/* Main 3-col grid */}
      <div className="grid grid-cols-3 gap-4 mb-4">

        {/* Agent Activity Feed */}
        <Card
          title="Agent Activity Feed"
          badge={filteredActivities.length}
          action={
            <div className="flex gap-1 flex-wrap justify-end">
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilterType(opt.value)}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold transition-colors"
                  style={{
                    backgroundColor: filterType === opt.value ? '#3B82F622' : 'transparent',
                    color:           filterType === opt.value ? '#3B82F6'   : '#5E6E85',
                    border:          `1px solid ${filterType === opt.value ? '#3B82F644' : 'transparent'}`,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          }
        >
          <div className="overflow-y-auto" style={{ maxHeight: 420 }}>
            <Timeline items={filteredActivities} />
          </div>
        </Card>

        {/* Task Board */}
        <Card title="Task Board">
          <div className="flex gap-3 h-full">
            <TaskColumn title="To Do"       count={todoTasks.length}       tasks={todoTasks}       dotColor="#5E6E85" />
            <TaskColumn title="In Progress" count={inProgressTasks.length} tasks={inProgressTasks} dotColor="#3B82F6" />
            <TaskColumn title="Done"        count={doneTasks.length}       tasks={doneTasks}       dotColor="#36C28B" />
          </div>
        </Card>

        {/* Care Team */}
        <Card title="Care Team" action={<User size={14} style={{ color: '#5E6E85' }} />}>
          <div className="flex flex-col gap-1">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.name}
                className="flex items-center gap-3 py-2 border-b border-[#1E2A3D] last:border-0"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: `${member.color}22`, color: member.color }}
                >
                  {member.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium truncate" style={{ color: '#E8EEF7' }}>
                      {member.name}
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: '#5E6E85' }}>
                    {member.role}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: STATUS_DOT[member.status] }}
                  />
                  <Badge color={STATUS_DOT[member.status]} size="sm">
                    {STATUS_LABEL[member.status]}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Communications Log */}
      <Card title="Communications Log">
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 mb-4 text-xs"
          style={{ backgroundColor: '#F4A63810', border: '1px solid #F4A63840', color: '#F4A638' }}
        >
          <MessageSquare size={13} className="flex-shrink-0" />
          <span>
            <strong>Simulated communications</strong> — no real messages are sent.
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          {COMMUNICATIONS.map((msg, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 px-3 py-3 rounded-lg"
              style={{ backgroundColor: idx % 2 === 0 ? '#0F182860' : 'transparent' }}
            >
              <span
                className="text-base font-bold flex-shrink-0 w-4 text-center leading-none mt-0.5"
                style={{ color: msg.direction === 'out' ? '#3B82F6' : '#36C28B' }}
              >
                {msg.direction === 'out' ? '→' : '←'}
              </span>
              <div className="flex-shrink-0 w-36">
                <div className="text-xs font-semibold" style={{ color: '#E8EEF7' }}>
                  {msg.sender}
                </div>
                <div className="text-[11px]" style={{ color: '#5E6E85' }}>
                  → {msg.recipient}
                </div>
              </div>
              <div className="flex-1 text-xs leading-relaxed" style={{ color: '#93A1B5' }}>
                {msg.message}
              </div>
              <div className="flex-shrink-0 text-[11px] whitespace-nowrap pt-0.5" style={{ color: '#5E6E85' }}>
                {msg.timestamp}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </PageContainer>
  );
};

export default CareCoordination;
