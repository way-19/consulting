import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@consulting19/shared';
import { Card, Button } from '@consulting19/ui';

function ConsultantDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card>
        <Card.Body>
          <h1 className="text-2xl font-bold mb-4">Consultant Dashboard</h1>
          <p className="text-gray-600 mb-6">Manage your clients and business consulting services.</p>
          <Button>View Clients</Button>
        </Card.Body>
      </Card>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ConsultantDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;