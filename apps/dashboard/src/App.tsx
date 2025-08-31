import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@consulting19/shared';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardRouter from './components/DashboardRouter';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            
            {/* Dashboard Routes - Role-based routing */}
            <Route path="/admin/*" element={<DashboardRouter requiredRole="admin" />} />
            <Route path="/consultant/*" element={<DashboardRouter requiredRole="consultant" />} />
            <Route path="/client/*" element={<DashboardRouter requiredRole="client" />} />
            
            {/* Default redirect based on user role or to login */}
            <Route path="/" element={<DefaultRedirect />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Default redirect component
const DefaultRedirect = () => {
  const { user, role, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect to appropriate dashboard based on role
  if (role === 'admin') return <Navigate to="/admin" replace />;
  if (role === 'consultant') return <Navigate to="/consultant" replace />;
  if (role === 'client') return <Navigate to="/client" replace />;
  
  return <Navigate to="/login" replace />;
};

export default App;