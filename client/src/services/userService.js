import api from './api';

export const userService = {
  getAll: async (params) => {
    const res = await api.get('/users', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/users', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
  },
  toggleStatus: async (id) => {
    const res = await api.patch(`/users/${id}/toggle-status`);
    return res.data;
  },
  exportCSV: async (params) => {
    const res = await api.get('/users/export', { params, responseType: 'blob' });
    return res.data;
  },
};
