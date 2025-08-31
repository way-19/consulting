import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './lib/language';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ConsultantProfilePage from './pages/ConsultantProfilePage';
import AuthPage from './pages/AuthPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import CountryPage from './pages/CountryPage';
import ConsultantProfilePage from './pages/ConsultantProfilePage';

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/countries/:countryCode" element={<CountryPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/consultant/:consultantId" element={<ConsultantProfilePage />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;