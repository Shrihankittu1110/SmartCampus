import React, { useState, useEffect } from 'react';
import { placementService } from '../../services/placementService';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Toast from '../../components/common/Toast';
import ResumeAnalyzerModal from '../../components/placement/ResumeAnalyzerModal';
import {
  Briefcase,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Upload,
  Calendar,
  Award,
  Sparkles,
  Zap,
} from 'lucide-react';

export default function StudentPlacementsPage() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingDrive, setApplyingDrive] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [targetDriveForAnalysis, setTargetDriveForAnalysis] = useState(null);

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

  return (
    <div className="space-y-6">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}

      <div>
        <h1 className="text-2xl font-bold text-slate-800">Campus Placements & Job Drives</h1>
        <p className="text-xs text-slate-500 mt-1">
          Explore recruitment drives, verify your real-time eligibility, and apply with your verified resume
        </p>
      </div>

      {/* AI Resume Matcher Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#19227d] via-[#141b66] to-[#0e1450] text-white border border-white/10 shadow-lg shadow-blue-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff6b00] to-[#ffa133] p-[1.5px] shadow-md shadow-orange-500/30 flex-shrink-0">
            <div className="w-full h-full bg-[#0e1450] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-orange-400" />
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">AI Resume ATS Matcher & Optimizer</h2>
            <p className="text-xs text-blue-200/80">
              Evaluate your resume compatibility with active campus recruitment drives, identify missing skills, and optimize keywords.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setTargetDriveForAnalysis(null);
            setShowAnalyzer(true);
          }}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white btn-vivid-orange shadow-md shadow-orange-500/30 flex items-center gap-2 cursor-pointer whitespace-nowrap self-stretch sm:self-auto justify-center"
        >
          <Zap className="w-4 h-4" />
          <span>Scan My Resume</span>
        </button>
      </div>

      <div className="space-y-4">
        {drives.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center text-slate-400">
            <Briefcase className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-600">No Active Drives Currently</p>
            <p className="text-xs text-slate-400 mt-1">There are no ongoing placement drives scheduled right now. Check back soon.</p>
          </div>
        ) : (
          drives.map((drive) => {
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

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTargetDriveForAnalysis(drive._id);
                        setShowAnalyzer(true);
                      }}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Analyze your resume ATS compatibility for this role"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                      <span>ATS Match</span>
                    </button>

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
        })
      )}
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

      {/* AI Resume Analyzer Modal */}
      <ResumeAnalyzerModal
        isOpen={showAnalyzer}
        onClose={() => setShowAnalyzer(false)}
        drives={drives}
        defaultDriveId={targetDriveForAnalysis}
        onApply={(driveId, resume) => {
          const target = drives.find((d) => d._id === driveId);
          if (target) {
            setApplyingDrive(target);
            setResumeFile(resume);
          }
        }}
      />
    </div>
  );
}
