import React from 'react';
import { useAuth } from '../../context/AuthContext';
import SuperAdminDashboard from './SuperAdminDashboard';
import CollegeAdminDashboard from './CollegeAdminDashboard';
import FacultyDashboard from './FacultyDashboard';
import StudentDashboard from './StudentDashboard';
import PlacementDashboard from './PlacementDashboard';

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;

  switch (user.role) {
    case 'SUPER_ADMIN':
      return <SuperAdminDashboard />;
    case 'COLLEGE_ADMIN':
      return <CollegeAdminDashboard />;
    case 'FACULTY':
      return <FacultyDashboard />;
    case 'STUDENT':
      return <StudentDashboard />;
    case 'PLACEMENT_OFFICER':
      return <PlacementDashboard />;
    default:
      return <StudentDashboard />;
  }
}
