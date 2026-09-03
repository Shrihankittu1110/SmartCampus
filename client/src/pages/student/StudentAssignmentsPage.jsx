import React, { useState, useEffect } from 'react';
import { assignmentService } from '../../services/assignmentService';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Toast from '../../components/common/Toast';
import {
  FileText,
  Upload,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Award,
} from 'lucide-react';

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingAssignment, setSubmittingAssignment] = useState(null);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const res = await assignmentService.getAll();
      if (res.success) setAssignments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleSubmitFile = async (e) => {
    e.preventDefault();
    if (!submittingAssignment || !submissionFile) {
      return alert('Please select a file to submit.');
    }

    setUploading(true);
    try {
      const data = new FormData();
      data.append('submissionFile', submissionFile);

      await assignmentService.submit(submittingAssignment._id, data);
      setToastMessage('Solution file submitted successfully!');
      setSubmittingAssignment(null);
      setSubmissionFile(null);
      loadAssignments();
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading && assignments.length === 0) return <LoadingSkeleton rows={6} />;

  return (
    <div className="space-y-6">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}

      <div>
        <h1 className="text-2xl font-bold text-slate-800">Coursework & Assignments</h1>
        <p className="text-xs text-slate-500 mt-1">
          Submit laboratory problem sets, track grading feedback, and handle requested revisions
        </p>
      </div>

      <div className="space-y-4">
        {assignments.map((assignment) => {
          const isPastDue = new Date() > new Date(assignment.dueDate);
          const submission = assignment.submission;
          const status = submission ? submission.status : 'PENDING';

          return (
            <div
              key={assignment._id}
              className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="teal" size="sm">
                      {assignment.subjectId?.code || 'SUBJECT'}
                    </Badge>
                    <span className="text-xs text-slate-500 font-medium">
                      {assignment.subjectId?.name}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-base mt-1">
                    {assignment.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <Badge
                    variant={
                      status === 'GRADED'
                        ? 'emerald'
                        : status === 'RESUBMISSION_REQUESTED'
                        ? 'amber'
                        : status === 'SUBMITTED' || status === 'RESUBMITTED'
                        ? 'blue'
                        : 'slate'
                    }
                  >
                    {status.replace('_', ' ')}
                  </Badge>

                  {status !== 'GRADED' && (
                    <button
                      onClick={() => setSubmittingAssignment(assignment)}
                      className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {submission ? 'Resubmit Solution' : 'Submit Solution'}
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {assignment.description}
              </p>

              {/* Attachments from faculty */}
              {assignment.attachments?.length > 0 && (
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <span className="text-slate-400 font-medium">Attachments:</span>
                  {assignment.attachments.map((att, i) => (
                    <a
                      key={i}
                      href={att.url}
                      target="_blank"
                      rel="noreferrer"
                      download
                      className="text-teal-600 hover:text-teal-700 font-semibold inline-flex items-center gap-1 bg-teal-50 px-2 py-0.5 rounded"
                    >
                      <Download className="w-3 h-3" /> {att.name}
                    </a>
                  ))}
                </div>
              )}

              {/* Submission Details & Grade Card */}
              {submission && (
                <div className="mt-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200/70 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">
                      Latest Submission (v{submission.version})
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {new Date(submission.submittedAt).toLocaleString()}
                    </span>
                  </div>

                  {submission.marks !== undefined && (
                    <div className="flex items-center gap-2 text-emerald-700 font-bold">
                      <Award className="w-4 h-4" />
                      <span>
                        Marks Awarded: {submission.marks} / {assignment.maxMarks}
                      </span>
                    </div>
                  )}

                  {submission.feedback && (
                    <p className="text-slate-600 italic">
                      Faculty Feedback: "{submission.feedback}"
                    </p>
                  )}
                </div>
              )}

              {/* Deadline & Meta info */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Due Date:{' '}
                  <strong className={isPastDue ? 'text-rose-600' : 'text-slate-700'}>
                    {new Date(assignment.dueDate).toLocaleString()}
                  </strong>
                </span>
                <span>Max Marks: {assignment.maxMarks}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Submission Modal */}
      <Modal
        isOpen={!!submittingAssignment}
        onClose={() => {
          setSubmittingAssignment(null);
          setSubmissionFile(null);
        }}
        title={`Submit Solution: ${submittingAssignment?.title || 'Assignment'}`}
      >
        <form onSubmit={handleSubmitFile} className="space-y-4">
          <p className="text-xs text-slate-500">
            Upload your completed solution document (PDF, DOCX, or ZIP archive).
          </p>

          <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-center">
            <Upload className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <input
              type="file"
              required
              onChange={(e) => setSubmissionFile(e.target.files[0])}
              className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
            />
            <p className="text-[11px] text-slate-400 mt-2">Maximum file size is 10MB.</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setSubmittingAssignment(null);
                setSubmissionFile(null);
              }}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !submissionFile}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Confirm Submission'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
