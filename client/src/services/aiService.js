import api from './api';

export const aiService = {
  getPerformanceSummary: async (studentId) => {
    const res = await api.post('/ai/performance-summary', { studentId });
    return res.data;
  },
  getWeakSubjects: async (studentId) => {
    const url = studentId ? `/ai/weak-subjects/${studentId}` : '/ai/weak-subjects';
    const res = await api.get(url);
    return res.data;
  },
  createStudyPlan: async (payload) => {
    const res = await api.post('/ai/study-plan', payload);
    return res.data;
  },
  getRecommendations: async (subjectName, topic) => {
    const res = await api.get('/ai/recommendations', {
      params: { subjectName, topic },
    });
    return res.data;
  },
};
