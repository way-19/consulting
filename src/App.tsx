import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './shared/contexts/AuthContext';
import { LanguageProvider } from './shared/contexts/LanguageContext';
import { useAuth } from './shared/hooks/useAuth';
import LoadingSpinner from './shared/components/LoadingSpinner';

// Public Pages
import HomePage from './public/pages/HomePage';
import ConsultantProfilePage from './public/pages/ConsultantProfilePage';
import AuthPage from './public/pages/AuthPage';

// Dashboard Routers
import AdminRouter from './admin/AdminRouter';
import ConsultantRouter from './consultant/ConsultantRouter';
import ClientRouter from './client/ClientRouter';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/consultant/:consultantId" element={<ConsultantProfilePage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Dashboard Routes */}
            <Route path="/admin/*" element={<ProtectedRoute requiredRole="admin"><AdminRouter /></ProtectedRoute>} />
            <Route path="/consultant/*" element={<ProtectedRoute requiredRole="consultant"><ConsultantRouter /></ProtectedRoute>} />
            <Route path="/client/*" element={<ProtectedRoute requiredRole="client"><ClientRouter /></ProtectedRoute>} />
            
            {/* Default redirect */}
            <Route path="/dashboard" element={<DashboardRedirect />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: 'admin' | 'consultant' | 'client';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Dashboard Redirect Component
const DashboardRedirect = () => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to appropriate dashboard based on role
  switch (role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'consultant':
      return <Navigate to="/consultant" replace />;
    case 'client':
      return <Navigate to="/client" replace />;
    default:
      return <Navigate to="/auth" replace />;
  }
};

export default App;