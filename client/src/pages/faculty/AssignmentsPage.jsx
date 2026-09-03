import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { assignmentService } from '../../services/assignmentService';
import { academicService } from '../../services/academicService';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Toast from '../../components/common/Toast';
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  Download,
  Award,
  AlertCircle,
} from 'lucide-react';

export default function AssignmentsPage() {
  const [searchParams] = useSearchParams();
  const subjectFilter = searchParams.get('subjectId');

  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Grading state
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [gradeMarks, setGradeMarks] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [requestResubmission, setRequestResubmission] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectId: '',
    dueDate: '',
    maxMarks: 100,
    allowResubmission: true,
  });
  const [attachmentFiles, setAttachmentFiles] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (subjectFilter) params.subjectId = subjectFilter;

      const [aRes, sRes] = await Promise.all([
        assignmentService.getAll(params),
        academicService.getMySubjects(),
      ]);
      if (aRes.success) setAssignments(aRes.data);
      if (sRes.success) {
        setSubjects(sRes.data);
        if (sRes.data.length > 0 && !formData.subjectId) {
          setFormData((prev) => ({ ...prev, subjectId: sRes.data[0]._id }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [subjectFilter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('subjectId', formData.subjectId);
      data.append('dueDate', formData.dueDate);
      data.append('maxMarks', formData.maxMarks);
      data.append('allowResubmission', formData.allowResubmission);

      if (attachmentFiles) {
        for (let i = 0; i < attachmentFiles.length; i++) {
          data.append('attachments', attachmentFiles[i]);
        }
      }

      await assignmentService.create(data);
      setIsCreateModalOpen(false);
      setToastMessage('Assignment published successfully!');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create assignment');
    }
  };

  const handleOpenSubmissions = async (assignment) => {
    setSelectedAssignment(assignment);
    setIsReviewModalOpen(true);
    setSubmissionsLoading(true);
    try {
      const res = await assignmentService.getSubmissions(assignment._id);
      if (res.success) setSubmissions(res.data || []);
    } catch (err) {
      alert('Failed to load submissions');
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    try {
      await assignmentService.gradeSubmission(gradingSubmission._id, {
        marks: Number(gradeMarks),
        feedback: gradeFeedback,
        requestResubmission,
      });

      setToastMessage('Submission graded successfully!');
      setGradingSubmission(null);
      // Reload submissions
      const res = await assignmentService.getSubmissions(selectedAssignment._id);
      if (res.success) setSubmissions(res.data || []);
    } catch (err) {
      alert(err.response?.data?.message || 'Grading failed');
    }
  };

  const columns = [
    {
      header: 'Title & Subject',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800">{row.title}</p>
          <p className="text-xs text-slate-400">
            {row.subjectId?.name} ({row.subjectId?.code})
          </p>
        </div>
      ),
    },
    {
      header: 'Due Date',
      render: (row) => (
        <div className="text-xs">
          <p className="text-slate-700 font-medium">
            {new Date(row.dueDate).toLocaleDateString()}
          </p>
          <p className="text-slate-400">
            {new Date() > new Date(row.dueDate) ? 'Past deadline' : 'Active'}
          </p>
        </div>
      ),
    },
    {
      header: 'Max Marks',
      render: (row) => <span className="text-xs font-semibold text-slate-800">{row.maxMarks}</span>,
    },
    {
      header: 'Resubmission',
      render: (row) => (
        <Badge variant={row.allowResubmission ? 'emerald' : 'slate'}>
          {row.allowResubmission ? 'Allowed' : 'Disabled'}
        </Badge>
      ),
    },
    {
      header: 'Submissions',
      render: (row) => (
        <button
          onClick={() => handleOpenSubmissions(row)}
          className="px-3 py-1 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
        >
          Review Submissions
        </button>
      ),
    },
  ];

  if (loading && assignments.length === 0) return <LoadingSkeleton rows={6} />;

  return (
    <div className="space-y-6">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Assignments & Evaluation</h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish academic coursework, review student submissions, and assign grades
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Create Assignment
        </button>
      </div>

      <DataTable columns={columns} data={assignments} searchKey="title" />

      {/* Create Assignment Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Publish Course Assignment"
      >
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">
              Assignment Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Relational Normalization Problem Set"
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">
              Subject
            </label>
            <select
              required
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
            >
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">
              Description & Instructions
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Instructions, problem specifications, and submission criteria..."
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">
                Due Date & Time
              </label>
              <input
                type="datetime-local"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">
                Maximum Marks
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.maxMarks}
                onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">
              Reference Attachments (PDF/DOCX)
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => setAttachmentFiles(e.target.files)}
              className="mt-1 w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allowResubmission}
                onChange={(e) =>
                  setFormData({ ...formData, allowResubmission: e.target.checked })
                }
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              Allow students to resubmit prior to grading or upon request
            </label>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
            >
              Publish Assignment
            </button>
          </div>
        </form>
      </Modal>

      {/* Review Submissions Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setGradingSubmission(null);
        }}
        title={`Submissions: ${selectedAssignment?.title || 'Assignment'}`}
        maxWidth="max-w-4xl"
      >
        {submissionsLoading ? (
          <LoadingSkeleton rows={4} />
        ) : submissions.length === 0 ? (
          <p className="text-center py-8 text-xs text-slate-400">
            No student submissions received yet for this assignment.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {submissions.map((sub) => (
                <div key={sub._id} className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{sub.studentId?.name}</p>
                    <p className="text-xs text-slate-400">
                      Roll: {sub.studentId?.rollNumber || 'N/A'} • Submitted:{' '}
                      {new Date(sub.submittedAt).toLocaleString()}
                      {sub.isLate && (
                        <span className="text-rose-600 font-semibold ml-1.5">(Late)</span>
                      )}
                    </p>
                    {sub.feedback && (
                      <p className="text-xs text-slate-600 mt-1 italic">
                        Feedback: "{sub.feedback}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {sub.marks !== undefined && (
                      <div className="text-right">
                        <span className="font-bold text-slate-800 text-sm">
                          {sub.marks}/{selectedAssignment?.maxMarks}
                        </span>
                        <p className="text-[10px] text-slate-400">Score</p>
                      </div>
                    )}

                    <Badge
                      variant={
                        sub.status === 'GRADED'
                          ? 'emerald'
                          : sub.status === 'RESUBMISSION_REQUESTED'
                          ? 'amber'
                          : 'blue'
                      }
                    >
                      {sub.status.replace('_', ' ')}
                    </Badge>

                    {sub.file?.url && (
                      <a
                        href={sub.file.url}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded"
                        title="Download Solution File"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}

                    <button
                      onClick={() => {
                        setGradingSubmission(sub);
                        setGradeMarks(sub.marks !== undefined ? sub.marks : '');
                        setGradeFeedback(sub.feedback || '');
                        setRequestResubmission(sub.status === 'RESUBMISSION_REQUESTED');
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-teal-600 border border-teal-200 rounded-md hover:bg-teal-50 cursor-pointer"
                    >
                      Grade
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Grading Form Drawer */}
            {gradingSubmission && (
              <form
                onSubmit={handleSaveGrade}
                className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                    Grading: {gradingSubmission.studentId?.name}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setGradingSubmission(null)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Marks (out of {selectedAssignment?.maxMarks})
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      max={selectedAssignment?.maxMarks}
                      value={gradeMarks}
                      onChange={(e) => setGradeMarks(e.target.value)}
                      className="mt-1 w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={requestResubmission}
                        onChange={(e) => setRequestResubmission(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      Request Student Resubmission
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Faculty Feedback & Revision Comments
                  </label>
                  <textarea
                    rows={2}
                    value={gradeFeedback}
                    onChange={(e) => setGradeFeedback(e.target.value)}
                    placeholder="Provide constructive feedback..."
                    className="mt-1 w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg shadow-sm cursor-pointer"
                  >
                    Save Grade & Feedback
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
