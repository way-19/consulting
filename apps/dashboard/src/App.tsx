import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@consulting19/shared';
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
            
            {/* Default redirect to marketing site */}
            <Route path="/" element={<Navigate to="https://consulting19.com" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;