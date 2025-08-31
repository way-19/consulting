import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ConsultantLayout from './components/ConsultantLayout';
import ConsultantDashboard from './pages/ConsultantDashboard';
import ConsultantServices from './pages/ConsultantServices';
import ConsultantClients from './pages/ConsultantClients';
import ConsultantProjects from './pages/ConsultantProjects';

const ConsultantRouter = () => {
  return (
    <ConsultantLayout>
      <Routes>
        <Route path="/" element={<ConsultantDashboard />} />
        <Route path="/services" element={<ConsultantServices />} />
        <Route path="/clients" element={<ConsultantClients />} />
        <Route path="/projects" element={<ConsultantProjects />} />
        <Route path="*" element={<Navigate to="/consultant" replace />} />
      </Routes>
    </ConsultantLayout>
  );
};

export default ConsultantRouter;