import React, { useState, useEffect } from 'react';
import { placementService } from '../../services/placementService';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Plus, Building2, ExternalLink } from 'lucide-react';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    industry: 'Technology',
    website: '',
    location: '',
    contactPerson: '',
    contactEmail: '',
    packageRange: '',
    description: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await placementService.getCompanies();
      if (res.success) setCompanies(res.data || []);
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
      await placementService.createCompany(formData);
      setIsModalOpen(false);
      setFormData({
        name: '',
        industry: 'Technology',
        website: '',
        location: '',
        contactPerson: '',
        contactEmail: '',
        packageRange: '',
        description: '',
      });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create company');
    }
  };

  const columns = [
    {
      header: 'Company',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800">{row.name}</p>
          <p className="text-xs text-slate-400">{row.industry}</p>
        </div>
      ),
    },
    {
      header: 'Location',
      render: (row) => <span className="text-xs text-slate-600">{row.location || '—'}</span>,
    },
    {
      header: 'CTC Range',
      render: (row) => (
        <span className="text-xs font-semibold text-teal-700">{row.packageRange || 'Competitive'}</span>
      ),
    },
    {
      header: 'Recruiter Contact',
      render: (row) => (
        <div className="text-xs">
          <p className="text-slate-700">{row.contactPerson || 'HR Team'}</p>
          <p className="text-slate-400">{row.contactEmail || '—'}</p>
        </div>
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
            className="text-xs text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
          >
            Visit <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        ),
    },
  ];

  if (loading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Corporate Recruiters</h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain campus recruitment partnerships, corporate contacts, and hiring portfolios
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Register Company
        </button>
      </div>

      <DataTable columns={columns} data={companies} searchKey="name" />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Partner Company">
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">Company Name</label>
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
              <label className="block text-xs font-semibold text-slate-700 uppercase">Industry Domain</label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">Typical CTC Range</label>
              <input
                type="text"
                placeholder="e.g. 18 - 32 LPA"
                value={formData.packageRange}
                onChange={(e) => setFormData({ ...formData, packageRange: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">Contact Person</label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">Contact Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">Locations</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
              Save Company
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
