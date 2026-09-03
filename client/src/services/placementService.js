import api from './api';

export const placementService = {
  // Companies
  getCompanies: async (params) => {
    const res = await api.get('/placements/companies', { params });
    return res.data;
  },
  createCompany: async (data) => {
    const res = await api.post('/placements/companies', data);
    return res.data;
  },
  updateCompany: async (id, data) => {
    const res = await api.put(`/placements/companies/${id}`, data);
    return res.data;
  },

  // Drives
  getDrives: async (params) => {
    const res = await api.get('/placements/drives', { params });
    return res.data;
  },
  getDriveById: async (id) => {
    const res = await api.get(`/placements/drives/${id}`);
    return res.data;
  },
  createDrive: async (data) => {
    const res = await api.post('/placements/drives', data);
    return res.data;
  },
  apply: async (id, formData) => {
    const res = await api.post(`/placements/drives/${id}/apply`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  getDriveApplications: async (id) => {
    const res = await api.get(`/placements/drives/${id}/applications`);
    return res.data;
  },

  // Applications
  getMyApplications: async () => {
    const res = await api.get('/placements/my-applications');
    return res.data;
  },
  updateApplicationStatus: async (applicationId, data) => {
    const res = await api.put(`/placements/applications/${applicationId}/status`, data);
    return res.data;
  },

  // Interviews
  createInterviewStage: async (data) => {
    const res = await api.post('/placements/interviews', data);
    return res.data;
  },
  getInterviewStages: async (applicationId) => {
    const res = await api.get(`/placements/interviews/${applicationId}`);
    return res.data;
  },
  updateInterviewStage: async (stageId, data) => {
    const res = await api.put(`/placements/interviews/${stageId}`, data);
    return res.data;
  },

  // Outcomes
  recordOutcome: async (data) => {
    const res = await api.post('/placements/outcomes', data);
    return res.data;
  },

  // Analytics & Export
  getAnalytics: async () => {
    const res = await api.get('/placements/analytics');
    return res.data;
  },
  exportCSV: async () => {
    const res = await api.get('/placements/export', { responseType: 'blob' });
    return res.data;
  },
};
