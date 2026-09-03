import api from './api';

export const institutionService = {
  getAll: async (params) => {
    const res = await api.get('/institutions', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/institutions/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/institutions', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/institutions/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/institutions/${id}`);
    return res.data;
  },
};
