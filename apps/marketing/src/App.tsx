import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './lib/language';
import { AuthProvider } from './lib/auth';
import HomePage from './pages/HomePage';
import CountriesPage from './pages/CountriesPage';
import ServicesPage from './pages/ServicesPage';
import ConsultantProfilePage from './pages/ConsultantProfilePage';
import AuthPage from './pages/AuthPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ContactPage from './pages/ContactPage';
import CountryPage from './pages/CountryPage';
import GeorgianLLCFormationPage from './pages/services/GeorgianLLCFormationPage';
import GeorgianIBCPage from './pages/services/GeorgianIBCPage';
import GeorgianTaxResidencyPage from './pages/services/GeorgianTaxResidencyPage';
import GeorgianBankingPage from './pages/services/GeorgianBankingPage';
import GeorgianVisaPage from './pages/services/GeorgianVisaPage';
import GeorgianIEStatusPage from './pages/services/GeorgianIEStatusPage';
import CompanyFormationPage from './pages/services/CompanyFormationPage';
import TaxOptimizationPage from './pages/services/TaxOptimizationPage';
import BankingSolutionsPage from './pages/services/BankingSolutionsPage';
import LegalCompliancePage from './pages/services/LegalCompliancePage';
import AssetProtectionPage from './pages/services/AssetProtectionPage';
import InvestmentAdvisoryPage from './pages/services/InvestmentAdvisoryPage';
import VisaResidencyPage from './pages/services/VisaResidencyPage';
import MarketResearchPage from './pages/services/MarketResearchPage';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <LanguageProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/countries" element={<CountriesPage />} />
              <Route path="/countries/:countryCode" element={<CountryPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/consultant/:consultantId" element={<ConsultantProfilePage />} />
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Georgian Service Pages */}
              <Route path="/services/georgia/llc-formation" element={<GeorgianLLCFormationPage />} />
              <Route path="/services/georgia/international-business-company" element={<GeorgianIBCPage />} />
              <Route path="/services/georgia/tax-residency" element={<GeorgianTaxResidencyPage />} />
              <Route path="/services/georgia/banking-solutions" element={<GeorgianBankingPage />} />
              <Route path="/services/georgia/visa-residence-permit" element={<GeorgianVisaPage />} />
              <Route path="/services/georgia/individual-entrepreneur" element={<GeorgianIEStatusPage />} />
              
              {/* Global Service Pages */}
              <Route path="/services/company-formation" element={<CompanyFormationPage />} />
              <Route path="/services/tax-optimization" element={<TaxOptimizationPage />} />
              <Route path="/services/banking-solutions" element={<BankingSolutionsPage />} />
              <Route path="/services/legal-compliance" element={<LegalCompliancePage />} />
              <Route path="/services/asset-protection" element={<AssetProtectionPage />} />
              <Route path="/services/investment-advisory" element={<InvestmentAdvisoryPage />} />
              <Route path="/services/visa-residency" element={<VisaResidencyPage />} />
              <Route path="/services/market-research" element={<MarketResearchPage />} />
            </Routes>
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;