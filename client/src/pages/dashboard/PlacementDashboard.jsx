import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService';
import { placementService } from '../../services/placementService';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import {
  Building2,
  Briefcase,
  Users,
  CheckCircle2,
  Award,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function PlacementDashboard() {
  const [stats, setStats] = useState(null);
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [statsRes, drivesRes] = await Promise.all([
          analyticsService.getDashboardStats(),
          placementService.getDrives({ limit: 10 }),
        ]);
        if (statsRes.success) setStats(statsRes.data);
        if (drivesRes.success) setDrives(drivesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <LoadingSkeleton rows={6} />;

  const columns = [
    {
      header: 'Company & Role',
      render: (row) => (
        <div>
          <p className="font-bold text-slate-800">{row.title}</p>
          <p className="text-xs text-slate-400">{row.companyId?.name || 'Partner'}</p>
        </div>
      ),
    },
    {
      header: 'Package',
      render: (row) => (
        <span className="font-black text-indigo-700 text-xs bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
          {row.package?.ctc || 0} LPA
        </span>
      ),
    },
    {
      header: 'Min CGPA',
      render: (row) => (
        <span className="text-xs text-slate-600 font-medium">
          {row.eligibilityRules?.minCGPA ? `${row.eligibilityRules.minCGPA}+` : 'Open'}
        </span>
      ),
    },
    {
      header: 'Deadline',
      render: (row) => (
        <span className="text-xs text-slate-500 font-mono">
          {new Date(row.applicationDeadline).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'PUBLISHED' ? 'emerald' : 'slate'}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <Link
          to={`/placement/drives/${row._id}`}
          className="text-xs text-indigo-600 hover:text-indigo-700 font-bold inline-flex items-center gap-1 group"
        >
          Manage Applicants <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-7">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-[#18112b] to-[#2e1065] p-7 text-white shadow-xl border border-purple-900/40">
        <div className="absolute top-0 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-60 h-60 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold backdrop-blur-xs">
              <Award className="w-3.5 h-3.5" />
              Corporate Relations & Career Placement Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Placement Command Center
            </h1>
            <p className="text-xs text-purple-200/80 max-w-xl leading-relaxed">
              Coordinate campus recruitment cycles, evaluate server-side candidate eligibility, and track interview pipelines.
            </p>
          </div>

          <div className="flex gap-2.5 flex-shrink-0">
            <Link
              to="/placement/companies"
              className="px-4 py-2.5 border border-purple-500/30 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs backdrop-blur-xs transition-all"
            >
              Recruiters
            </Link>
            <Link
              to="/placement/drives"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:brightness-105 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-purple-500/25 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Post Job Drive
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Recruiters"
          value={stats?.companiesCount || 0}
          icon={Building2}
          description="Active corporate partners"
          variant="purple"
        />
        <StatCard
          title="Active Drives"
          value={stats?.activeDrivesCount || 0}
          icon={Briefcase}
          description="Live recruitment cycles"
          variant="indigo"
        />
        <StatCard
          title="Applications"
          value={stats?.applicationsCount || 0}
          icon={Users}
          description="Submitted candidates"
          variant="blue"
        />
        <StatCard
          title="Shortlisted"
          value={stats?.shortlistedCount || 0}
          icon={CheckCircle2}
          description="In evaluation rounds"
          variant="amber"
        />
        <StatCard
          title="Offers Made"
          value={stats?.selectedCount || 0}
          icon={Award}
          description="Accepted packages"
          variant="emerald"
        />
      </div>

      {/* Active Drives Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-800">Live Campus Recruitment Drives</h2>
            <p className="text-xs text-slate-400">Current season corporate placement drives</p>
          </div>
          <Link
            to="/placement/analytics"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            Placement Analytics <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <DataTable columns={columns} data={drives} searchKey="title" />
      </div>
    </div>
  );
}
