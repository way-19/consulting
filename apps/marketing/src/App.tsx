import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@consulting19/shared/auth';
import { LanguageProvider } from '@consulting19/shared/language';
import LoadingSpinner from '@consulting19/shared';

// Lazy load components for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ConsultantProfilePage = lazy(() => import('./pages/ConsultantProfilePage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));

// Dashboard imports (will redirect to dashboard app)
const DashboardRedirect = () => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Redirecting to dashboard..." />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to dashboard app based on role
  const dashboardUrl = `${window.location.protocol}//${window.location.hostname}:5174`;
  
  switch (role) {
    case 'admin':
      window.location.href = `${dashboardUrl}/admin`;
      break;
    case 'consultant':
      window.location.href = `${dashboardUrl}/consultant`;
      break;
    case 'client':
      window.location.href = `${dashboardUrl}/client`;
      break;
    default:
      return <Navigate to="/auth" replace />;
  }

  return <LoadingSpinner message="Redirecting to dashboard..." />;
};

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public Marketing Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/consultant/:consultantId" element={<ConsultantProfilePage />} />
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Dashboard Redirect */}
              <Route path="/dashboard" element={<DashboardRedirect />} />
              
              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;