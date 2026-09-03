import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { institutionService } from '../../services/institutionService';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import {
  Building2,
  Users,
  GraduationCap,
  Briefcase,
  Plus,
  ExternalLink,
  ShieldCheck,
  Globe,
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    email: '',
    phone: '',
    website: '',
    address: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, instRes] = await Promise.all([
        analyticsService.getDashboardStats(),
        institutionService.getAll({ limit: 10 }),
      ]);
      if (statsRes.success) setStats(statsRes.data);
      if (instRes.success) setInstitutions(instRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateInstitution = async (e) => {
    e.preventDefault();
    try {
      await institutionService.create(formData);
      setIsModalOpen(false);
      setFormData({ name: '', code: '', email: '', phone: '', website: '', address: '' });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating institution');
    }
  };

  if (loading) return <LoadingSkeleton rows={6} />;

  const columns = [
    {
      header: 'Institution',
      render: (row) => (
        <div>
          <p className="font-bold text-slate-800">{row.name}</p>
          <p className="text-xs text-slate-400 font-mono">Code: {row.code}</p>
        </div>
      ),
    },
    {
      header: 'Contact',
      render: (row) => (
        <div className="text-xs">
          <p className="text-slate-700 font-medium">{row.email}</p>
          <p className="text-slate-400">{row.phone || 'N/A'}</p>
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
    {
      header: 'Website',
      render: (row) =>
        row.website ? (
          <a
            href={row.website}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold inline-flex items-center gap-1"
          >
            Visit <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-7">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-[#0B132B] to-[#1C2541] p-7 text-white shadow-xl border border-cyan-900/40">
        <div className="absolute top-0 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-60 h-60 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-semibold backdrop-blur-xs">
              <Globe className="w-3.5 h-3.5" />
              Global Cloud Multi-Tenancy Control Plane
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Super Administrator Console
            </h1>
            <p className="text-xs text-cyan-100/80 max-w-xl leading-relaxed">
              Global tenant management, cross-institutional telemetry, and system-wide security policies.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-teal-400 hover:brightness-105 text-slate-950 font-bold px-5 py-3 rounded-2xl text-xs transition-all shadow-lg shadow-cyan-500/20 cursor-pointer flex-shrink-0"
          >
            <Plus className="w-4 h-4" /> Register Institution
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Colleges Registered"
          value={stats?.totalInstitutions || 0}
          icon={Building2}
          description="Active tenant boundaries"
          variant="indigo"
        />
        <StatCard
          title="Total Platform Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          description="Across all institutions"
          variant="blue"
        />
        <StatCard
          title="Total Student Body"
          value={stats?.totalStudents || 0}
          icon={GraduationCap}
          description="Active enrolled learners"
          variant="emerald"
        />
        <StatCard
          title="Active Recruitment"
          value={stats?.activeDrives || 0}
          icon={Briefcase}
          description="Live corporate drives"
          variant="purple"
        />
      </div>

      {/* Institutions Directory */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-800">Institutions Directory</h2>
            <p className="text-xs text-slate-400">Accredited collegiate tenants</p>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={institutions}
          searchKey="name"
          searchPlaceholder="Search institutions by name or code..."
        />
      </div>

      {/* Create Institution Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Collegiate Tenant"
      >
        <form onSubmit={handleCreateInstitution} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">
              Institution Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Stanford Technical University"
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
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
                placeholder="STU"
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@stu.edu"
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">
                Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 555-0199"
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://stu.edu"
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">
              Address
            </label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Campus address..."
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
            />
          </div>
          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-500 rounded-xl shadow-sm"
            >
              Register College
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
