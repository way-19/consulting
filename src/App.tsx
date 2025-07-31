import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { SupabaseProvider } from './contexts/SupabaseContext';
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
  return (
    <LanguageProvider>
      <AuthProvider>
        <SupabaseProvider>
          <Router>
            <div className="min-h-screen bg-white">
              <Header />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/partnership" element={<PartnershipPage />} />
                
                {/* Country Pages */}
                <Route path="/georgia" element={<CountryPage country="georgia" />} />
                <Route path="/usa" element={<CountryPage country="usa" />} />
                <Route path="/montenegro" element={<CountryPage country="montenegro" />} />
                <Route path="/estonia" element={<CountryPage country="estonia" />} />
                <Route path="/portugal" element={<CountryPage country="portugal" />} />
                <Route path="/malta" element={<CountryPage country="malta" />} />
                <Route path="/panama" element={<CountryPage country="panama" />} />
                
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              <Footer />
            </div>
          </Router>
        </SupabaseProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;