import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import CountryPage from './pages/CountryPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/georgia" element={<CountryPage country="georgia" />} />
            <Route path="/usa" element={<CountryPage country="usa" />} />
            <Route path="/montenegro" element={<CountryPage country="montenegro" />} />
            <Route path="/estonia" element={<CountryPage country="estonia" />} />
            <Route path="/portugal" element={<CountryPage country="portugal" />} />
            <Route path="/malta" element={<CountryPage country="malta" />} />
            <Route path="/panama" element={<CountryPage country="panama" />} />
            <Route path="/uae" element={<CountryPage country="uae" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;