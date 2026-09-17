import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts & Guard
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';
import RouteLoadingScreen from '../components/common/RouteLoadingScreen';

// Lazy-loaded Public & Auth Pages
const HomePage = lazy(() => import('../pages/public/HomePage'));
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('../pages/auth/VerifyEmail'));

// Lazy-loaded Dashboard & Role Pages
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));

// Lazy-loaded Admin Pages
const InstitutionsPage = lazy(() => import('../pages/admin/InstitutionsPage'));
const UsersPage = lazy(() => import('../pages/admin/UsersPage'));
const DepartmentsPage = lazy(() => import('../pages/admin/DepartmentsPage'));
const CoursesPage = lazy(() => import('../pages/admin/CoursesPage'));
const SubjectsPage = lazy(() => import('../pages/admin/SubjectsPage'));
const ActivityLogsPage = lazy(() => import('../pages/admin/ActivityLogsPage'));

// Lazy-loaded Academic / Faculty Pages
const AttendanceManager = lazy(() => import('../pages/faculty/AttendanceManager'));
const AssignmentsPage = lazy(() => import('../pages/faculty/AssignmentsPage'));

// Lazy-loaded Student Pages
const StudentAttendancePage = lazy(() => import('../pages/student/StudentAttendancePage'));
const StudentAssignmentsPage = lazy(() => import('../pages/student/StudentAssignmentsPage'));
const StudentGradesPage = lazy(() => import('../pages/student/StudentGradesPage'));
const StudentRequestsPage = lazy(() => import('../pages/student/StudentRequestsPage'));
const StudentPlacementsPage = lazy(() => import('../pages/student/StudentPlacementsPage'));
const AIStudyAssistantPage = lazy(() => import('../pages/student/AIStudyAssistantPage'));

// Lazy-loaded Placement Pages
const CompaniesPage = lazy(() => import('../pages/placement/CompaniesPage'));
const JobDrivesPage = lazy(() => import('../pages/placement/JobDrivesPage'));
const PlacementAnalyticsPage = lazy(() => import('../pages/placement/PlacementAnalyticsPage'));

// Lazy-loaded Shared Pages
const EventsPage = lazy(() => import('../pages/shared/EventsPage'));
const AnnouncementsPage = lazy(() => import('../pages/shared/AnnouncementsPage'));
const ProfilePage = lazy(() => import('../pages/shared/ProfilePage'));
const NotFound = lazy(() => import('../pages/shared/NotFound'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoadingScreen />}>
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

            {/* Super Admin */}
            <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
              <Route path="/admin/institutions" element={<InstitutionsPage />} />
            </Route>

            {/* Super Admin & College Admin */}
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
    </Suspense>
  );
}
