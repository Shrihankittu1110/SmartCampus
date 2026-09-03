import React, { useState, useEffect } from 'react';
import { placementService } from '../../services/placementService';
import { academicService } from '../../services/academicService';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Toast from '../../components/common/Toast';
import {
  Briefcase,
  Plus,
  Users,
  Calendar,
  Award,
  Download,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

export default function JobDrivesPage() {
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Applicants Modal
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);

  // Interview Schedule Modal
  const [schedulingApp, setSchedulingApp] = useState(null);
  const [stageName, setStageName] = useState('Technical Interview 1');
  const [scheduledAt, setScheduledAt] = useState('');
  const [interviewLink, setInterviewLink] = useState('https://meet.google.com/sample');

  // Outcome Modal
  const [outcomeApp, setOutcomeApp] = useState(null);
  const [outcomePackage, setOutcomePackage] = useState('');
  const [joiningDate, setJoiningDate] = useState('2026-07-01');

  // Drive Creation Form
  const [formData, setFormData] = useState({
    companyId: '',
    title: '',
    description: '',
    packageCTC: 12,
    applicationDeadline: '',
    driveDate: '',
    minCGPA: 7.0,
    maxBacklogs: 0,
    allowedDepartments: [],
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [dRes, cRes, deptRes] = await Promise.all([
        placementService.getDrives(),
        placementService.getCompanies(),
        academicService.getDepartments(),
      ]);
      if (dRes.success) setDrives(dRes.data || []);
      if (cRes.success) {
        setCompanies(cRes.data || []);
        if (cRes.data?.length > 0 && !formData.companyId) {
          setFormData((p) => ({ ...p, companyId: cRes.data[0]._id }));
        }
      }
      if (deptRes.success) setDepartments(deptRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await placementService.createDrive({
        companyId: formData.companyId,
        title: formData.title,
        description: formData.description,
        package: { ctc: Number(formData.packageCTC) },
        applicationDeadline: formData.applicationDeadline,
        driveDate: formData.driveDate,
        eligibilityRules: {
          minCGPA: Number(formData.minCGPA),
          maxBacklogs: Number(formData.maxBacklogs),
          allowedDepartments: formData.allowedDepartments,
        },
      });

      setIsModalOpen(false);
      setToastMessage('Recruitment drive published successfully!');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create drive');
    }
  };

  const handleOpenApplicants = async (drive) => {
    setSelectedDrive(drive);
    setAppsLoading(true);
    try {
      const res = await placementService.getDriveApplications(drive._id);
      if (res.success) setApplications(res.data || []);
    } catch (err) {
      alert('Failed to load applications');
    } finally {
      setAppsLoading(false);
    }
  };

  const handleShortlist = async (appId) => {
    try {
      await placementService.updateApplicationStatus(appId, {
        status: 'SHORTLISTED',
        currentStage: 'Shortlisted for Assessment',
      });
      setToastMessage('Candidate shortlisted!');
      // refresh
      const res = await placementService.getDriveApplications(selectedDrive._id);
      if (res.success) setApplications(res.data || []);
    } catch (err) {
      alert('Update failed');
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!schedulingApp) return;

    try {
      await placementService.createInterviewStage({
        applicationId: schedulingApp._id,
        stageName,
        scheduledAt,
        mode: 'ONLINE',
        locationOrLink: interviewLink,
      });

      setToastMessage('Interview round scheduled!');
      setSchedulingApp(null);
      const res = await placementService.getDriveApplications(selectedDrive._id);
      if (res.success) setApplications(res.data || []);
    } catch (err) {
      alert('Failed to schedule interview');
    }
  };

  const handleRecordOutcome = async (e) => {
    e.preventDefault();
    if (!outcomeApp) return;

    try {
      await placementService.recordOutcome({
        applicationId: outcomeApp._id,
        package: Number(outcomePackage),
        joiningDate,
        outcome: 'ACCEPTED',
      });

      setToastMessage('Placement offer recorded successfully!');
      setOutcomeApp(null);
      const res = await placementService.getDriveApplications(selectedDrive._id);
      if (res.success) setApplications(res.data || []);
      loadData();
    } catch (err) {
      alert('Failed to record outcome');
    }
  };

  const columns = [
    {
      header: 'Drive & Recruiter',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800">{row.title}</p>
          <p className="text-xs text-slate-400">{row.companyId?.name || 'Recruiter'}</p>
        </div>
      ),
    },
    {
      header: 'CTC Package',
      render: (row) => (
        <span className="font-bold text-teal-700 text-xs">{row.package?.ctc} LPA</span>
      ),
    },
    {
      header: 'Eligibility Criteria',
      render: (row) => (
        <div className="text-xs text-slate-600">
          <p>Min CGPA: {row.eligibilityRules?.minCGPA || 'None'}</p>
          <p className="text-slate-400">Max Backlogs: {row.eligibilityRules?.maxBacklogs ?? 0}</p>
        </div>
      ),
    },
    {
      header: 'Timeline',
      render: (row) => (
        <div className="text-xs text-slate-600">
          <p>Drive: {new Date(row.driveDate).toLocaleDateString()}</p>
          <p className="text-slate-400">
            Apply by: {new Date(row.applicationDeadline).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      header: 'Applicants',
      render: (row) => (
        <button
          onClick={() => handleOpenApplicants(row)}
          className="px-3 py-1 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg text-xs font-semibold cursor-pointer"
        >
          Manage Funnel
        </button>
      ),
    },
  ];

  if (loading && drives.length === 0) return <LoadingSkeleton rows={6} />;

  return (
    <div className="space-y-6">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Campus Recruitment Drives</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure placement opportunities, establish automated eligibility rules, and track candidate pipeline
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Post Job Drive
        </button>
      </div>

      <DataTable columns={columns} data={drives} searchKey="title" />

      {/* Create Drive Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Publish Recruitment Drive">
        <form onSubmit={handleCreate} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">Recruiter</label>
              <select
                required
                value={formData.companyId}
                onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
              >
                {companies.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">CTC (LPA)</label>
              <input
                type="number"
                required
                step="0.5"
                value={formData.packageCTC}
                onChange={(e) => setFormData({ ...formData, packageCTC: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">Job Role Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Associate Cloud Engineer"
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">Job Description</label>
            <textarea
              rows={2}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Key responsibilities, locations, and hiring process..."
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>

          {/* Eligibility Rules */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <p className="font-semibold text-slate-800 text-xs uppercase">Automated Eligibility Rules</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600">Minimum CGPA</label>
                <input
                  type="number"
                  step="0.1"
                  max="10"
                  value={formData.minCGPA}
                  onChange={(e) => setFormData({ ...formData, minCGPA: e.target.value })}
                  className="mt-1 w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600">Max Allowed Backlogs</label>
                <input
                  type="number"
                  min="0"
                  value={formData.maxBacklogs}
                  onChange={(e) => setFormData({ ...formData, maxBacklogs: e.target.value })}
                  className="mt-1 w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">Application Deadline</label>
              <input
                type="date"
                required
                value={formData.applicationDeadline}
                onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">Drive Date</label>
              <input
                type="date"
                required
                value={formData.driveDate}
                onChange={(e) => setFormData({ ...formData, driveDate: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
            >
              Post Drive
            </button>
          </div>
        </form>
      </Modal>

      {/* Applicants Funnel Modal */}
      <Modal
        isOpen={!!selectedDrive}
        onClose={() => setSelectedDrive(null)}
        title={`Applicants: ${selectedDrive?.title}`}
        maxWidth="max-w-4xl"
      >
        {appsLoading ? (
          <LoadingSkeleton rows={4} />
        ) : applications.length === 0 ? (
          <p className="text-center py-8 text-xs text-slate-400">
            No student applications submitted yet for this drive.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {applications.map((app) => (
              <div key={app._id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div>
                  <p className="font-bold text-slate-800 text-sm">{app.studentId?.name}</p>
                  <p className="text-slate-400">
                    Roll: {app.studentId?.rollNumber || 'N/A'} • CGPA: {app.studentId?.cgpa} • Backlogs:{' '}
                    {app.studentId?.backlogs}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      app.status === 'SELECTED'
                        ? 'emerald'
                        : app.status === 'SHORTLISTED'
                        ? 'amber'
                        : app.status === 'INTERVIEW'
                        ? 'purple'
                        : 'blue'
                    }
                  >
                    {app.status}
                  </Badge>

                  {app.status === 'APPLIED' && (
                    <button
                      onClick={() => handleShortlist(app._id)}
                      className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded font-semibold"
                    >
                      Shortlist
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setSchedulingApp(app);
                      setScheduledAt(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16));
                    }}
                    className="px-2.5 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded font-semibold"
                  >
                    Schedule Round
                  </button>

                  {app.status !== 'SELECTED' && (
                    <button
                      onClick={() => {
                        setOutcomeApp(app);
                        setOutcomePackage(selectedDrive?.package?.ctc || 12);
                      }}
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded font-semibold"
                    >
                      Record Offer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={!!schedulingApp}
        onClose={() => setSchedulingApp(null)}
        title={`Schedule Interview: ${schedulingApp?.studentId?.name}`}
      >
        <form onSubmit={handleScheduleInterview} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">Stage Name</label>
            <input
              type="text"
              required
              value={stageName}
              onChange={(e) => setStageName(e.target.value)}
              placeholder="e.g. Technical Round 1"
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">Date & Time</label>
            <input
              type="datetime-local"
              required
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">Meeting Link / Location</label>
            <input
              type="text"
              required
              value={interviewLink}
              onChange={(e) => setInterviewLink(e.target.value)}
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setSchedulingApp(null)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
            >
              Confirm Interview
            </button>
          </div>
        </form>
      </Modal>

      {/* Record Offer Modal */}
      <Modal
        isOpen={!!outcomeApp}
        onClose={() => setOutcomeApp(null)}
        title={`Record Placement Offer: ${outcomeApp?.studentId?.name}`}
      >
        <form onSubmit={handleRecordOutcome} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">Final Package (CTC in LPA)</label>
            <input
              type="number"
              required
              step="0.5"
              value={outcomePackage}
              onChange={(e) => setOutcomePackage(e.target.value)}
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">Joining Date</label>
            <input
              type="date"
              required
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOutcomeApp(null)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
            >
              Release Offer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
