import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import VerifyEmail from '../pages/auth/VerifyEmail';

// Dashboard & Role Pages
import Dashboard from '../pages/dashboard/Dashboard';

// Admin Pages
import InstitutionsPage from '../pages/admin/InstitutionsPage';
import UsersPage from '../pages/admin/UsersPage';
import DepartmentsPage from '../pages/admin/DepartmentsPage';
import CoursesPage from '../pages/admin/CoursesPage';
import SubjectsPage from '../pages/admin/SubjectsPage';
import ActivityLogsPage from '../pages/admin/ActivityLogsPage';

// Academic / Faculty
import AttendanceManager from '../pages/faculty/AttendanceManager';
import AssignmentsPage from '../pages/faculty/AssignmentsPage';

// Student
import StudentAttendancePage from '../pages/student/StudentAttendancePage';
import StudentAssignmentsPage from '../pages/student/StudentAssignmentsPage';
import StudentGradesPage from '../pages/student/StudentGradesPage';
import StudentRequestsPage from '../pages/student/StudentRequestsPage';
import StudentPlacementsPage from '../pages/student/StudentPlacementsPage';
import AIStudyAssistantPage from '../pages/student/AIStudyAssistantPage';

// Placements
import CompaniesPage from '../pages/placement/CompaniesPage';
import JobDrivesPage from '../pages/placement/JobDrivesPage';
import PlacementAnalyticsPage from '../pages/placement/PlacementAnalyticsPage';

// Public Home Page
import HomePage from '../pages/public/HomePage';

// Shared
import EventsPage from '../pages/shared/EventsPage';
import AnnouncementsPage from '../pages/shared/AnnouncementsPage';
import ProfilePage from '../pages/shared/ProfilePage';
import NotFound from '../pages/shared/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Home Page */}
      <Route path="/" element={<HomePage />} />

      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Route>

      {/* Protected Application Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Super Admin & College Admin */}
          <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
            <Route path="/admin/institutions" element={<InstitutionsPage />} />
          </Route>

          <Route
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN']} />
            }
          >
            <Route path="/admin/departments" element={<DepartmentsPage />} />
            <Route path="/admin/courses" element={<CoursesPage />} />
            <Route path="/activity-logs" element={<ActivityLogsPage />} />
          </Route>

          <Route
            element={
              <ProtectedRoute
                allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'FACULTY', 'PLACEMENT_OFFICER']}
              />
            }
          >
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/subjects" element={<SubjectsPage />} />
          </Route>

          {/* Faculty & Staff */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={['FACULTY', 'COLLEGE_ADMIN', 'SUPER_ADMIN']}
              />
            }
          >
            <Route path="/faculty/attendance" element={<AttendanceManager />} />
            <Route path="/faculty/assignments" element={<AssignmentsPage />} />
          </Route>

          {/* Student */}
          <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
            <Route path="/student/attendance" element={<StudentAttendancePage />} />
            <Route path="/student/assignments" element={<StudentAssignmentsPage />} />
            <Route path="/student/grades" element={<StudentGradesPage />} />
            <Route path="/student/placements" element={<StudentPlacementsPage />} />
            <Route path="/student/ai-study-assistant" element={<AIStudyAssistantPage />} />
          </Route>

          {/* Placements */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={['PLACEMENT_OFFICER', 'COLLEGE_ADMIN', 'SUPER_ADMIN']}
              />
            }
          >
            <Route path="/placement/companies" element={<CompaniesPage />} />
            <Route path="/placement/drives" element={<JobDrivesPage />} />
            <Route path="/placement/drives/:id" element={<JobDrivesPage />} />
            <Route path="/placement/analytics" element={<PlacementAnalyticsPage />} />
          </Route>

          {/* Shared Routes */}
          <Route path="/student/requests" element={<StudentRequestsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* 404 Wildcard */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
