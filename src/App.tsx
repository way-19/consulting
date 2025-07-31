import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import FloatingAIAssistant from './components/common/FloatingAIAssistant';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ClientDashboard from './pages/ClientDashboard';
import ConsultantDashboard from './pages/ConsultantDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Country routes will be added */}
            <Route path="/:countrySlug" element={<div className="pt-20 p-8 text-center">Country Page Coming Soon</div>} />
            {/* Additional routes */}
            <Route path="/about" element={<div className="pt-20 p-8 text-center">About Page Coming Soon</div>} />
            <Route path="/services" element={<div className="pt-20 p-8 text-center">Services Page Coming Soon</div>} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/contact" element={<div className="pt-20 p-8 text-center">Contact Page Coming Soon</div>} />
            <Route path="/get-started" element={<div className="pt-20 p-8 text-center">Get Started Page Coming Soon</div>} />
            <Route path="/client/dashboard" element={<ClientDashboard />} />
            <Route path="/consultant/dashboard" element={<ConsultantDashboard />} />
            <Route path="/consultant/*" element={<div className="pt-20 p-8 text-center">Consultant Feature Coming Soon</div>} />
          </Routes>
        </main>
        <Footer />
        <FloatingAIAssistant />
      </div>
    </Router>
  );
}

export default App;