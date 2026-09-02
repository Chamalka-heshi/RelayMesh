import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  Video,
  Plus,
  Play,
  Pause,
  Square,
  Code2,
  Workflow,
  Sparkles,
  Zap,
  Globe2
} from 'lucide-react';

export default function DonezoDashboard({ onNavigate }) {
  // Timer State for Time Tracker Card
  const [seconds, setSeconds] = useState(5048); // 01:24:08 in seconds
  const [isRunning, setIsRunning] = useState(true);

  // Modal / Feedback state
  const [modalType, setModalType] = useState(null); // 'addProject', 'addMember', 'newTask', 'meeting'

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTimer = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const projectsList = [
    {
      id: 1,
      title: 'Develop API Endpoints',
      dueDate: 'Nov 26, 2024',
      icon: Code2,
      iconBg: '#EEF2FF',
      iconColor: '#4F46E5',
    },
    {
      id: 2,
      title: 'Onboarding Flow',
      dueDate: 'Nov 28, 2024',
      icon: Workflow,
      iconBg: '#ECFDF5',
      iconColor: '#059669',
    },
    {
      id: 3,
      title: 'Build Dashboard',
      dueDate: 'Nov 30, 2024',
      icon: Sparkles,
      iconBg: '#FEF3C7',
      iconColor: '#D97706',
    },
    {
      id: 4,
      title: 'Optimize Page Load',
      dueDate: 'Dec 5, 2024',
      icon: Zap,
      iconBg: '#FFEDD5',
      iconColor: '#EA580C',
    },
    {
      id: 5,
      title: 'Cross-Browser Testing',
      dueDate: 'Dec 6, 2024',
      icon: Globe2,
      iconBg: '#F3E8FF',
      iconColor: '#9333EA',
    },
  ];

  const teamMembers = [
    {
      id: 1,
      name: 'Alexandra Deff',
      task: 'Working on Github Project Repository',
      status: 'Completed',
      statusType: 'completed',
      avatarBg: '#FCA5A5',
      emoji: '👩‍💻',
    },
    {
      id: 2,
      name: 'Edwin Adenike',
      task: 'Working on Integrate User Authentication System',
      status: 'In Progress',
      statusType: 'in-progress',
      avatarBg: '#86EFAC',
      emoji: '👨‍💼',
    },
    {
      id: 3,
      name: 'Isaac Oluwatemilorun',
      task: 'Working on Develop Search and Filter Functionality',
      status: 'Pending',
      statusType: 'pending',
      avatarBg: '#93C5FD',
      emoji: '👨‍🔧',
    },
    {
      id: 4,
      name: 'David Oshodi',
      task: 'Working on Responsive Layout for Homepage',
      status: 'In Progress',
      statusType: 'in-progress',
      avatarBg: '#FDE047',
      emoji: '👨‍🎨',
    },
  ];

  return (
    <div className="donezo-dashboard-wrapper">
      {/* SVG Definitions for Diagonal Striped Patterns & Gradients */}
      <svg width="0" height="0" className="absolute hidden">
        <defs>
          <pattern id="diagonalStripes" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#D1D5DB" strokeWidth="2.5" />
          </pattern>
          <pattern id="gaugeStripes" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#9CA3AF" strokeWidth="2" />
          </pattern>
          <linearGradient id="mintBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#48BB78" />
            <stop offset="100%" stopColor="#38A169" />
          </linearGradient>
        </defs>
      </svg>

      {/* Header Row */}
      <div className="donezo-header-row">
        <div className="donezo-title-group">
          <h1 className="donezo-page-title">Dashboard</h1>
          <p className="donezo-page-subtitle">Plan, prioritize, and accomplish your tasks with ease.</p>
        </div>

        <div className="donezo-header-actions">
          <button
            onClick={() => setModalType('addProject')}
            className="donezo-btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
          <button
            onClick={() => alert('Importing project data from Jira/Trello/CSV...')}
            className="donezo-btn-outline"
          >
            <span>Import Data</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="donezo-kpi-grid">
        {/* Card 1: Total Projects (Featured Solid Forest Green Card) */}
        <div className="donezo-kpi-card donezo-kpi-featured">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Total Projects</span>
            <button className="donezo-kpi-arrow-circle" title="View all projects">
              <ArrowUpRight className="w-4 h-4 text-emerald-950" />
            </button>
          </div>
          <div className="donezo-kpi-number">24</div>
          <div className="donezo-kpi-pill-badge">
            <span className="donezo-badge-square">5 ▵</span>
            <span>Increased from last month</span>
          </div>
        </div>

        {/* Card 2: Ended Projects (White Card) */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Ended Projects</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-slate-900">10</div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light">6 ▵</span>
            <span>Increased from last month</span>
          </div>
        </div>

        {/* Card 3: Running Projects (White Card) */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Running Projects</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-slate-900">12</div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light">2 ▵</span>
            <span>Increased from last month</span>
          </div>
        </div>

        {/* Card 4: Pending Project (White Card) */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Pending Project</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-slate-900">2</div>
          <div className="donezo-kpi-status-text">
            <span>On Discuss</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Project Analytics (Bar Chart), Reminders, Projects List */}
      <div className="donezo-middle-grid">
        {/* Card 1: Project Analytics */}
        <div className="donezo-card donezo-analytics-card">
          <div className="donezo-card-header">
            <h3 className="donezo-card-title">Project Analytics</h3>
          </div>

          <div className="donezo-barchart-container">
            {/* 7 Weekday Capsule Bars */}
            <div className="donezo-bar-col">
              <div className="donezo-bar-track">
                <div className="donezo-bar-fill donezo-bar-striped" style={{ height: '52%' }} />
              </div>
              <span className="donezo-bar-day">S</span>
            </div>

            <div className="donezo-bar-col">
              <div className="donezo-bar-track">
                <div className="donezo-bar-fill donezo-bar-green" style={{ height: '78%' }} />
              </div>
              <span className="donezo-bar-day">M</span>
            </div>

            <div className="donezo-bar-col relative">
              {/* Floating Tooltip Pill */}
              <div className="donezo-bar-tooltip">74%</div>
              <div className="donezo-bar-track">
                <div className="donezo-bar-fill donezo-bar-mint" style={{ height: '68%' }} />
              </div>
              <span className="donezo-bar-day">T</span>
            </div>

            <div className="donezo-bar-col">
              <div className="donezo-bar-track">
                <div className="donezo-bar-fill donezo-bar-forest" style={{ height: '94%' }} />
              </div>
              <span className="donezo-bar-day">W</span>
            </div>

            <div className="donezo-bar-col">
              <div className="donezo-bar-track">
                <div className="donezo-bar-fill donezo-bar-striped" style={{ height: '62%' }} />
              </div>
              <span className="donezo-bar-day">T</span>
            </div>

            <div className="donezo-bar-col">
              <div className="donezo-bar-track">
                <div className="donezo-bar-fill donezo-bar-striped" style={{ height: '48%' }} />
              </div>
              <span className="donezo-bar-day">F</span>
            </div>

            <div className="donezo-bar-col">
              <div className="donezo-bar-track">
                <div className="donezo-bar-fill donezo-bar-striped" style={{ height: '58%' }} />
              </div>
              <span className="donezo-bar-day">S</span>
            </div>
          </div>
        </div>

        {/* Card 2: Reminders */}
        <div className="donezo-card donezo-reminders-card">
          <div className="donezo-card-header">
            <h3 className="donezo-card-title">Reminders</h3>
          </div>

          <div className="donezo-reminder-body">
            <h4 className="donezo-reminder-event">Meeting with Arc Company</h4>
            <p className="donezo-reminder-time">Time : 02.00 pm - 04.00 pm</p>

            <button
              onClick={() => setModalType('meeting')}
              className="donezo-btn-meeting"
            >
              <Video className="w-4 h-4" />
              <span>Start Meeting</span>
            </button>
          </div>
        </div>

        {/* Card 3: Project (Task List) */}
        <div className="donezo-card donezo-project-card">
          <div className="donezo-card-header flex items-center justify-between">
            <h3 className="donezo-card-title">Project</h3>
            <button
              onClick={() => setModalType('newTask')}
              className="donezo-btn-small-outline"
            >
              <Plus className="w-3 h-3" />
              <span>New</span>
            </button>
          </div>

          <div className="donezo-project-list">
            {projectsList.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="donezo-project-item">
                  <div
                    className="donezo-project-icon-box"
                    style={{ backgroundColor: item.iconBg, color: item.iconColor }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="donezo-project-info">
                    <div className="donezo-project-name">{item.title}</div>
                    <div className="donezo-project-due">Due date: {item.dueDate}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row: Team Collaboration, Project Progress (Gauge), Time Tracker */}
      <div className="donezo-bottom-grid">
        {/* Card 1: Team Collaboration */}
        <div className="donezo-card donezo-team-card">
          <div className="donezo-card-header flex items-center justify-between">
            <h3 className="donezo-card-title">Team Collaboration</h3>
            <button
              onClick={() => setModalType('addMember')}
              className="donezo-btn-small-outline"
            >
              <Plus className="w-3 h-3" />
              <span>Add Member</span>
            </button>
          </div>

          <div className="donezo-team-list">
            {teamMembers.map((m) => (
              <div key={m.id} className="donezo-team-item">
                <div className="donezo-team-avatar" style={{ backgroundColor: m.avatarBg }}>
                  <span className="donezo-avatar-emoji">{m.emoji}</span>
                </div>
                <div className="donezo-team-info">
                  <div className="donezo-team-name">{m.name}</div>
                  <div className="donezo-team-task">{m.task}</div>
                </div>
                <div className={`donezo-status-badge badge-${m.statusType}`}>
                  {m.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Project Progress (Semi-Circular Donut Gauge) */}
        <div className="donezo-card donezo-progress-card">
          <div className="donezo-card-header">
            <h3 className="donezo-card-title">Project Progress</h3>
          </div>

          <div className="donezo-gauge-container">
            <div className="donezo-gauge-svg-wrap">
              <svg viewBox="0 0 200 115" className="donezo-gauge-svg">
                {/* Background Track Arc (Semi Circle) */}
                <path
                  d="M 25 105 A 75 75 0 0 1 175 105"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="24"
                  strokeLinecap="round"
                />

                {/* Striped Arc for Pending */}
                <path
                  d="M 25 105 A 75 75 0 0 1 175 105"
                  fill="none"
                  stroke="url(#gaugeStripes)"
                  strokeWidth="24"
                  strokeLinecap="round"
                />

                {/* In Progress Arc (Deep Forest Green) */}
                <path
                  d="M 25 105 A 75 75 0 0 1 145 40"
                  fill="none"
                  stroke="#164E37"
                  strokeWidth="24"
                  strokeLinecap="round"
                />

                {/* Completed Arc (Mint Green) */}
                <path
                  d="M 25 105 A 75 75 0 0 1 80 45"
                  fill="none"
                  stroke="#38A169"
                  strokeWidth="24"
                  strokeLinecap="round"
                />
              </svg>

              {/* Gauge Center Text */}
              <div className="donezo-gauge-center-text">
                <span className="donezo-gauge-percent">41%</span>
                <span className="donezo-gauge-sub">Project Ended</span>
              </div>
            </div>

            {/* Gauge Legends */}
            <div className="donezo-gauge-legends">
              <div className="donezo-legend-item">
                <span className="donezo-legend-dot bg-emerald-500" />
                <span>Completed</span>
              </div>
              <div className="donezo-legend-item">
                <span className="donezo-legend-dot bg-emerald-900" />
                <span>In Progress</span>
              </div>
              <div className="donezo-legend-item">
                <span className="donezo-legend-dot donezo-dot-striped" />
                <span>Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Time Tracker */}
        <div className="donezo-card donezo-timetracker-card">
          {/* Abstract background mesh waves overlay */}
          <div className="donezo-timetracker-mesh" />

          <div className="donezo-timetracker-content">
            <span className="donezo-timetracker-label">Time Tracker</span>

            <div className="donezo-timetracker-display">
              {formatTimer(seconds)}
            </div>

            <div className="donezo-timetracker-controls">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="donezo-timer-btn-pause"
                title={isRunning ? 'Pause Timer' : 'Resume Timer'}
              >
                {isRunning ? (
                  <Pause className="w-5 h-5 text-slate-900 fill-slate-900" />
                ) : (
                  <Play className="w-5 h-5 text-slate-900 fill-slate-900 ml-0.5" />
                )}
              </button>

              <button
                onClick={() => {
                  setIsRunning(false);
                  setSeconds(0);
                }}
                className="donezo-timer-btn-stop"
                title="Stop and Reset Timer"
              >
                <Square className="w-4 h-4 text-white fill-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal for Actions */}
      {modalType && (
        <div className="donezo-modal-overlay" onClick={() => setModalType(null)}>
          <div className="donezo-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              {modalType === 'addProject' && 'Create New Project'}
              {modalType === 'addMember' && 'Invite Team Member'}
              {modalType === 'newTask' && 'Add Project Task'}
              {modalType === 'meeting' && 'Meeting in Progress'}
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              {modalType === 'meeting'
                ? 'Connecting to high-definition video room: Meeting with Arc Company.'
                : 'Fill in details to organize your workspace and coordinate tasks.'}
            </p>

            {modalType === 'meeting' ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-emerald-900 font-bold text-sm">Room encrypted & ready: 02:00 PM - 04:00 PM</span>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title / Name</label>
                  <input
                    type="text"
                    placeholder="Enter title..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-700"
                    defaultValue={modalType === 'addMember' ? 'Sarah Jenkins' : 'New Strategic Initiative'}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Due Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-700"
                    defaultValue="2024-12-15"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalType(null)}
                className="px-5 py-2.5 rounded-full border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert('Action submitted successfully!');
                  setModalType(null);
                }}
                className="px-6 py-2.5 rounded-full bg-[#164E37] text-white text-sm font-bold hover:bg-[#0E3B27]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
