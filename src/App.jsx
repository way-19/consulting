import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout Components
import PublicLayout from './components/PublicLayout';
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

// Service pages
import BankAccountGeorgia from './pages/services/BankAccountGeorgia';
import VisaResidenceGeorgia from './pages/services/VisaResidenceGeorgia';
import AccountingServicesGeorgia from './pages/services/AccountingServicesGeorgia';
import HROutsourcingGeorgia from './pages/services/HROutsourcingGeorgia';
import LegalConsultingGeorgia from './pages/services/LegalConsultingGeorgia';
import TaxResidencyGeorgia from './pages/services/TaxResidencyGeorgia';
import CompanyRegistrationGeorgia from './pages/services/CompanyRegistrationGeorgia';
import CommercialLawGeorgia from './pages/services/CommercialLawGeorgia';

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
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="blog" element={<BlogPage />} />
            
            {/* Georgia Service Routes */}
            <Route path="georgia/bank-account" element={<BankAccountGeorgia />} />
            <Route path="georgia/visa-residence" element={<VisaResidenceGeorgia />} />
            <Route path="georgia/accounting-services" element={<AccountingServicesGeorgia />} />
            <Route path="georgia/hr-outsourcing" element={<HROutsourcingGeorgia />} />
            <Route path="georgia/legal-consulting" element={<LegalConsultingGeorgia />} />
            <Route path="georgia/tax-residency" element={<TaxResidencyGeorgia />} />
            <Route path="georgia/company-registration" element={<CompanyRegistrationGeorgia />} />
            <Route path="georgia/commercial-law" element={<CommercialLawGeorgia />} />
            
            {/* Country Routes */}
            <Route path="georgia" element={<CountryPage country="georgia" />} />
            <Route path="usa" element={<CountryPage country="usa" />} />
            <Route path="montenegro" element={<CountryPage country="montenegro" />} />
            <Route path="estonia" element={<CountryPage country="estonia" />} />
            <Route path="portugal" element={<CountryPage country="portugal" />} />
            <Route path="malta" element={<CountryPage country="malta" />} />
            <Route path="panama" element={<CountryPage country="panama" />} />
            <Route path="uae" element={<CountryPage country="uae" />} />
            <Route path="switzerland" element={<CountryPage country="switzerland" />} />
            <Route path="spain" element={<CountryPage country="spain" />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;