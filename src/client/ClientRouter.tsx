import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ClientLayout from './components/ClientLayout';
import ClientDashboard from './pages/ClientDashboard';
import ClientProjects from './pages/ClientProjects';
import ClientServices from './pages/ClientServices';
import ClientMessages from './pages/ClientMessages';

const ClientRouter = () => {
  return (
    <ClientLayout>
      <Routes>
        <Route path="/" element={<ClientDashboard />} />
        <Route path="/projects" element={<ClientProjects />} />
        <Route path="/services" element={<ClientServices />} />
        <Route path="/messages" element={<ClientMessages />} />
        <Route path="*" element={<Navigate to="/client" replace />} />
      </Routes>
    </ClientLayout>
  );
};

export default ClientRouter;