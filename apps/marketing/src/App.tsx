import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@consulting19/shared';
import ConsultantProfilePage from './pages/ConsultantProfilePage';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/consultant/:consultantId" element={<ConsultantProfilePage />} />
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;