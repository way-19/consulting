import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { SupabaseProvider } from './contexts/SupabaseContext';
import { AuthProvider } from './contexts/AuthContext.jsx';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import DashboardRedirect from './components/DashboardRedirect.jsx';

// Public pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
// Auth pages
import LoginPage from './pages/auth/LoginPage.jsx';
import UnauthorizedPage from './pages/UnauthorizedPage.jsx';

// Dashboard pages
import AdminDashboard from './pages/dashboards/AdminDashboard.jsx';
import ConsultantDashboard from './pages/dashboards/ConsultantDashboard.jsx';
import ClientDashboard from './pages/dashboards/ClientDashboard.jsx';

function App() {
  return (
    <LanguageProvider>
      <SupabaseProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-white">
              <Routes>
                {/* Auth Routes (no header/footer) */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                
                {/* Dashboard Redirect */}
                <Route path="/dashboard" element={<DashboardRedirect />} />
                
                {/* Protected Dashboard Routes (no header/footer) */}
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
                
                {/* Public Routes (with header and footer) */}
                <Route path="/*" element={
                  <div>
                    <Header />
                    <main>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/services" element={<ServicesPage language="en" />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/blog" element={<BlogPage />} />
                        <Route path="/blog/:slug" element={<BlogPostPage />} />
                        <Route path="/partnership" element={<PartnershipPage language="en" />} />
                        
                        {/* Country Routes */}
                        <Route path="/georgia" element={<CountryPage country="georgia" />} />
                        <Route path="/usa" element={<CountryPage country="usa" />} />
                        <Route path="/montenegro" element={<CountryPage country="montenegro" />} />
                        <Route path="/estonia" element={<CountryPage country="estonia" />} />
                        <Route path="/portugal" element={<CountryPage country="portugal" />} />
                        <Route path="/malta" element={<CountryPage country="malta" />} />
                        <Route path="/panama" element={<CountryPage country="panama" />} />
                        
                        <Route path="*" element={<NotFoundPage language="en" />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                } />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </SupabaseProvider>
    </LanguageProvider>
  );
}

export default App;