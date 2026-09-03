import React, { useState, useEffect } from 'react';
import { activityLogService } from '../../services/analyticsService';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Activity, Shield } from 'lucide-react';

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const res = await activityLogService.getAll({ limit: 50 });
      if (res.success) setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const columns = [
    {
      header: 'Timestamp',
      render: (row) => (
        <span className="text-xs text-slate-500 font-mono">
          {new Date(row.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'User',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800 text-xs">{row.userId?.name || 'System'}</p>
          <p className="text-[10px] text-slate-400">{row.userId?.email || 'N/A'}</p>
        </div>
      ),
    },
    {
      header: 'Action',
      render: (row) => <Badge variant="teal">{row.action}</Badge>,
    },
    {
      header: 'Target Entity',
      render: (row) => (
        <span className="text-xs text-slate-700 font-medium">{row.entity}</span>
      ),
    },
    {
      header: 'IP Address',
      render: (row) => (
        <span className="text-xs text-slate-400 font-mono">{row.ipAddress || '127.0.0.1'}</span>
      ),
    },
  ];

  if (loading) return <LoadingSkeleton rows={6} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Security & Activity Audit Logs</h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable system audit trail tracking authentication, grading, and administrative actions
          </p>
        </div>
      </div>

      <DataTable columns={columns} data={logs} searchKey="action" searchPlaceholder="Search action..." />
    </div>
  );
}
