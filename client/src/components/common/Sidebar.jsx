import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  Users,
  Layers,
  BookOpen,
  CalendarCheck,
  FileText,
  Briefcase,
  Calendar,
  Bell,
  UserCheck,
  Shield,
  LogOut,
  Sparkles,
  ClipboardList,
  Award,
  ChevronRight,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const { flashToast } = useToast();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      flashToast('You have been safely logged out of your session.', 'logout', 'Logged Out');
    } catch {
      flashToast('Logged out of your session.', 'logout', 'Logged Out');
    }
    navigate('/login');
  };

  const role = user.role;

  // Role-based navigation links
  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      to: '/dashboard',
      roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'FACULTY', 'STUDENT', 'PLACEMENT_OFFICER'],
    },
    // Super Admin
    {
      label: 'Institutions',
      icon: Building2,
      to: '/admin/institutions',
      roles: ['SUPER_ADMIN'],
    },
    // College Admin & Super Admin
    {
      label: 'User Directory',
      icon: Users,
      to: '/admin/users',
      roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN'],
    },
    {
      label: 'Departments',
      icon: Layers,
      to: '/admin/departments',
      roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN'],
    },
    {
      label: 'Degree Courses',
      icon: BookOpen,
      to: '/admin/courses',
      roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN'],
    },
    {
      label: 'Subjects Curriculum',
      icon: BookOpen,
      to: '/admin/subjects',
      roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'FACULTY'],
    },
    // Faculty
    {
      label: 'Attendance Sheet',
      icon: CalendarCheck,
      to: '/faculty/attendance',
      roles: ['FACULTY', 'COLLEGE_ADMIN'],
    },
    {
      label: 'Coursework & Grades',
      icon: FileText,
      to: '/faculty/assignments',
      roles: ['FACULTY'],
    },
    // Student
    {
      label: 'My Attendance',
      icon: CalendarCheck,
      to: '/student/attendance',
      roles: ['STUDENT'],
    },
    {
      label: 'Assignments',
      icon: FileText,
      to: '/student/assignments',
      roles: ['STUDENT'],
    },
    {
      label: 'Grades & Transcript',
      icon: Award,
      to: '/student/grades',
      roles: ['STUDENT'],
    },
    {
      label: 'AI Study Assistant',
      icon: Sparkles,
      to: '/student/ai-study-assistant',
      roles: ['STUDENT'],
      highlight: true,
    },
    {
      label: 'Placement Drives',
      icon: Briefcase,
      to: '/student/placements',
      roles: ['STUDENT'],
    },
    // Placement Officer
    {
      label: 'Corporate Partners',
      icon: Building2,
      to: '/placement/companies',
      roles: ['PLACEMENT_OFFICER', 'COLLEGE_ADMIN'],
    },
    {
      label: 'Campus Drives',
      icon: Briefcase,
      to: '/placement/drives',
      roles: ['PLACEMENT_OFFICER', 'COLLEGE_ADMIN'],
    },
    {
      label: 'Placement Analytics',
      icon: Award,
      to: '/placement/analytics',
      roles: ['PLACEMENT_OFFICER', 'COLLEGE_ADMIN'],
    },
    // Shared
    {
      label: 'Campus Requests',
      icon: ClipboardList,
      to: '/student/requests',
      roles: ['STUDENT', 'COLLEGE_ADMIN', 'FACULTY'],
    },
    {
      label: 'Events & Schedule',
      icon: Calendar,
      to: '/events',
      roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'FACULTY', 'STUDENT', 'PLACEMENT_OFFICER'],
    },
    {
      label: 'Announcements',
      icon: Bell,
      to: '/announcements',
      roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'FACULTY', 'STUDENT', 'PLACEMENT_OFFICER'],
    },
    {
      label: 'Security Audit Logs',
      icon: Shield,
      to: '/activity-logs',
      roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN'],
    },
  ];

  const visibleItems = navItems.filter((item) => item.roles.includes(role));

  const roleLabels = {
    SUPER_ADMIN: { label: 'Super Admin', color: 'from-purple-500 to-indigo-500' },
    COLLEGE_ADMIN: { label: 'College Admin', color: 'from-indigo-500 to-cyan-500' },
    FACULTY: { label: 'Faculty', color: 'from-teal-500 to-emerald-500' },
    STUDENT: { label: 'Student', color: 'from-cyan-500 to-blue-500' },
    PLACEMENT_OFFICER: { label: 'Placement Cell', color: 'from-amber-500 to-orange-500' },
  };

  const roleMeta = roleLabels[role] || { label: role, color: 'from-slate-500 to-slate-700' };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-950 via-[#0B0F19] to-[#0A0D16] border-r border-slate-800/70 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/25">
              C
            </div>
            <div>
              <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 tracking-tight block">
                CampusFlow
              </span>
              <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase block -mt-1">
                Enterprise Suite
              </span>
            </div>
          </div>
        </div>

        {/* Current User Badge Card */}
        <div className="px-4 py-4">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
              {user.name?.[0] || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r ${roleMeta.color}`} />
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold truncate">
                  {roleMeta.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/25 via-indigo-600/15 to-transparent text-white font-semibold border-l-3 border-indigo-500 shadow-inner'
                      : item.highlight
                      ? 'text-indigo-300 hover:text-white hover:bg-indigo-950/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${
                    item.highlight ? 'text-indigo-400 animate-pulse' : 'text-slate-400 group-hover:text-indigo-400'
                  }`} />
                  <span>{item.label}</span>
                </div>
                {item.highlight && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    AI
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-950/40 border border-slate-800 hover:border-rose-900/50 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
