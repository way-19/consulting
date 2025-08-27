import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@consulting19/shared';
import ClientDashboard from './pages/ClientDashboard';
import ProjectDetails from './pages/ProjectDetails';
import Documents from './pages/Documents';
import Billing from './pages/Billing';
import Settings from './pages/Settings';

import ClientDashboard from './pages/ClientDashboard';
import ProjectDetails from './pages/ProjectDetails';
import Documents from './pages/Documents';
import Billing from './pages/Billing';
import Settings from './pages/Settings';

export default App;
        <Routes>
          <Route path="/" element={<ClientDashboard />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>