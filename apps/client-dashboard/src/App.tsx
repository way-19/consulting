import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../packages/shared/src';
import ClientDashboard from './pages/ClientDashboard';
import ProjectDetails from './pages/ProjectDetails';
import Documents from './pages/Documents';
import Messages from './pages/Messages';
import Billing from './pages/Billing';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ClientDashboard />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;