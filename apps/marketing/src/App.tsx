import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, LanguageProvider } from '@consulting19/shared';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import CountriesPage from './pages/CountriesPage';
import CountryDetailPage from './pages/CountryDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import FAQPage from './pages/FAQPage';
import AIAssistantPage from './pages/AIAssistantPage';
import ServiceDetailPage from './pages/services/ServiceDetailPage';
import CompanyFormationPage from './pages/services/CompanyFormationPage';
import TaxOptimizationPage from './pages/services/TaxOptimizationPage';
import BankingSolutionsPage from './pages/services/BankingSolutionsPage';
import LegalCompliancePage from './pages/services/LegalCompliancePage';
import AssetProtectionPage from './pages/services/AssetProtectionPage';
import InvestmentAdvisoryPage from './pages/services/InvestmentAdvisoryPage';
import VisaResidencyPage from './pages/services/VisaResidencyPage';
import MarketResearchPage from './pages/services/MarketResearchPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import PrivacyPage from './pages/legal/PrivacyPage';
import TermsPage from './pages/legal/TermsPage';

// ScrollToTop component to handle page navigation scroll
function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <ScrollToTop />
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/countries" element={<CountriesPage />} />
                <Route path="/countries/:countryId" element={<CountryDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:postId" element={<BlogPostPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/ai-assistant" element={<AIAssistantPage />} />
                <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
                <Route path="/services/company-formation" element={<CompanyFormationPage />} />
                <Route path="/services/tax-optimization" element={<TaxOptimizationPage />} />
                <Route path="/services/banking-solutions" element={<BankingSolutionsPage />} />
                <Route path="/services/legal-compliance" element={<LegalCompliancePage />} />
                <Route path="/services/asset-protection" element={<AssetProtectionPage />} />
                <Route path="/services/investment-advisory" element={<InvestmentAdvisoryPage />} />
                <Route path="/services/visa-residency" element={<VisaResidencyPage />} />
                <Route path="/services/market-research" element={<MarketResearchPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                
                {/* Auth Routes */}
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
  );
}

export default App;