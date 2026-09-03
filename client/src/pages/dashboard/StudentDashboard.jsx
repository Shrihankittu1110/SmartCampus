import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { analyticsService } from '../../services/analyticsService';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import {
  CalendarCheck,
  FileText,
  Award,
  Briefcase,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Clock,
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
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

  const attendanceStatus = stats?.attendanceStatus || 'Safe';
  const attendanceVariant =
    attendanceStatus === 'Safe' ? 'emerald' : attendanceStatus === 'Warning' ? 'amber' : 'rose';

  return (
    <div className="space-y-7">
      {/* Neo-Vibrant Student Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-[#131127] to-[#1e1b4b] p-7 text-white shadow-xl border border-indigo-900/40">
        {/* Background cosmic light glows */}
        <div className="absolute top-0 right-10 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-60 h-60 bg-violet-600/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
              Student Academic Command
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-xs text-indigo-200/80 max-w-xl leading-relaxed">
              Roll No: <span className="font-mono text-white font-semibold">{user?.rollNumber || 'CS2025001'}</span> • Semester {user?.currentSemester || 4} • Department: {user?.departmentId?.name || 'Computer Science'}
            </p>
          </div>

          <Link
            to="/student/ai-study-assistant"
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 text-white font-bold px-5 py-3 rounded-2xl text-xs shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-102 transition-all group flex-shrink-0"
          >
            <Sparkles className="w-4 h-4 text-cyan-300 group-hover:rotate-12 transition-transform" />
            Launch AI Study Assistant
          </Link>
        </div>
      </div>

      {/* Attendance Warning Banner if Critical or Warning */}
      {attendanceStatus !== 'Safe' && (
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3 shadow-xs ${
            attendanceStatus === 'Critical'
              ? 'bg-rose-50/90 border-rose-200 text-rose-900'
              : 'bg-amber-50/90 border-amber-200 text-amber-900'
          }`}
        >
          <div className={`p-2 rounded-xl flex-shrink-0 ${
            attendanceStatus === 'Critical' ? 'bg-rose-200/60 text-rose-700' : 'bg-amber-200/60 text-amber-700'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold">
              Attendance Alert: {stats?.attendancePercentage}% Standing ({attendanceStatus})
            </p>
            <p className="text-xs mt-0.5 leading-relaxed text-slate-600">
              Your overall class attendance is below the mandatory 75% institutional threshold. Please attend upcoming lectures to prevent exam detention.
            </p>
          </div>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Attendance"
          value={`${stats?.attendancePercentage || 100}%`}
          icon={CalendarCheck}
          description={`Standing: ${attendanceStatus}`}
          variant={attendanceVariant}
          trend={attendanceStatus === 'Safe' ? 'On Track' : 'Alert'}
        />
        <StatCard
          title="Active Problem Sets"
          value={stats?.upcomingAssignmentsCount || 0}
          icon={FileText}
          description="Due in current cycle"
          variant="indigo"
        />
        <StatCard
          title="Placement Drives"
          value={stats?.placementOpportunitiesCount || 0}
          icon={Briefcase}
          description="Live recruiting openings"
          variant="purple"
        />
        <StatCard
          title="Cumulative CGPA"
          value={user?.cgpa || '8.80'}
          icon={Award}
          description="Scale 0.00 – 10.00"
          variant="teal"
          trend="Top 10%"
        />
      </div>

      {/* Two Column Layout: Academic Scorecard & AI Action Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Grades Transcript (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-800">Academic Scorecard</h2>
              <p className="text-xs text-slate-400">Current semester evaluated coursework</p>
            </div>
            <Link
              to="/student/grades"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
            >
              Full Transcript <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {stats?.recentGrades?.length > 0 ? (
              stats.recentGrades.map((g) => (
                <div key={g._id} className="py-3.5 flex items-center justify-between hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {g.subjectId?.name || 'Subject'}
                    </p>
                    <p className="text-xs text-slate-400">Code: {g.subjectId?.code || 'N/A'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-slate-800">{g.marks}%</span>
                    <Badge variant="indigo" size="sm">
                      Grade {g.grade}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-xs text-slate-400">No grades recorded yet.</p>
            )}
          </div>
        </div>

        {/* AI & Placements Quick Hub (1 col) */}
        <div className="space-y-4">
          {/* AI Study Planner Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-[#1e1b4b] to-violet-950 p-6 text-white shadow-md border border-indigo-500/30">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Cognitive Study Engine
            </div>
            <h3 className="text-lg font-bold mt-2 text-white">
              7-Day Exam Revision Planner
            </h3>
            <p className="text-xs text-indigo-200/80 mt-1 leading-relaxed">
              Synthesize custom schedules, target weak subject areas, and prepare with verified references.
            </p>
            <Link
              to="/student/ai-study-assistant"
              className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-300 to-indigo-300 hover:brightness-105 px-4 py-2.5 rounded-xl transition-all shadow-md"
            >
              Generate Revision Plan <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Placements Shortcut Card */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Career Center
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Recruitment Drives</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Automated eligibility matching against top hiring partners.
              </p>
            </div>
            <Link
              to="/student/placements"
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100/80 rounded-xl transition-colors"
            >
              Explore Job Openings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
