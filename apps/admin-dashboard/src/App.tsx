import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@consulting19/shared';
import AdminDashboard from './pages/AdminDashboard';
import MarketingCMS from './pages/MarketingCMS';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/cms" element={<MarketingCMS />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;