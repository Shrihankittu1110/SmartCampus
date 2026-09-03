import React, { useState, useEffect } from 'react';
import { academicService } from '../../services/academicService';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Award, BookOpen, CheckCircle, TrendingUp } from 'lucide-react';

export default function StudentGradesPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGrades = async () => {
      try {
        setLoading(true);
        const res = await academicService.getStudentGrades();
        if (res.success) setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadGrades();
  }, []);

  if (loading) return <LoadingSkeleton rows={6} />;

  const summary = data?.summary || { totalSubjects: 0, totalCredits: 0, cgpa: 8.8 };
  const grades = data?.grades || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Academic Transcript & Grades</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review official semester marks, cumulative grade point average, and credit audit
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Cumulative CGPA"
          value={summary.cgpa}
          icon={Award}
          description="Scale 0.00 – 10.00"
          variant="teal"
        />
        <StatCard
          title="Credits Earned"
          value={summary.totalCredits}
          icon={BookOpen}
          description="Accredited academic units"
          variant="blue"
        />
        <StatCard
          title="Subjects Completed"
          value={summary.totalSubjects}
          icon={CheckCircle}
          description="Evaluated coursework"
          variant="emerald"
        />
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Official Grade Sheet
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Subject Code</th>
                <th className="px-6 py-3.5">Subject Title</th>
                <th className="px-6 py-3.5">Semester</th>
                <th className="px-6 py-3.5">Credits</th>
                <th className="px-6 py-3.5">Marks Obtained</th>
                <th className="px-6 py-3.5">Letter Grade</th>
                <th className="px-6 py-3.5">Grade Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grades.length > 0 ? (
                grades.map((g) => (
                  <tr key={g._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-700">
                      {g.subjectId?.code || '—'}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {g.subjectId?.name || 'Subject'}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">Sem {g.semester}</td>
                    <td className="px-6 py-4 text-xs text-slate-600">{g.subjectId?.credits || 3}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{g.marks}%</td>
                    <td className="px-6 py-4">
                      <Badge variant="teal" size="sm">
                        Grade {g.grade}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{g.gradePoint}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-xs text-slate-400">
                    No grades published yet for your academic profile.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
