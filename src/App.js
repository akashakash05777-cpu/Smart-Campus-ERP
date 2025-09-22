import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DepartmentProvider } from "./contexts/DepartmentContext";
import { DataProvider } from "./contexts/DataContext";
import Layout from "./components/Layout";
import UnifiedLogin from "./components/UnifiedLogin";
import Dashboard from "./components/Dashboard";
import StudentDashboard from "./components/StudentDashboard";
import StaffDashboard from "./components/StaffDashboard";
import StudentGrades from "./components/StudentGrades";
import StudentAttendance from "./components/StudentAttendance";
import StudentAssignments from "./components/StudentAssignments";
import StudentLibrary from "./components/StudentLibrary";
import DepartmentDashboard from "./components/DepartmentDashboard";
import DepartmentStudents from "./components/DepartmentStudents";
import DepartmentAttendance from "./components/DepartmentAttendance";
import LeaveRequests from "./components/LeaveRequests";
import DepartmentNotifications from "./components/DepartmentNotifications";
import Admissions from "./components/Admissions";
import FeeCollection from "./components/FeeCollection";
import HostelAllocation from "./components/HostelAllocation";
import ExaminationRecords from "./components/ExaminationRecords";
import AttendanceManagement from "./components/AttendanceManagement";
import StaffManagement from "./components/StaffManagement";
import TransportManagement from "./components/TransportManagement";
import LibraryManagement from "./components/LibraryManagement";
import Notifications from "./components/Notifications";
import Settings from "./components/Settings";

// Role-based route protection
const ProtectedRoute = ({ children, allowedRoles, adminOnly = false, departmentHeadOnly = false }) => {
  const { user, isAdmin, isDepartmentHead, isAcademicStaff, isAdministrativeStaff } = useAuth();
  
  // Check admin-only access
  if (adminOnly && !isAdmin()) {
    return <Dashboard />;
  }
  
  // Department head functionality removed - no longer supported
  
  // Check role-based access (admin and student only)
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Additional role checking with new functions
    const hasAccess = allowedRoles.some(role => {
      switch (role) {
        case 'Administrator':
        case 'IT Admin':
          return isAdmin();
        default:
          return user?.role === role;
      }
    });
    
    if (!hasAccess) {
      return <Dashboard />;
    }
  }
  
  return children;
};

// Protected Routes Component

// Protected Routes Component
const ProtectedApp = () => {
  const { user, isLoading, authenticateUser } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    // Use the unified login component for all user types
    return <UnifiedLogin onLogin={authenticateUser} />;
  }

  // Single Routes component for all user roles
  return (
    <DepartmentProvider>
      <Routes key={user?.role || 'default'}>
        <Route path="/" element={
          <Layout key="home">
            {user?.role === 'Student' ? <StudentDashboard /> : 
             user?.role === 'Staff' ? <StaffDashboard /> : <Dashboard />}
          </Layout>
        } />
        <Route path="/dashboard" element={
          <Layout key="dashboard">
            {user?.role === 'Student' ? <StudentDashboard /> : 
             user?.role === 'Staff' ? <StaffDashboard /> : <Dashboard />}
          </Layout>
        } />
        <Route path="/grades" element={<Layout key="grades"><StudentGrades /></Layout>} />
        <Route path="/attendance" element={
          <Layout key="attendance">
            {user?.role === 'Student' ? <StudentAttendance /> : <AttendanceManagement />}
          </Layout>
        } />
        <Route path="/assignments" element={<Layout key="assignments"><StudentAssignments /></Layout>} />
        <Route path="/library" element={
          <Layout key="library">
            {user?.role === 'Student' ? <StudentLibrary /> : <LibraryManagement />}
          </Layout>
        } />
        <Route path="/students" element={
          <Layout>
            <ProtectedRoute allowedRoles={['Administrator', 'IT Admin', 'Staff']}>
              <DepartmentStudents />
            </ProtectedRoute>
          </Layout>
        } />
        <Route path="/leave-requests" element={<Layout><LeaveRequests /></Layout>} />
        <Route path="/notifications" element={
          <Layout>
            <Notifications />
          </Layout>
        } />
        <Route path="/admissions" element={<Layout><Admissions /></Layout>} />
        <Route 
          path="/fees" 
          element={
            <Layout>
              <ProtectedRoute allowedRoles={['Administrator', 'IT Admin']}>
                <FeeCollection />
              </ProtectedRoute>
            </Layout>
          } 
        />
        <Route 
          path="/hostel" 
          element={
            <Layout>
              <ProtectedRoute allowedRoles={['Administrator', 'IT Admin']}>
                <HostelAllocation />
              </ProtectedRoute>
            </Layout>
          } 
        />
        <Route 
          path="/exams" 
          element={
            <Layout>
              <ProtectedRoute allowedRoles={['Administrator', 'IT Admin']}>
                <ExaminationRecords />
              </ProtectedRoute>
            </Layout>
          } 
        />

        <Route 
          path="/staff" 
          element={
            <Layout>
              <ProtectedRoute adminOnly={true}>
                <StaffManagement />
              </ProtectedRoute>
            </Layout>
          } 
        />
        <Route 
          path="/staff" 
          element={
            <Layout>
              <ProtectedRoute allowedRoles={['Administrator', 'IT Admin']}>
                <StaffManagement />
              </ProtectedRoute>
            </Layout>
          } 
        />
        <Route 
          path="/transport" 
          element={
            <Layout>
              <ProtectedRoute allowedRoles={['Administrator', 'IT Admin']}>
                <TransportManagement />
              </ProtectedRoute>
            </Layout>
          } 
        />


        <Route path="/settings" element={<Layout key="settings"><Settings /></Layout>} />
        <Route path="*" element={
          <Layout key="fallback">
            {user?.role === 'Student' ? <StudentDashboard /> : 
             user?.role === 'Academic Staff' ? <DepartmentDashboard /> : <Dashboard />}
          </Layout>
        } />
      </Routes>
    </DepartmentProvider>
  );
};

function NotFound() {
  return <div style={{ padding: 32, textAlign: 'center' }}><h1>404 - Not Found</h1></div>;
}

function App() {
  // Determine basename dynamically: use GH Pages base only when hosted on github.io
  const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');
  const routerBasename = isGitHubPages ? '/Smart-Campus-ERP' : undefined;
  return (
    <div className="App">
      <AuthProvider>
        <DataProvider>
          <BrowserRouter basename={routerBasename}>
            <ProtectedApp />
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </div>
  );
}

export default App;