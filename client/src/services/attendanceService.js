import api from './api';

export const attendanceService = {
  markAttendance: async (data) => {
    const res = await api.post('/attendance', data);
    return res.data;
  },
  getSubjectAttendanceForDate: async (subjectId, date) => {
    const res = await api.get(`/attendance/subject/${subjectId}`, { params: { date } });
    return res.data;
  },
  getStudentAttendance: async (studentId) => {
    const url = studentId ? `/attendance/student/${studentId}` : '/attendance/student';
    const res = await api.get(url);
    return res.data;
  },
  getCollegeReport: async (params) => {
    const res = await api.get('/attendance/report', { params });
    return res.data;
  },
  exportCSV: async (params) => {
    const res = await api.get('/attendance/export', { params, responseType: 'blob' });
    return res.data;
  },
};
