import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import PartnershipPage from './pages/PartnershipPage';
import CountryPage from './pages/CountryPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const [language, setLanguage] = useState<'en' | 'tr'>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'tr' : 'en');
  };

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header language={language} onLanguageToggle={toggleLanguage} />
        <Routes>
          <Route path="/" element={<HomePage language={language} />} />
          <Route path="/about" element={<AboutPage language={language} />} />
          <Route path="/services" element={<ServicesPage language={language} />} />
          <Route path="/contact" element={<ContactPage language={language} />} />
          <Route path="/blog" element={<BlogPage language={language} />} />
          <Route path="/partnership" element={<PartnershipPage language={language} />} />
          
          {/* Country Pages */}
          <Route path="/georgia" element={<CountryPage country="georgia" language={language} />} />
          <Route path="/usa" element={<CountryPage country="usa" language={language} />} />
          <Route path="/montenegro" element={<CountryPage country="montenegro" language={language} />} />
          <Route path="/estonia" element={<CountryPage country="estonia" language={language} />} />
          <Route path="/portugal" element={<CountryPage country="portugal" language={language} />} />
          <Route path="/malta" element={<CountryPage country="malta" language={language} />} />
          <Route path="/panama" element={<CountryPage country="panama" language={language} />} />
          
          <Route path="*" element={<NotFoundPage language={language} />} />
        </Routes>
        <Footer language={language} />
      </div>
    </Router>
  );
}

export default App;