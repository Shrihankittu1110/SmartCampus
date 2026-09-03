import React, { useState, useEffect } from 'react';
import { placementService } from '../../services/placementService';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Toast from '../../components/common/Toast';
import {
  Briefcase,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Upload,
  Calendar,
  Award,
} from 'lucide-react';

export default function StudentPlacementsPage() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingDrive, setApplyingDrive] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const loadDrives = async () => {
    try {
      setLoading(true);
      const res = await placementService.getDrives();
      if (res.success) setDrives(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrives();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!applyingDrive) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      await placementService.apply(applyingDrive._id, formData);
      setToastMessage('Application submitted successfully!');
      setApplyingDrive(null);
      setResumeFile(null);
      loadDrives();
    } catch (err) {
      alert(err.response?.data?.message || 'Application rejected by eligibility engine');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && drives.length === 0) return <LoadingSkeleton rows={6} />;

  return (
    <div className="space-y-6">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}

      <div>
        <h1 className="text-2xl font-bold text-slate-800">Campus Placements & Job Drives</h1>
        <p className="text-xs text-slate-500 mt-1">
          Explore recruitment drives, verify your real-time eligibility, and apply with your verified resume
        </p>
      </div>

      <div className="space-y-4">
        {drives.map((drive) => {
          const myApp = drive.myApplication;
          const isEligible = drive.isEligible;
          const reasons = drive.ineligibilityReasons || [];
          const isPastDeadline = new Date() > new Date(drive.applicationDeadline);

          return (
            <div
              key={drive._id}
              className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm">
                    {drive.companyId?.name?.[0] || 'C'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{drive.title}</h3>
                    <p className="text-xs text-slate-500">
                      {drive.companyId?.name} • {drive.locations?.join(', ') || 'Remote / Hybrid'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <div className="text-right">
                    <p className="text-base font-bold text-teal-700">{drive.package?.ctc} LPA</p>
                    <p className="text-[10px] text-slate-400">CTC Package</p>
                  </div>

                  {myApp ? (
                    <Badge
                      variant={
                        myApp.status === 'SELECTED'
                          ? 'emerald'
                          : myApp.status === 'REJECTED'
                          ? 'rose'
                          : myApp.status === 'INTERVIEW'
                          ? 'purple'
                          : 'blue'
                      }
                    >
                      {myApp.status}: {myApp.currentStage || 'In Progress'}
                    </Badge>
                  ) : isEligible ? (
                    <button
                      disabled={isPastDeadline}
                      onClick={() => setApplyingDrive(drive)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      {isPastDeadline ? 'Deadline Passed' : 'Apply Now'}
                    </button>
                  ) : (
                    <Badge variant="rose">Not Eligible</Badge>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{drive.description}</p>

              {/* Eligibility breakdown */}
              <div className="p-3 bg-slate-50 rounded-lg text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-4 text-slate-600">
                  <span>
                    Min CGPA: <strong>{drive.eligibilityRules?.minCGPA || 'None'}</strong>
                  </span>
                  <span>
                    Max Backlogs: <strong>{drive.eligibilityRules?.maxBacklogs ?? 'None'}</strong>
                  </span>
                  <span>
                    Drive Date:{' '}
                    <strong>{new Date(drive.driveDate).toLocaleDateString()}</strong>
                  </span>
                </div>

                {!isEligible && reasons.length > 0 && (
                  <div className="text-rose-600 font-medium text-[11px] flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{reasons[0]}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={!!applyingDrive}
        onClose={() => setApplyingDrive(null)}
        title={`Apply to ${applyingDrive?.title}`}
      >
        <form onSubmit={handleApply} className="space-y-4">
          <p className="text-xs text-slate-600">
            Confirm your application for <strong>{applyingDrive?.companyId?.name}</strong>. Your academic profile, CGPA, and semester standing will be transmitted to the placement cell.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">
              Upload Updated Resume (PDF/DOCX)
            </label>
            <input
              type="file"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="mt-1 w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setApplyingDrive(null)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Confirm Application'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
