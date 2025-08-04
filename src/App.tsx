import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
import MessagesPage from './pages/client/MessagesPage';
import NewApplicationPage from './pages/client/NewApplicationPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          {/* Auth Routes (no header/footer) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Dashboard Routes (no header/footer) */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/consultant" element={<ConsultantDashboard />} />
          <Route path="/client" element={<ClientDashboard />} />
          <Route path="/client/messages" element={<MessagesPage />} />
          <Route path="/client/new-application" element={<NewApplicationPage />} />
          
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
                  <Route path="/georgia/commercial-law" element={<CommercialLawGeorgia />} />
                  <Route path="/georgia/hr-outsourcing" element={<HROutsourcingGeorgia />} />
                  <Route path="/georgia/legal-consulting" element={<LegalConsultingGeorgia />} />
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