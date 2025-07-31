import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { SupabaseProvider } from './contexts/SupabaseContext';
import { AuthProvider } from './contexts/AuthContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Public pages - AYNEN KALSIN
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';

function App() {
  return (
    <LanguageProvider>
      <SupabaseProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-white">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  {/* Diğer routes gerektiğinde ekleyeceğiz */}
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </SupabaseProvider>
    </LanguageProvider>
  );
}

export default App;