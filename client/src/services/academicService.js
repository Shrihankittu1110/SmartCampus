import api from './api';

export const academicService = {
  // Departments
  getDepartments: async (params) => {
    const res = await api.get('/departments', { params });
    return res.data;
  },
  getDepartmentById: async (id) => {
    const res = await api.get(`/departments/${id}`);
    return res.data;
  },
  createDepartment: async (data) => {
    const res = await api.post('/departments', data);
    return res.data;
  },
  updateDepartment: async (id, data) => {
    const res = await api.put(`/departments/${id}`, data);
    return res.data;
  },
  deleteDepartment: async (id) => {
    const res = await api.delete(`/departments/${id}`);
    return res.data;
  },

  // Courses
  getCourses: async (params) => {
    const res = await api.get('/courses', { params });
    return res.data;
  },
  getCourseById: async (id) => {
    const res = await api.get(`/courses/${id}`);
    return res.data;
  },
  createCourse: async (data) => {
    const res = await api.post('/courses', data);
    return res.data;
  },
  updateCourse: async (id, data) => {
    const res = await api.put(`/courses/${id}`, data);
    return res.data;
  },
  deleteCourse: async (id) => {
    const res = await api.delete(`/courses/${id}`);
    return res.data;
  },

  // Subjects
  getSubjects: async (params) => {
    const res = await api.get('/subjects', { params });
    return res.data;
  },
  getMySubjects: async () => {
    const res = await api.get('/subjects/my-subjects');
    return res.data;
  },
  getSubjectById: async (id) => {
    const res = await api.get(`/subjects/${id}`);
    return res.data;
  },
  createSubject: async (data) => {
    const res = await api.post('/subjects', data);
    return res.data;
  },
  updateSubject: async (id, data) => {
    const res = await api.put(`/subjects/${id}`, data);
    return res.data;
  },
  deleteSubject: async (id) => {
    const res = await api.delete(`/subjects/${id}`);
    return res.data;
  },
  getSubjectStudents: async (subjectId) => {
    const res = await api.get(`/subjects/${subjectId}/students`);
    return res.data;
  },

  // Grades
  recordGrade: async (data) => {
    const res = await api.post('/grades', data);
    return res.data;
  },
  getStudentGrades: async (studentId) => {
    const url = studentId ? `/grades/student/${studentId}` : '/grades/student';
    const res = await api.get(url);
    return res.data;
  },
  getSubjectGrades: async (subjectId) => {
    const res = await api.get(`/grades/subject/${subjectId}`);
    return res.data;
  },
};
