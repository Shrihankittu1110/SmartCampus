import api from './api';

export const eventService = {
  getAll: async (params) => {
    const res = await api.get('/events', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/events/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/events', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/events/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/events/${id}`);
    return res.data;
  },
  register: async (id) => {
    const res = await api.post(`/events/${id}/register`);
    return res.data;
  },
  cancelRegistration: async (id) => {
    const res = await api.post(`/events/${id}/cancel-registration`);
    return res.data;
  },
};
