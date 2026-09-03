import api from './api';

export const assignmentService = {
  getAll: async (params) => {
    const res = await api.get('/assignments', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/assignments/${id}`);
    return res.data;
  },
  create: async (formData) => {
    const res = await api.post('/assignments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  submit: async (id, formData) => {
    const res = await api.post(`/assignments/${id}/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  getSubmissions: async (id) => {
    const res = await api.get(`/assignments/${id}/submissions`);
    return res.data;
  },
  gradeSubmission: async (submissionId, data) => {
    const res = await api.put(`/assignments/submissions/${submissionId}/grade`, data);
    return res.data;
  },
};
