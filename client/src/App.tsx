import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LandingPage } from './pages/LandingPage';
import { ScamDatabasePage } from './pages/ScamDatabasePage';
import { ReportActivityPage } from './pages/ReportActivityPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { DemoRoleSwitcherWidget } from './components/common/DemoRoleSwitcherWidget';

// Protected Route for Analyst & Admin
const AnalystRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAnalyst, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080A0D] flex items-center justify-center font-mono text-xs text-gray-500">
        Verifying Sentinel Authorization Credentials...
      </div>
    );
  }

  if (!isAuthenticated || !isAnalyst) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Protected Route for Admin only
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080A0D] flex items-center justify-center font-mono text-xs text-gray-500">
        Verifying Administrative Credentials...
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/scams" element={<ScamDatabasePage />} />
              <Route path="/report" element={<ReportActivityPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/dashboard"
                element={
                  <AnalystRoute>
                    <DashboardPage />
                  </AnalystRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Hackathon Demo Role Switcher & Attack Simulator Floating Widget */}
            <DemoRoleSwitcherWidget />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;


