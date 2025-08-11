import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';

// Public pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import CountryPage from './pages/CountryPage';

// Georgia Service Pages
import BankAccountGeorgia from './pages/services/BankAccountGeorgia';
import VisaResidenceGeorgia from './pages/services/VisaResidenceGeorgia';
import AccountingServicesGeorgia from './pages/services/AccountingServicesGeorgia';
import TaxResidencyGeorgia from './pages/services/TaxResidencyGeorgia';
import CompanyRegistrationGeorgia from './pages/services/CompanyRegistrationGeorgia';
import CommercialLawGeorgia from './pages/services/CommercialLawGeorgia';
import HROutsourcingGeorgia from './pages/services/HROutsourcingGeorgia';
import LegalConsultingGeorgia from './pages/services/LegalConsultingGeorgia';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Dashboard pages
import AdminDashboard from './pages/dashboards/AdminDashboard';
import ConsultantDashboard from './pages/dashboards/ConsultantDashboard';
import ClientDashboard from './pages/ClientDashboard';
import RequireClient from './routes/RequireClient';
import DevSupabaseBanner from './components/shared/DevSupabaseBanner';

function App() {
  return (
    <Router>
      <DevSupabaseBanner />
      <div className="min-h-screen bg-white">
        <Routes>
          {/* Auth Routes (no header/footer) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Dashboard Routes (no header/footer) */}
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Country-based Consultant Dashboard Routes */}
          <Route path="/georgia/consultant-dashboard" element={<ConsultantDashboard country="georgia" />} />
          <Route path="/georgia/consultant-dashboard/*" element={<ConsultantDashboard country="georgia" />} />
          <Route path="/usa/consultant-dashboard" element={<ConsultantDashboard country="usa" />} />
          <Route path="/usa/consultant-dashboard/*" element={<ConsultantDashboard country="usa" />} />
          <Route path="/montenegro/consultant-dashboard" element={<ConsultantDashboard country="montenegro" />} />
          <Route path="/montenegro/consultant-dashboard/*" element={<ConsultantDashboard country="montenegro" />} />
          <Route path="/estonia/consultant-dashboard" element={<ConsultantDashboard country="estonia" />} />
          <Route path="/estonia/consultant-dashboard/*" element={<ConsultantDashboard country="estonia" />} />
          <Route path="/portugal/consultant-dashboard" element={<ConsultantDashboard country="portugal" />} />
          <Route path="/portugal/consultant-dashboard/*" element={<ConsultantDashboard country="portugal" />} />
          <Route path="/malta/consultant-dashboard" element={<ConsultantDashboard country="malta" />} />
          <Route path="/malta/consultant-dashboard/*" element={<ConsultantDashboard country="malta" />} />
          <Route path="/panama/consultant-dashboard" element={<ConsultantDashboard country="panama" />} />
          <Route path="/panama/consultant-dashboard/*" element={<ConsultantDashboard country="panama" />} />
          
          {/* Fallback for consultants without specific country assignment */}
          <Route path="/consultant-dashboard" element={<ConsultantDashboard country="global" />} />
          <Route path="/consultant-dashboard/*" element={<ConsultantDashboard country="global" />} />
          <Route path="/client" element={<RequireClient><ClientDashboard /></RequireClient>} />
          <Route path="/client/*" element={<RequireClient><ClientDashboard /></RequireClient>} />

          {/* Public Routes (with header and footer) - Catch-all for other routes */}
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
                  
                  {/* Georgia Service Routes */}
                  <Route path="/georgia/bank-account" element={<BankAccountGeorgia />} />
                  <Route path="/georgia/visa-residence" element={<VisaResidenceGeorgia />} />
                  <Route path="/georgia/accounting-services" element={<AccountingServicesGeorgia />} />
                  <Route path="/georgia/tax-residency" element={<TaxResidencyGeorgia />} />
                  <Route path="/georgia/company-registration" element={<CompanyRegistrationGeorgia />} />
                  <Route path="/georgia/legal-consulting" element={<LegalConsultingGeorgia />} />
                </Routes>
              </main>
              <Footer />
            </div>
          } />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;