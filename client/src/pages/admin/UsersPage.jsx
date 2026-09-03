import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { academicService } from '../../services/academicService';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Plus, Download, UserCheck, UserX } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
    departmentId: '',
    rollNumber: '',
    employeeId: '',
    cgpa: 0,
    backlogs: 0,
    currentSemester: 1,
    phone: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (roleFilter) params.role = roleFilter;
      const [uRes, dRes] = await Promise.all([
        userService.getAll(params),
        academicService.getDepartments(),
      ]);
      if (uRes.success) setUsers(uRes.data);
      if (dRes.success) setDepartments(dRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [roleFilter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await userService.create(formData);
      setIsModalOpen(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'STUDENT',
        departmentId: '',
        rollNumber: '',
        employeeId: '',
        cgpa: 0,
        backlogs: 0,
        currentSemester: 1,
        phone: '',
      });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await userService.toggleStatus(id);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle user status');
    }
  };

  const handleExport = async () => {
    try {
      const blob = await userService.exportCSV();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users-directory-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Export failed');
    }
  };

  const columns = [
    {
      header: 'Name & Identifier',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800">{row.name}</p>
          <p className="text-xs text-slate-400">
            {row.role === 'STUDENT' ? `Roll: ${row.rollNumber || 'N/A'}` : `Emp: ${row.employeeId || 'N/A'}`}
          </p>
        </div>
      ),
    },
    {
      header: 'Email & Contact',
      render: (row) => (
        <div className="text-xs">
          <p className="text-slate-700">{row.email}</p>
          <p className="text-slate-400">{row.phone || '—'}</p>
        </div>
      ),
    },
    {
      header: 'Role',
      render: (row) => (
        <Badge
          variant={
            row.role === 'STUDENT'
              ? 'blue'
              : row.role === 'FACULTY'
              ? 'purple'
              : row.role === 'COLLEGE_ADMIN'
              ? 'teal'
              : 'slate'
          }
        >
          {row.role.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      header: 'Department',
      render: (row) => (
        <span className="text-xs text-slate-600">{row.departmentId?.name || '—'}</span>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <Badge variant={row.isActive ? 'emerald' : 'rose'}>
          {row.isActive ? 'Active' : 'Deactivated'}
        </Badge>
      ),
    },
    {
      header: 'Action',
      render: (row) => (
        <button
          onClick={() => handleToggleStatus(row._id)}
          className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
            row.isActive
              ? 'text-rose-600 hover:bg-rose-50'
              : 'text-emerald-600 hover:bg-emerald-50'
          }`}
        >
          {row.isActive ? 'Deactivate' : 'Activate'}
        </button>
      ),
    },
  ];

  if (loading && users.length === 0) return <LoadingSkeleton rows={6} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage institutional faculty, student records, and operational accounts
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Create User
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">Filter Role:</span>
        {['', 'STUDENT', 'FACULTY', 'COLLEGE_ADMIN', 'PLACEMENT_OFFICER'].map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              roleFilter === r
                ? 'bg-teal-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {r ? r.replace('_', ' ') : 'All Roles'}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={users}
        searchKey="name"
        searchPlaceholder="Search by name, email, roll number..."
      />

      {/* Create User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New User Account"
      >
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">
                Initial Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Default: CampusFlow@123"
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty</option>
                <option value="PLACEMENT_OFFICER">Placement Officer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">
                Department
              </label>
              <select
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

          {formData.role === 'STUDENT' ? (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  Roll Number
                </label>
                <input
                  type="text"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  CGPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  max="10"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  Backlogs
                </label>
                <input
                  type="number"
                  value={formData.backlogs}
                  onChange={(e) => setFormData({ ...formData, backlogs: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">
                Employee ID
              </label>
              <input
                type="text"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
          )}

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
              Create Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
