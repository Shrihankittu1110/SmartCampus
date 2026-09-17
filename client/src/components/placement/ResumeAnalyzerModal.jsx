import React, { useState } from 'react';
import Modal from '../common/Modal';
import { placementService } from '../../services/placementService';
import {
  Sparkles,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  X,
  Briefcase,
  ChevronRight,
  Award,
  Zap,
} from 'lucide-react';

export default function ResumeAnalyzerModal({ isOpen, onClose, drives = [], defaultDriveId = null, onApply }) {
  const [file, setFile] = useState(null);
  const [selectedDriveId, setSelectedDriveId] = useState(defaultDriveId || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.type !== 'application/pdf' && !selected.name.endsWith('.pdf') && !selected.name.endsWith('.txt')) {
        setError('Please upload a PDF document (.pdf) or text file.');
        return;
      }
      setFile(selected);
      setError('');
      setResult(null);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a resume PDF to analyze.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('resume', file);
      if (selectedDriveId) {
        formData.append('jobDriveId', selectedDriveId);
      }

      const res = await placementService.analyzeResume(formData);
      if (res.success) {
        setResult(res.data);
      } else {
        setError(res.message || 'Analysis failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error analyzing resume. Please verify PDF file.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyWithResume = () => {
    if (selectedDriveId && file && onApply) {
      onApply(selectedDriveId, file);
      onClose();
    }
  };

  const scoreColor =
    result?.score >= 80
      ? 'text-emerald-500 border-emerald-500 bg-emerald-50'
      : result?.score >= 65
      ? 'text-cyan-600 border-cyan-500 bg-cyan-50'
      : 'text-amber-500 border-amber-500 bg-amber-50';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Resume Matcher & ATS Scanner" size="2xl">
      <div className="space-y-6">
        {/* Header Hero Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#19227d] to-[#0e1450] text-white border border-white/10 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-white">Smart ATS Placement Matcher</h3>
            </div>
            <p className="text-xs text-blue-200/80">
              Upload your PDF resume to evaluate keyword match percentage, identify missing skills, and optimize for campus drives.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Target Job Drive Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Recruitment Drive
              </label>
              <select
                value={selectedDriveId}
                onChange={(e) => {
                  setSelectedDriveId(e.target.value);
                  setResult(null);
                }}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer"
              >
                <option value="">General Software Engineer Role</option>
                {drives.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.title} — {d.companyId?.name || 'Partner Company'}
                  </option>
                ))}
              </select>
            </div>

            {/* Resume Upload Box */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Upload Resume (PDF)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-file-input"
                />
                <label
                  htmlFor="resume-file-input"
                  className="flex items-center justify-between px-3.5 py-2 rounded-xl border border-dashed border-slate-300 hover:border-orange-500 bg-slate-50/70 hover:bg-orange-50/20 text-xs text-slate-600 transition-all cursor-pointer truncate"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <span className="truncate font-medium">
                      {file ? file.name : 'Select or drop PDF file'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-orange-600 uppercase flex-shrink-0 ml-2">
                    Browse
                  </span>
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !file}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white btn-vivid-orange shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Extracting skills & evaluating ATS score...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Analyze Resume ATS Compatibility</span>
              </>
            )}
          </button>
        </form>

        {/* Results Presentation */}
        {result && (
          <div className="pt-4 border-t border-slate-200/80 space-y-5 animate-in fade-in duration-300">
            {/* Score Metric Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center font-black text-xl shadow-xs ${scoreColor}`}
                >
                  {result.score}%
                  <span className="text-[9px] font-bold tracking-tight uppercase -mt-1">ATS Score</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">
                      {result.jobDrive ? result.jobDrive.title : 'Software Development Profile'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        result.score >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : result.score >= 65
                          ? 'bg-cyan-100 text-cyan-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {result.rating}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {result.stats.wordCount} words analyzed • {result.detectedSkills.length} technical skills found
                  </p>
                </div>
              </div>

              {selectedDriveId && onApply && (
                <button
                  type="button"
                  onClick={handleApplyWithResume}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Apply with This Resume</span>
                </button>
              )}
            </div>

            {/* Matched vs Missing Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Matched Skills */}
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Matched Target Skills ({result.matchedSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {result.matchedSkills.length > 0 ? (
                    result.matchedSkills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200/60"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic text-[11px]">None detected yet.</span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Missing Recommended Keywords ({result.missingSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {result.missingSkills.length > 0 ? (
                    result.missingSkills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200/60"
                      >
                        + {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-emerald-700 font-medium text-[11px]">All target skills present!</span>
                  )}
                </div>
              </div>
            </div>

            {/* AI Optimization Recommendations */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span>Actionable Optimization Recommendations</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
