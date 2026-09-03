import React, { useState, useEffect } from 'react';
import { placementService } from '../../services/placementService';
import StatCard from '../../components/common/StatCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import {
  Award,
  TrendingUp,
  Building2,
  Users,
  Download,
  DollarSign,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function PlacementAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const res = await placementService.getAnalytics();
        if (res.success) setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  const handleExport = async () => {
    try {
      const blob = await placementService.exportCSV();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `placement-analytics-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Export failed');
    }
  };

  if (loading) return <LoadingSkeleton rows={6} />;

  const chartData =
    data?.departmentStats?.map((d) => ({
      name: d.department,
      placements: d.count,
    })) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Placement Analytics</h1>
          <p className="text-xs text-slate-500 mt-1">
            Institutional salary distributions, departmental success metrics, and offer logs
          </p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" /> Export Placement CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Average Package"
          value={`${data?.averagePackage || 0} LPA`}
          icon={TrendingUp}
          description="Average institutional compensation"
          variant="teal"
        />
        <StatCard
          title="Highest Package"
          value={`${data?.highestPackage || 0} LPA`}
          icon={Award}
          description="Top tier recruitment offer"
          variant="purple"
        />
        <StatCard
          title="Total Offers Accepted"
          value={data?.totalSelected || 0}
          icon={Users}
          description="Verified corporate selections"
          variant="emerald"
        />
        <StatCard
          title="Active Corporate Partners"
          value={data?.totalCompanies || 0}
          icon={Building2}
          description="Hiring companies"
          variant="blue"
        />
      </div>

      {/* Department Placements Chart */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 mb-4">Department-Wise Placements</h2>
        <div className="h-72 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="placements" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-slate-400">
              No placement offer records available to graph.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
