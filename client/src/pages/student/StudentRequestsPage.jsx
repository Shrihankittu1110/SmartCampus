import React, { useState, useEffect } from 'react';
import { requestService } from '../../services/requestService';
import { useAuth } from '../../context/AuthContext';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Toast from '../../components/common/Toast';
import {
  ClipboardList,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
} from 'lucide-react';

export default function StudentRequestsPage() {
  const { user } = useAuth();
  const isStaff = user?.role === 'COLLEGE_ADMIN' || user?.role === 'FACULTY' || user?.role === 'SUPER_ADMIN';

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewModalRequest, setReviewModalRequest] = useState(null);
  const [responseStatus, setResponseStatus] = useState('APPROVED');
  const [responseText, setResponseText] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    requestType: 'BONAFIDE',
    subject: '',
    description: '',
  });
  const [attachmentFiles, setAttachmentFiles] = useState(null);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = isStaff
        ? await requestService.getAllRequests()
        : await requestService.getMyRequests();

      if (res.success) setRequests(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('requestType', formData.requestType);
      data.append('subject', formData.subject);
      data.append('description', formData.description);

      if (attachmentFiles) {
        for (let i = 0; i < attachmentFiles.length; i++) {
          data.append('attachments', attachmentFiles[i]);
        }
      }

      await requestService.create(data);
      setIsModalOpen(false);
      setToastMessage('Request submitted successfully!');
      setFormData({ requestType: 'BONAFIDE', subject: '', description: '' });
      loadRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit request');
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!reviewModalRequest) return;

    try {
      await requestService.updateStatus(reviewModalRequest._id, {
        status: responseStatus,
        response: responseText,
      });

      setToastMessage('Request status updated successfully!');
      setReviewModalRequest(null);
      loadRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const columns = [
    {
      header: 'Type',
      render: (row) => <Badge variant="teal">{row.requestType}</Badge>,
    },
    {
      header: 'Subject & Description',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800">{row.subject}</p>
          <p className="text-xs text-slate-500 max-w-sm truncate">{row.description}</p>
          {isStaff && (
            <p className="text-[11px] text-teal-700 mt-0.5">
              Requested by: {row.studentId?.name} ({row.studentId?.rollNumber || 'N/A'})
            </p>
          )}
        </div>
      ),
    },
    {
      header: 'Submitted',
      render: (row) => (
        <span className="text-xs text-slate-500">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <Badge
          variant={
            row.status === 'APPROVED' || row.status === 'COMPLETED'
              ? 'emerald'
              : row.status === 'REJECTED'
              ? 'rose'
              : row.status === 'IN_REVIEW'
              ? 'blue'
              : 'amber'
          }
        >
          {row.status.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      header: isStaff ? 'Action' : 'Admin Response',
      render: (row) =>
        isStaff ? (
          <button
            onClick={() => {
              setReviewModalRequest(row);
              setResponseStatus(row.status === 'PENDING' ? 'APPROVED' : row.status);
              setResponseText(row.response || '');
            }}
            className="px-2.5 py-1 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded text-xs font-semibold"
          >
            Review Request
          </button>
        ) : (
          <span className="text-xs text-slate-600 italic">
            {row.response || 'Pending review by administration'}
          </span>
        ),
    },
  ];

  if (loading && requests.length === 0) return <LoadingSkeleton rows={6} />;

  return (
    <div className="space-y-6">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isStaff ? 'Student Requests Management' : 'My Campus Requests'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isStaff
              ? 'Approve certificates, bonafide requests, and medical leaves'
              : 'Request bonafide certificates, leave authorizations, and formal documents'}
          </p>
        </div>
        {!isStaff && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Submit New Request
          </button>
        )}
      </div>

      <DataTable columns={columns} data={requests} searchKey="subject" />

      {/* Submit Request Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Campus Request"
      >
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">
              Request Category
            </label>
            <select
              value={formData.requestType}
              onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
            >
              <option value="BONAFIDE">Bonafide Certificate</option>
              <option value="LEAVE">Medical / Personal Leave</option>
              <option value="CERTIFICATE">Academic Transcripts / NOC</option>
              <option value="ACADEMIC">Curriculum / Exam Query</option>
              <option value="GENERAL">General Administrative</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">
              Request Subject
            </label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g. Bonafide for State Education Scholarship"
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">
              Detailed Explanation
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide background context and dates..."
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">
              Supporting Documentation (Optional)
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => setAttachmentFiles(e.target.files)}
              className="mt-1 w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
            />
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
              Submit Request
            </button>
          </div>
        </form>
      </Modal>

      {/* Review Request Modal for Staff */}
      <Modal
        isOpen={!!reviewModalRequest}
        onClose={() => setReviewModalRequest(null)}
        title="Review & Update Request Status"
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1">
            <p className="font-bold text-slate-800">{reviewModalRequest?.subject}</p>
            <p className="text-slate-600">{reviewModalRequest?.description}</p>
            <p className="text-teal-700 font-medium">
              Student: {reviewModalRequest?.studentId?.name}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">
              Action Status
            </label>
            <select
              value={responseStatus}
              onChange={(e) => setResponseStatus(e.target.value)}
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
            >
              <option value="APPROVED">Approve Request</option>
              <option value="COMPLETED">Mark as Completed</option>
              <option value="IN_REVIEW">Place In Review</option>
              <option value="REJECTED">Reject Request</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">
              Official Response Note
            </label>
            <textarea
              rows={3}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="e.g. Document generated and available at administrative office..."
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setReviewModalRequest(null)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
            >
              Save Decision
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
