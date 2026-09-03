import React, { useState, useEffect } from 'react';
import { announcementService } from '../../services/announcementService';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Toast from '../../components/common/Toast';
import { Bell, Plus, Trash2, Calendar } from 'lucide-react';

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const isStaff = user?.role === 'COLLEGE_ADMIN' || user?.role === 'FACULTY' || user?.role === 'SUPER_ADMIN';

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'MEDIUM',
  });

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await announcementService.getAll();
      if (res.success) setAnnouncements(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await announcementService.create(formData);
      setIsModalOpen(false);
      setToastMessage('Announcement broadcasted successfully!');
      loadAnnouncements();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post announcement');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await announcementService.delete(id);
      setToastMessage('Announcement removed.');
      loadAnnouncements();
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (loading && announcements.length === 0) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Campus Announcements</h1>
          <p className="text-xs text-slate-500 mt-1">
            Official institutional circulars, academic notices, and urgent college bulletins
          </p>
        </div>
        {isStaff && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Broadcast Notice
          </button>
        )}
      </div>

      <div className="space-y-4">
        {announcements.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    item.priority === 'URGENT'
                      ? 'rose'
                      : item.priority === 'HIGH'
                      ? 'amber'
                      : 'blue'
                  }
                >
                  {item.priority} Priority
                </Badge>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(item.publishDate).toLocaleDateString()}
                </span>
              </div>
              {isStaff && (
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <h3 className="font-bold text-slate-800 text-base">{item.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{item.content}</p>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              Published by: {item.author?.name || 'Administration'}
            </p>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Broadcast Announcement">
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Mid-term Exam Schedule Release"
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">Priority Level</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">Content</label>
            <textarea
              rows={4}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Notice message to be broadcasted to students and faculty..."
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
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
              Broadcast
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
