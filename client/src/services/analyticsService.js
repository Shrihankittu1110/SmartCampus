import api from './api';

export const analyticsService = {
  getDashboardStats: async () => {
    const res = await api.get('/analytics/dashboard');
    return res.data;
  },
};

export const activityLogService = {
  getAll: async (params) => {
    const res = await api.get('/activity-logs', { params });
    return res.data;
  },
};

export const notificationService = {
  getMyNotifications: async () => {
    const res = await api.get('/notifications');
    return res.data;
  },
  markAsRead: async (id) => {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data;
  },
  markAllAsRead: async () => {
    const res = await api.patch('/notifications/read-all');
    return res.data;
  },
};
