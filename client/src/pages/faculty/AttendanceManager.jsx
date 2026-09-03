import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { academicService } from '../../services/academicService';
import { attendanceService } from '../../services/attendanceService';
import { userService } from '../../services/userService';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Toast from '../../components/common/Toast';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Save,
  Users,
} from 'lucide-react';

export default function AttendanceManager() {
  const [searchParams] = useSearchParams();
  const initialSubjectId = searchParams.get('subjectId') || '';

  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(initialSubjectId);
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Load faculty subjects
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const res = await academicService.getMySubjects();
        if (res.success && res.data?.length > 0) {
          setSubjects(res.data);
          if (!selectedSubjectId) {
            setSelectedSubjectId(res.data[0]._id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSubjects();
  }, []);

  // When subject or date changes, load students and existing records
  useEffect(() => {
    if (!selectedSubjectId) return;

    const loadClassSheet = async () => {
      setLoading(true);
      try {
        const activeSub = subjects.find((s) => s._id === selectedSubjectId);
        const deptId = activeSub?.departmentId?._id || activeSub?.departmentId;
        const sem = activeSub?.semester;

        const [studentsRes, attendanceRes] = await Promise.all([
          academicService.getSubjectStudents(selectedSubjectId),
          attendanceService.getSubjectAttendanceForDate(selectedSubjectId, attendanceDate),
        ]);

        const studentList = studentsRes.data || [];
        setStudents(studentList);

        // Build status map
        const newMap = {};
        studentList.forEach((st) => {
          newMap[st._id] = 'PRESENT'; // default
        });

        if (attendanceRes.success && attendanceRes.data?.length > 0) {
          attendanceRes.data.forEach((rec) => {
            const sid = rec.studentId?._id || rec.studentId;
            if (sid) newMap[sid] = rec.status;
          });
        }

        setAttendanceMap(newMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadClassSheet();
  }, [selectedSubjectId, attendanceDate, subjects]);

  const handleMarkAll = (status) => {
    const updated = {};
    students.forEach((st) => {
      updated[st._id] = status;
    });
    setAttendanceMap(updated);
  };

  const handleStatusToggle = (studentId, status) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const records = Object.entries(attendanceMap).map(([studentId, status]) => ({
        studentId,
        status,
      }));

      await attendanceService.markAttendance({
        subjectId: selectedSubjectId,
        date: attendanceDate,
        records,
      });

      setToastMessage('Attendance saved successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await attendanceService.exportCSV({ subjectId: selectedSubjectId });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance-${attendanceDate}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Export failed');
    }
  };

  if (loading && subjects.length === 0) return <LoadingSkeleton rows={6} />;

  const presentCount = Object.values(attendanceMap).filter((s) => s === 'PRESENT').length;
  const absentCount = Object.values(attendanceMap).filter((s) => s === 'ABSENT').length;

  return (
    <div className="space-y-6">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Attendance Manager</h1>
          <p className="text-xs text-slate-500 mt-1">
            Record lecture sessions, monitor absentee thresholds, and export class rosters
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export Subject CSV
          </button>
          <button
            onClick={handleSave}
            disabled={saving || students.length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </div>

      {/* Control Bar: Subject Selector + Date Picker + Bulk Controls */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">
              Select Teaching Subject
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            >
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.code}) — Sem {s.semester}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">
              Lecture Date
            </label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div className="flex flex-col justify-end">
            <span className="text-xs font-semibold text-slate-700 uppercase mb-1">
              Bulk Quick Actions
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleMarkAll('PRESENT')}
                className="flex-1 px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition-colors"
              >
                All Present
              </button>
              <button
                type="button"
                onClick={() => handleMarkAll('ABSENT')}
                className="flex-1 px-3 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold hover:bg-rose-100 transition-colors"
              >
                All Absent
              </button>
            </div>
          </div>
        </div>

        {/* Live Attendance Counters */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-6 text-xs font-medium text-slate-600">
          <span>
            Total Enrolled: <strong className="text-slate-800">{students.length}</strong>
          </span>
          <span className="text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Present: <strong>{presentCount}</strong>
          </span>
          <span className="text-rose-700 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Absent: <strong>{absentCount}</strong>
          </span>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Student Roster ({students.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Roll Number</th>
                <th className="px-6 py-3.5">Student Name</th>
                <th className="px-6 py-3.5">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.length > 0 ? (
                students.map((st) => {
                  const currentStatus = attendanceMap[st._id] || 'PRESENT';
                  return (
                    <tr key={st._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-700">
                        {st.rollNumber || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800">{st.name}</p>
                        <p className="text-xs text-slate-400">{st.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex rounded-lg border border-slate-200 p-1 bg-slate-50 gap-1">
                          {['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'].map((status) => {
                            const active = currentStatus === status;
                            const btnColor =
                              status === 'PRESENT'
                                ? 'bg-emerald-600 text-white'
                                : status === 'ABSENT'
                                ? 'bg-rose-600 text-white'
                                : status === 'LATE'
                                ? 'bg-amber-600 text-white'
                                : 'bg-slate-700 text-white';

                            return (
                              <button
                                key={status}
                                type="button"
                                onClick={() => handleStatusToggle(st._id, status)}
                                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                                  active
                                    ? btnColor
                                    : 'text-slate-600 hover:bg-slate-200/60'
                                }`}
                              >
                                {status}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-400 text-xs">
                    No students found for this subject's semester/department.
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
