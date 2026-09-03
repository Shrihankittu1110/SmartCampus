import api from './api';

export const requestService = {
  create: async (formData) => {
    const res = await api.post('/requests', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  getMyRequests: async () => {
    const res = await api.get('/requests/my-requests');
    return res.data;
  },
  getAllRequests: async (params) => {
    const res = await api.get('/requests', { params });
    return res.data;
  },
  updateStatus: async (id, data) => {
    const res = await api.put(`/requests/${id}/status`, data);
    return res.data;
  },
};
