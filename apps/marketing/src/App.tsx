import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './lib/language';
import { AuthProvider } from '@consulting19/shared';
import HomePage from './pages/HomePage';
import CountriesPage from './pages/CountriesPage';
import ServicesPage from './pages/ServicesPage';
import ConsultantProfilePage from './pages/ConsultantProfilePage';
import AuthPage from './pages/AuthPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ContactPage from './pages/ContactPage';
import CountryPage from './pages/CountryPage';
import AICountryRecommendationsPage from './pages/AICountryRecommendationsPage';
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
import ComingSoonCountryPage from './pages/ComingSoonCountryPage';
import AIExperiencePage from './pages/AIExperiencePage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import AboutPage from './pages/AboutPage';
import SitemapPage from './pages/SitemapPage';
import CompanyFormationWizard from './pages/CompanyFormationWizard';

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
              <Route path="/consultant/:consultantId" element={<ConsultantProfilePage />} />
              
              {/* Georgian Service Pages */}
              <Route path="/services/georgia/llc-formation" element={<GeorgianLLCFormationPage />} />
              <Route path="/services/georgia/international-business-company" element={<GeorgianIBCPage />} />
              <Route path="/services/georgia/tax-residency" element={<GeorgianTaxResidencyPage />} />
              <Route path="/services/georgia/banking-solutions" element={<GeorgianBankingPage />} />
              <Route path="/services/georgia/visa-residence-permit" element={<GeorgianVisaPage />} />
              <Route path="/services/georgia/individual-entrepreneur" element={<GeorgianIEStatusPage />} />
            </Routes>
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;