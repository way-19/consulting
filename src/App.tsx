import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Components
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardRedirect from './components/DashboardRedirect';

// Public pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import PartnershipPage from './pages/PartnershipPage';
import CountryPage from './pages/CountryPage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Dashboard pages
import AdminDashboard from './pages/dashboards/AdminDashboard';
import ConsultantDashboard from './pages/dashboards/ConsultantDashboard';
import ClientDashboard from './pages/dashboards/ClientDashboard';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <Routes>
              {/* Auth Routes (no header) */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              
              {/* Dashboard Redirect */}
              <Route path="/dashboard" element={<DashboardRedirect />} />
              
              {/* Protected Dashboard Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/consultant" 
                element={
                  <ProtectedRoute requiredRole="consultant">
                    <ConsultantDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/client" 
                element={
                  <ProtectedRoute requiredRole="client">
                    <ClientDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Public Routes (with header) */}
              <Route path="/*" element={
                <div>
                  <Header />
                  <main>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/services" element={<ServicesPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/blog" element={<BlogPage />} />
                      <Route path="/partnership" element={<PartnershipPage />} />
                      
                      {/* Country Routes */}
                      <Route path="/georgia" element={<CountryPage country="georgia" />} />
                      <Route path="/usa" element={<CountryPage country="usa" />} />
                      <Route path="/montenegro" element={<CountryPage country="montenegro" />} />
                      <Route path="/estonia" element={<CountryPage country="estonia" />} />
                      <Route path="/portugal" element={<CountryPage country="portugal" />} />
                      <Route path="/malta" element={<CountryPage country="malta" />} />
                      <Route path="/panama" element={<CountryPage country="panama" />} />
                      
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
              } />
            </Routes>
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;