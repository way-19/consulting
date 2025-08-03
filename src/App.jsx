import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardRedirect from './components/DashboardRedirect';

// Public pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import CountryPage from './pages/CountryPage';
import BlogPage from './pages/BlogPage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Dashboard pages
import AdminDashboard from './pages/dashboards/AdminDashboard';
import ConsultantDashboard from './pages/dashboards/ConsultantDashboard';
import ClientDashboard from './pages/dashboards/ClientDashboard';

function App() {
  return (
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
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  
                  {/* Country Routes */}
                  <Route path="/georgia" element={<CountryPage country="georgia" />} />
                  <Route path="/usa" element={<CountryPage country="usa" />} />
                  <Route path="/montenegro" element={<CountryPage country="montenegro" />} />
                  <Route path="/estonia" element={<CountryPage country="estonia" />} />
                  <Route path="/portugal" element={<CountryPage country="portugal" />} />
                  <Route path="/malta" element={<CountryPage country="malta" />} />
                  <Route path="/panama" element={<CountryPage country="panama" />} />
                  <Route path="/uae" element={<CountryPage country="uae" />} />
                  <Route path="/switzerland" element={<CountryPage country="switzerland" />} />
                  <Route path="/spain" element={<CountryPage country="spain" />} />
                </Routes>
              </main>
              <Footer />
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;