import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService';
import { aiService } from '../../services/aiService';
import { userService } from '../../services/userService';
import { academicService } from '../../services/academicService';
import StatCard from '../../components/common/StatCard';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import {
  BookOpen,
  CalendarCheck,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  UserCheck,
  GraduationCap,
} from 'lucide-react';

export default function FacultyDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // AI Modal state
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [aiSummary, setAiSummary] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const statsRes = await analyticsService.getDashboardStats();
        if (statsRes.success) {
          setStats(statsRes.data);
          let studentList = [];

          // Fetch accurate students enrolled in faculty's assigned subjects
          if (statsRes.data?.assignedSubjects?.length > 0) {
            const primarySub = statsRes.data.assignedSubjects[0];
            try {
              const subStudentsRes = await academicService.getSubjectStudents(primarySub._id);
              if (subStudentsRes.success && subStudentsRes.data?.length > 0) {
                studentList = subStudentsRes.data;
              }
            } catch (e) {
              console.error(e);
            }
          }

          // Fallback to department student list if needed
          if (studentList.length === 0) {
            const studentsRes = await userService.getAll({ role: 'STUDENT', limit: 50 });
            if (studentsRes.success) studentList = studentsRes.data || [];
          }

          setStudents(studentList);
          if (studentList.length > 0) {
            setSelectedStudentId(studentList[0]._id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const handleRunAISummary = async () => {
    if (!selectedStudentId) return;
    setAiLoading(true);
    setAiSummary(null);
    try {
      const res = await aiService.getPerformanceSummary(selectedStudentId);
      if (res.success) setAiSummary(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate AI performance summary');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton rows={6} />;

  return (
    <div className="space-y-7">
      {/* Executive Faculty Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-[#0c1b26] to-[#042f2e] p-7 text-white shadow-xl border border-teal-900/40">
        <div className="absolute top-0 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
              Faculty Instructional Command
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Academic & Classroom Portal
            </h1>
            <p className="text-xs text-teal-200/80 max-w-xl leading-relaxed">
              Record daily lecture attendances, evaluate student submissions, and leverage AI to diagnose student strengths and learning gaps.
            </p>
          </div>

          <button
            onClick={() => setIsAIModalOpen(true)}
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-2xl text-xs shadow-lg shadow-teal-500/20 hover:scale-102 transition-all cursor-pointer flex-shrink-0"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            AI Student Performance Summary
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Assigned Subjects"
          value={stats?.assignedSubjectsCount || 0}
          icon={BookOpen}
          description="Active teaching curriculum"
          variant="teal"
        />
        <StatCard
          title="Assignments Created"
          value={stats?.assignmentsCreated || 0}
          icon={FileText}
          description="Current semester problem sets"
          variant="indigo"
        />
        <StatCard
          title="Pending Submissions"
          value={stats?.pendingGrading || 0}
          icon={Clock}
          description="Awaiting evaluation & marks"
          variant="amber"
        />
      </div>

      {/* Assigned Subjects Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-800">My Assigned Courses & Classes</h2>
            <p className="text-xs text-slate-400">Classroom sessions and coursework</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats?.assignedSubjects?.map((sub) => (
            <div
              key={sub._id}
              className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/40 hover:bg-slate-50/90 transition-all flex flex-col justify-between hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <Badge variant="teal">{sub.code}</Badge>
                  <span className="text-xs font-semibold text-slate-500">
                    Semester {sub.semester} • {sub.credits} Credits
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 text-base mt-2.5">{sub.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {sub.description || 'Core subject covering theoretical principles, algorithms, and lab coursework.'}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200/70 flex items-center justify-between">
                <Link
                  to={`/faculty/attendance?subjectId=${sub._id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200/60 transition-colors"
                >
                  <CalendarCheck className="w-4 h-4" /> Mark Attendance
                </Link>
                <Link
                  to={`/faculty/assignments?subjectId=${sub._id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600"
                >
                  <FileText className="w-4 h-4" /> Coursework
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Performance Summarizer Modal */}
      <Modal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        title="AI Student Performance Diagnostics"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Synthesizes attendance history, internal coursework grades, and examination records into an actionable academic report.
          </p>

          <div className="flex items-center gap-3">
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            >
              {students.map((st) => (
                <option key={st._id} value={st._id}>
                  {st.name} ({st.rollNumber || 'No Roll'}) — CGPA: {st.cgpa || 'N/A'}
                </option>
              ))}
            </select>
            <button
              onClick={handleRunAISummary}
              disabled={aiLoading}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {aiLoading ? 'Synthesizing...' : 'Generate Report'}
            </button>
          </div>

          {aiSummary && (
            <div className="mt-4 p-5 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                <div>
                  <h4 className="font-bold text-sm text-slate-800">{aiSummary.studentName}</h4>
                  <p className="text-slate-500">Diagnostic Academic Summary</p>
                </div>
                <Badge
                  variant={
                    aiSummary.attendanceStatus === 'Safe'
                      ? 'emerald'
                      : aiSummary.attendanceStatus === 'Warning'
                      ? 'amber'
                      : 'rose'
                  }
                >
                  {aiSummary.attendanceStatus} Standing ({aiSummary.attendanceRate}%)
                </Badge>
              </div>

              <div>
                <p className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
                  Executive Summary
                </p>
                <p className="text-slate-600 mt-1 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-2xs">
                  {aiSummary.summaryText}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50/80 border border-emerald-100 p-3.5 rounded-xl">
                  <p className="font-bold text-emerald-800">Key Strengths</p>
                  <ul className="mt-1 space-y-1 text-emerald-700">
                    {aiSummary.strongSubjects.map((s, i) => (
                      <li key={i}>• {s.subject} ({s.averageMarks}%)</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-rose-50/80 border border-rose-100 p-3.5 rounded-xl">
                  <p className="font-bold text-rose-800">Areas For Intervention</p>
                  <ul className="mt-1 space-y-1 text-rose-700">
                    {aiSummary.weakSubjects.map((w, i) => (
                      <li key={i}>• {w.subject} ({w.averageMarks}%)</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <p className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
                  Recommended Next Steps
                </p>
                <ul className="mt-1 space-y-1 text-slate-600">
                  {aiSummary.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
