import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider, AuthProvider } from '@consulting19/shared';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import CountriesPage from './pages/CountriesPage';
import CountryDetailPage from './pages/CountryDetailPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ContactPage from './pages/ContactPage';
import AIAssistantPage from './pages/AIAssistantPage';
import PartnersPage from './pages/PartnersPage';
import DocumentationPage from './pages/DocumentationPage';
import FAQPage from './pages/FAQPage';

// Service Pages
import CompanyFormationPage from './pages/services/CompanyFormationPage';
import TaxOptimizationPage from './pages/services/TaxOptimizationPage';
import BankingSolutionsPage from './pages/services/BankingSolutionsPage';
import LegalCompliancePage from './pages/services/LegalCompliancePage';
import AssetProtectionPage from './pages/services/AssetProtectionPage';
import InvestmentAdvisoryPage from './pages/services/InvestmentAdvisoryPage';
import VisaResidencyPage from './pages/services/VisaResidencyPage';
import MarketResearchPage from './pages/services/MarketResearchPage';

// Legal Pages
import TermsPage from './pages/legal/TermsPage';
import PrivacyPage from './pages/legal/PrivacyPage';
import CookiePage from './pages/legal/CookiePage';
import CompliancePage from './pages/legal/CompliancePage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <LanguageProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main>
                <Routes>
                  {/* Main Pages */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/countries" element={<CountriesPage />} />
                  <Route path="/countries/:countryId" element={<CountryDetailPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:postId" element={<BlogPostPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/ai-assistant" element={<AIAssistantPage />} />
                  <Route path="/partners" element={<PartnersPage />} />
                  <Route path="/docs" element={<DocumentationPage />} />
                  <Route path="/faq" element={<FAQPage />} />

                  {/* Service Pages */}
                  <Route path="/services/company-formation" element={<CompanyFormationPage />} />
                  <Route path="/services/tax-optimization" element={<TaxOptimizationPage />} />
                  <Route path="/services/banking-solutions" element={<BankingSolutionsPage />} />
                  <Route path="/services/legal-compliance" element={<LegalCompliancePage />} />
                  <Route path="/services/asset-protection" element={<AssetProtectionPage />} />
                  <Route path="/services/investment-advisory" element={<InvestmentAdvisoryPage />} />
                  <Route path="/services/visa-residency" element={<VisaResidencyPage />} />
                  <Route path="/services/market-research" element={<MarketResearchPage />} />

                  {/* Legal Pages */}
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/cookies" element={<CookiePage />} />
                  <Route path="/compliance" element={<CompliancePage />} />

                  {/* Auth Pages */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;