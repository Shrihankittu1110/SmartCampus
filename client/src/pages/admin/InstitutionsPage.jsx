import React, { useState, useEffect } from 'react';
import { institutionService } from '../../services/institutionService';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Plus, Building2, ExternalLink } from 'lucide-react';

export default function InstitutionsPage() {
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
      const res = await institutionService.getAll({ limit: 50 });
      if (res.success) setInstitutions(res.data);
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
      await institutionService.create(formData);
      setIsModalOpen(false);
      setFormData({ name: '', code: '', email: '', phone: '', website: '', address: '' });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create institution');
    }
  };

  const columns = [
    {
      header: 'College Name',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800">{row.name}</p>
          <p className="text-xs text-slate-400">{row.address || '—'}</p>
        </div>
      ),
    },
    {
      header: 'Code',
      render: (row) => <Badge variant="teal">{row.code}</Badge>,
    },
    {
      header: 'Contact Email',
      render: (row) => <span className="text-xs text-slate-700">{row.email}</span>,
    },
    {
      header: 'Website',
      render: (row) =>
        row.website ? (
          <a
            href={row.website}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
          >
            Visit <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-xs text-slate-400">—</span>
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
          <h1 className="text-2xl font-bold text-slate-800">Institutions Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage registered colleges, multi-tenant boundaries, and institutional settings
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Register Institution
        </button>
      </div>

      <DataTable columns={columns} data={institutions} searchKey="name" />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New College">
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">Institution Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">Code</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">Address</label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
              Create Institution
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
