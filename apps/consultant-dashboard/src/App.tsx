import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@consulting19/shared';
import ConsultantDashboard from './pages/ConsultantDashboard';
import CountryManagement from './pages/CountryManagement';
import ServicesManagement from './pages/ServicesManagement';
import ContentManagement from './pages/ContentManagement';
import BlogManagement from './pages/BlogManagement';
import FAQManagement from './pages/FAQManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ConsultantDashboard />} />
          <Route path="/country" element={<CountryManagement />} />
          <Route path="/services" element={<ServicesManagement />} />
          <Route path="/content" element={<ContentManagement />} />
          <Route path="/blog" element={<BlogManagement />} />
          <Route path="/faq" element={<FAQManagement />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;