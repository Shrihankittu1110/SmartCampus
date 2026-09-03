import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';

export default function StudentAttendancePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        setLoading(true);
        const res = await attendanceService.getStudentAttendance();
        if (res.success) setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAttendance();
  }, []);

  if (loading) return <LoadingSkeleton rows={6} />;

  const overall = data?.overall || { percentage: 100, status: 'Safe', totalSessions: 0 };
  const subjects = data?.subjectBreakdown || [];
  const recent = data?.recentRecords || [];

  const statusVariant =
    overall.status === 'Safe' ? 'emerald' : overall.status === 'Warning' ? 'amber' : 'rose';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Attendance Dashboard</h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor your lecture attendance across all enrolled subjects and prevent detention warnings
        </p>
      </div>

      {/* Warning alert if Warning or Critical */}
      {overall.status !== 'Safe' && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 ${
            overall.status === 'Critical'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold">
              Attendance Alert: {overall.percentage}% Overall Standing ({overall.status})
            </p>
            <p className="text-xs mt-0.5 leading-relaxed">
              Your class attendance is below the institutional 75% threshold. Detention warnings may be issued for semester examinations.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Attendance"
          value={`${overall.percentage}%`}
          icon={CalendarCheck}
          description={`Standing: ${overall.status}`}
          variant={statusVariant}
        />
        <StatCard
          title="Total Lectures"
          value={overall.totalSessions || 0}
          icon={BookOpen}
          description="Conducted this semester"
          variant="blue"
        />
        <StatCard
          title="Lectures Present"
          value={overall.presentCount || 0}
          icon={CheckCircle2}
          description="Sessions attended"
          variant="emerald"
        />
        <StatCard
          title="Lectures Absent"
          value={overall.absentCount || 0}
          icon={XCircle}
          description="Missed sessions"
          variant="rose"
        />
      </div>

      {/* Subject Breakdown Cards */}
      <div>
        <h2 className="text-base font-bold text-slate-800 mb-3">Subject-Wise Standing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((sub) => (
            <div
              key={sub.subjectId}
              className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="teal" size="sm">
                    {sub.subjectCode}
                  </Badge>
                  <h3 className="font-bold text-slate-800 text-sm mt-1">{sub.subjectName}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-slate-800">{sub.percentage}%</span>
                  <Badge
                    variant={
                      sub.status === 'Safe' ? 'emerald' : sub.status === 'Warning' ? 'amber' : 'rose'
                    }
                    size="sm"
                    className="ml-2"
                  >
                    {sub.status}
                  </Badge>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    sub.percentage >= 75
                      ? 'bg-emerald-500'
                      : sub.percentage >= 65
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, sub.percentage)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>
                  Present: <strong className="text-emerald-700">{sub.present}</strong>
                </span>
                <span>
                  Absent: <strong className="text-rose-700">{sub.absent}</strong>
                </span>
                <span>
                  Total Sessions: <strong>{sub.total}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
          Recent Lecture Log
        </h2>
        <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
          {recent.map((r) => (
            <div key={r._id} className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-slate-800">{r.subjectId?.name || 'Lecture'}</p>
                <p className="text-slate-400 font-mono">
                  {new Date(r.date).toLocaleDateString()}
                </p>
              </div>
              <Badge
                variant={
                  r.status === 'PRESENT'
                    ? 'emerald'
                    : r.status === 'ABSENT'
                    ? 'rose'
                    : r.status === 'LATE'
                    ? 'amber'
                    : 'slate'
                }
              >
                {r.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
