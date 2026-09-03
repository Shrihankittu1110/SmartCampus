import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService';
import StatCard from '../../components/common/StatCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import {
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  Calendar,
  Briefcase,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Building,
} from 'lucide-react';

export default function CollegeAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const res = await analyticsService.getDashboardStats();
        if (res.success) setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <LoadingSkeleton rows={6} />;

  return (
    <div className="space-y-7">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-[#0F172A] to-[#1E1B4B] p-7 text-white shadow-xl border border-indigo-900/40">
        <div className="absolute top-0 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-xs">
              <Building className="w-3.5 h-3.5" />
              Institutional Administrative Command
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Campus Operations & Resource Center
            </h1>
            <p className="text-xs text-indigo-200/80 max-w-xl leading-relaxed">
              Manage academic faculties, courses, student records, attendance reports, and campus-wide operations.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={GraduationCap}
          description="Active enrolled learners"
          variant="indigo"
          trend="+12% YoY"
        />
        <StatCard
          title="Faculty Members"
          value={stats?.totalFaculty || 0}
          icon={Users}
          description="Professors & Lecturers"
          variant="blue"
        />
        <StatCard
          title="Departments"
          value={stats?.totalDepartments || 0}
          icon={Layers}
          description="Accredited divisions"
          variant="purple"
        />
        <StatCard
          title="Degree Courses"
          value={stats?.totalCourses || 0}
          icon={BookOpen}
          description="Degree programs"
          variant="teal"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Requests"
          value={stats?.pendingRequests || 0}
          icon={ClipboardList}
          description="Awaiting admin approval"
          variant="amber"
        />
        <StatCard
          title="Upcoming Events"
          value={stats?.upcomingEvents || 0}
          icon={Calendar}
          description="Symposiums & exams"
          variant="blue"
        />
        <StatCard
          title="Partner Companies"
          value={stats?.totalCompanies || 0}
          icon={Briefcase}
          description="On-campus recruiters"
          variant="teal"
        />
        <StatCard
          title="Students Placed"
          value={stats?.totalPlaced || 0}
          icon={GraduationCap}
          description="Offers accepted"
          variant="emerald"
        />
      </div>

      {/* Administrative Workspaces Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-800">Administrative Workspaces</h2>
            <p className="text-xs text-slate-400">Direct shortcuts to critical operational tasks</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/admin/users"
            className="p-5 rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50/70 hover:to-indigo-50/40 hover:border-indigo-300 transition-all flex items-center justify-between group shadow-2xs hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-sm">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  User Directory
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Faculty, staff & students</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            to="/admin/departments"
            className="p-5 rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50/70 hover:to-purple-50/40 hover:border-purple-300 transition-all flex items-center justify-between group shadow-2xs hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-sm">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
                  Departments
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Heads, faculties & labs</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            to="/faculty/attendance"
            className="p-5 rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50/70 hover:to-emerald-50/40 hover:border-emerald-300 transition-all flex items-center justify-between group shadow-2xs hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                  Attendance Reports
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Institutional analytics & CSV</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            to="/student/requests"
            className="p-5 rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50/70 hover:to-amber-50/40 hover:border-amber-300 transition-all flex items-center justify-between group shadow-2xs hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 group-hover:text-amber-600 transition-colors">
                  Student Requests
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Bonafide & leave approvals</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            to="/placement/drives"
            className="p-5 rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50/70 hover:to-cyan-50/40 hover:border-cyan-300 transition-all flex items-center justify-between group shadow-2xs hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 group-hover:text-cyan-600 transition-colors">
                  Placement Hub
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Recruitment drives & offers</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            to="/activity-logs"
            className="p-5 rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50/70 hover:to-slate-100 hover:border-slate-300 transition-all flex items-center justify-between group shadow-2xs hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                  Security Audit Logs
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Compliance & activity trails</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
