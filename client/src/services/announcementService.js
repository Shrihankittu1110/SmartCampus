import api from './api';

export const announcementService = {
  getAll: async (params) => {
    const res = await api.get('/announcements', { params });
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/announcements', data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/announcements/${id}`);
    return res.data;
  },
};
