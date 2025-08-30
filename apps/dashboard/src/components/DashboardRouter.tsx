import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@consulting19/shared';
import LoadingSpinner from './LoadingSpinner';

// Admin Components
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminContent from '../pages/admin/AdminContent';
import AdminFinancial from '../pages/admin/AdminFinancial';
import AdminEmailTemplates from '../pages/admin/AdminEmailTemplates';
import AdminSettings from '../pages/admin/AdminSettings';
import AdminAnalytics from '../pages/admin/AdminAnalytics';

// Consultant Components
import ConsultantDashboard from '../pages/consultant/ConsultantDashboard';
import ConsultantServices from '../pages/consultant/ConsultantServices';
import ConsultantClients from '../pages/consultant/ConsultantClients';
import ConsultantContent from '../pages/consultant/ConsultantContent';
import ConsultantTasks from '../pages/consultant/ConsultantTasks';
import ConsultantDocuments from '../pages/consultant/ConsultantDocuments';
import ConsultantAvailability from '../pages/consultant/ConsultantAvailability';

// Client Components
import ClientDashboard from '../pages/client/ClientDashboard';
import ClientProjects from '../pages/client/ClientProjects';
import ClientTasks from '../pages/client/ClientTasks';
import ClientDocuments from '../pages/client/ClientDocuments';
import ClientServices from '../pages/client/ClientServices';
import ClientMessages from '../pages/client/ClientMessages';
import ClientBilling from '../pages/client/ClientBilling';
import ClientSettings from '../pages/client/ClientSettings';
import ClientOnboarding from '../pages/client/ClientOnboarding';

interface DashboardRouterProps {
  requiredRole: 'admin' | 'consultant' | 'client';
}

const DashboardRouter: React.FC<DashboardRouterProps> = ({ requiredRole }) => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== requiredRole) {
    // Redirect to correct dashboard based on user role
    if (userRole === 'admin') return <Navigate to="/admin" replace />;
    if (userRole === 'consultant') return <Navigate to="/consultant" replace />;
    if (userRole === 'client') return <Navigate to="/client" replace />;
    return <Navigate to="/login" replace />;
  }

  // Admin Routes
  if (requiredRole === 'admin') {
    return (
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/content" element={<AdminContent />} />
        <Route path="/financial" element={<AdminFinancial />} />
        <Route path="/email-templates" element={<AdminEmailTemplates />} />
        <Route path="/settings" element={<AdminSettings />} />
        <Route path="/analytics" element={<AdminAnalytics />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  // Consultant Routes
  if (requiredRole === 'consultant') {
    return (
      <Routes>
        <Route path="/" element={<ConsultantDashboard />} />
        <Route path="/clients" element={<ConsultantClients />} />
        <Route path="/tasks" element={<ConsultantTasks />} />
        <Route path="/documents" element={<ConsultantDocuments />} />
        <Route path="/availability" element={<ConsultantAvailability />} />
        <Route path="/services" element={<ConsultantServices />} />
        <Route path="/content" element={<ConsultantContent />} />
        <Route path="*" element={<Navigate to="/consultant" replace />} />
      </Routes>
    );
  }

  // Client Routes
  if (requiredRole === 'client') {
    return (
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
        <Route path="*" element={<Navigate to="/client" replace />} />
      </Routes>
    );
  }

  return <Navigate to="/login" replace />;
};

export default DashboardRouter;