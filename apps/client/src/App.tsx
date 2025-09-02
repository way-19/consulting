import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, LoadingSpinner } from '@consulting19/shared';
import LoginPage from './pages/auth/LoginPage';
import ClientLayout from './components/layouts/ClientLayout';
import ClientDashboard from './pages/client/ClientDashboard';
import ClientProjects from './pages/client/ClientProjects';
import ClientTasks from './pages/client/ClientTasks';
import ClientDocuments from './pages/client/ClientDocuments';
import ClientServices from './pages/client/ClientServices';
import ClientMessages from './pages/client/ClientMessages';
import ClientBilling from './pages/client/ClientBilling';
import ClientSettings from './pages/client/ClientSettings';
import ClientOnboarding from './pages/client/ClientOnboarding';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={<ProtectedClientRoutes />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

const ProtectedClientRoutes = () => {
  const { user, role, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-6 animate-pulse">
            <span className="text-white font-bold text-xl">C19</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Client Dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Only redirect if user has admin or consultant role
  if (role === 'admin') {
    window.location.href = 'http://localhost:5174'; // Admin panel
    return null;
  }
  
  if (role === 'consultant') {
    window.location.href = 'http://localhost:5175'; // Consultant panel
    return null;
  }
  
  return (
    <ClientLayout>
      <Routes>
        <Route path="/" element={<ClientDashboard />} />
        <Route path="/projects" element={<ClientProjects />} />
        <Route path="/tasks" element={<ClientTasks />} />
        <Route path="/documents" element={<ClientDocuments />} />
        <Route path="/services" element={<ClientServices />} />
        <Route path="/messages" element={<ClientMessages />} />
        <Route path="/billing" element={<ClientBilling />} />
        <Route path="/settings" element={<ClientSettings />} />
        <Route path="/onboarding" element={<ClientOnboarding />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ClientLayout>
  );
};

export default App;