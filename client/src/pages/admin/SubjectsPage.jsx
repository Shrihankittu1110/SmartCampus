import React, { useState, useEffect } from 'react';
import { academicService } from '../../services/academicService';
import { userService } from '../../services/userService';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Plus, BookOpen } from 'lucide-react';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    courseId: '',
    departmentId: '',
    facultyIds: [],
    credits: 3,
    semester: 1,
    description: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [sRes, cRes, dRes, fRes] = await Promise.all([
        academicService.getSubjects(),
        academicService.getCourses(),
        academicService.getDepartments(),
        userService.getAll({ role: 'FACULTY', limit: 100 }),
      ]);
      if (sRes.success) setSubjects(sRes.data);
      if (cRes.success) setCourses(cRes.data);
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
      await academicService.createSubject(formData);
      setIsModalOpen(false);
      setFormData({
        name: '',
        code: '',
        courseId: '',
        departmentId: '',
        facultyIds: [],
        credits: 3,
        semester: 1,
        description: '',
      });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create subject');
    }
  };

  const columns = [
    {
      header: 'Subject Code',
      render: (row) => <Badge variant="purple">{row.code}</Badge>,
    },
    {
      header: 'Subject Name',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800">{row.name}</p>
          <p className="text-xs text-slate-400">{row.courseId?.name || '—'}</p>
        </div>
      ),
    },
    {
      header: 'Semester & Credits',
      render: (row) => (
        <span className="text-xs text-slate-700">
          Sem {row.semester} • {row.credits} Credits
        </span>
      ),
    },
    {
      header: 'Assigned Faculty',
      render: (row) => (
        <div className="text-xs text-slate-700">
          {row.facultyIds?.length > 0
            ? row.facultyIds.map((f) => f.name).join(', ')
            : 'Unassigned'}
        </div>
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
          <h1 className="text-2xl font-bold text-slate-800">Academic Subjects</h1>
          <p className="text-xs text-slate-500 mt-1">
            Course curriculum, credit distributions, and assigned faculty instructors
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Subject
        </button>
      </div>

      <DataTable columns={columns} data={subjects} searchKey="name" />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Subject">
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">Subject Title</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Distributed Operating Systems"
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">Subject Code</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="CS405"
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">Credits</label>
              <input
                type="number"
                required
                min="1"
                max="6"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">Course</label>
              <select
                required
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">Department</label>
              <select
                required
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
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
              <label className="block text-xs font-semibold text-slate-700 uppercase">Semester</label>
              <input
                type="number"
                required
                min="1"
                max="8"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">Faculty Instructor</label>
              <select
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    facultyIds: e.target.value ? [e.target.value] : [],
                  })
                }
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
              >
                <option value="">Assign Faculty</option>
                {facultyList.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.name} ({f.employeeId || 'Faculty'})
                  </option>
                ))}
              </select>
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
              Save Subject
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
