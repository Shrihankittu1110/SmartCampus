import React, { useState, useEffect } from 'react';
import { academicService } from '../../services/academicService';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Plus } from 'lucide-react';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    departmentId: '',
    duration: 4,
    totalSemesters: 8,
    description: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [cRes, dRes] = await Promise.all([
        academicService.getCourses(),
        academicService.getDepartments(),
      ]);
      if (cRes.success) setCourses(cRes.data);
      if (dRes.success) setDepartments(dRes.data);
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
      await academicService.createCourse(formData);
      setIsModalOpen(false);
      setFormData({ name: '', code: '', departmentId: '', duration: 4, totalSemesters: 8, description: '' });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create course');
    }
  };

  const columns = [
    {
      header: 'Course Code',
      render: (row) => <Badge variant="blue">{row.code}</Badge>,
    },
    {
      header: 'Course Name',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800">{row.name}</p>
          <p className="text-xs text-slate-400">{row.description || '—'}</p>
        </div>
      ),
    },
    {
      header: 'Department',
      render: (row) => <span className="text-xs text-slate-700">{row.departmentId?.name || '—'}</span>,
    },
    {
      header: 'Duration',
      render: (row) => (
        <span className="text-xs text-slate-600">
          {row.duration} Years ({row.totalSemesters} Semesters)
        </span>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <Badge variant={row.isActive ? 'emerald' : 'slate'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  if (loading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Academic Courses</h1>
          <p className="text-xs text-slate-500 mt-1">
            Degree programs, semester structures, and departmental affiliations
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Course
        </button>
      </div>

      <DataTable columns={columns} data={courses} searchKey="name" />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Degree Course">
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">Course Title</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. B.Tech Computer Science & Engineering"
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">Course Code</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="BT-CSE"
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">Department</label>
              <select
                required
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">Duration (Years)</label>
              <input
                type="number"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">Total Semesters</label>
              <input
                type="number"
                required
                value={formData.totalSemesters}
                onChange={(e) => setFormData({ ...formData, totalSemesters: e.target.value })}
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
              Create Course
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
