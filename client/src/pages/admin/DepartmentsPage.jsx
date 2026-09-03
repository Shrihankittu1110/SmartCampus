import React, { useState, useEffect } from 'react';
import { academicService } from '../../services/academicService';
import { userService } from '../../services/userService';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Plus, Layers } from 'lucide-react';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    headOfDepartment: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [dRes, fRes] = await Promise.all([
        academicService.getDepartments(),
        userService.getAll({ role: 'FACULTY', limit: 100 }),
      ]);
      if (dRes.success) setDepartments(dRes.data);
      if (fRes.success) setFacultyList(fRes.data);
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
      await academicService.createDepartment(formData);
      setIsModalOpen(false);
      setFormData({ name: '', code: '', description: '', headOfDepartment: '' });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create department');
    }
  };

  const columns = [
    {
      header: 'Department Code',
      render: (row) => <Badge variant="teal">{row.code}</Badge>,
    },
    {
      header: 'Department Name',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800">{row.name}</p>
          <p className="text-xs text-slate-400 truncate max-w-sm">{row.description || '—'}</p>
        </div>
      ),
    },
    {
      header: 'Head of Department',
      render: (row) => (
        <span className="text-xs font-medium text-slate-700">
          {row.headOfDepartment?.name || 'Unassigned'}
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
          <h1 className="text-2xl font-bold text-slate-800">Academic Departments</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure institutional faculties, divisional codes, and HOD appointments
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Department
        </button>
      </div>

      <DataTable columns={columns} data={departments} searchKey="name" />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Academic Department"
      >
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">
              Department Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Electrical Engineering"
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">
                Code
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="EE"
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">
                Head of Department
              </label>
              <select
                value={formData.headOfDepartment}
                onChange={(e) => setFormData({ ...formData, headOfDepartment: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="">Select HOD</option>
                {facultyList.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.name} ({f.employeeId || 'Faculty'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">
              Description
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Overview of syllabus, labs, and research focus..."
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
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
              Create Department
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
