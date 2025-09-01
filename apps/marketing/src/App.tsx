import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './lib/language';
import { AuthProvider } from './lib/auth';

// Lazy load all page components to prevent early environment variable access
const HomePage = React.lazy(() => import('src/pages/HomePage.tsx'));
const CountriesPage = React.lazy(() => import('src/pages/CountriesPage.tsx'));
const ServicesPage = React.lazy(() => import('src/pages/ServicesPage.tsx'));
const ConsultantProfilePage = React.lazy(() => import('src/pages/ConsultantProfilePage.tsx'));
const AuthPage = React.lazy(() => import('src/pages/AuthPage.tsx'));
const BlogPage = React.lazy(() => import('src/pages/BlogPage.tsx'));
const BlogPostPage = React.lazy(() => import('src/pages/BlogPostPage.tsx'));
const ContactPage = React.lazy(() => import('src/pages/ContactPage.tsx'));
const CountryPage = React.lazy(() => import('src/pages/CountryPage.tsx'));
const GeorgianLLCFormationPage = React.lazy(() => import('src/pages/services/GeorgianLLCFormationPage.tsx'));
const GeorgianIBCPage = React.lazy(() => import('src/pages/services/GeorgianIBCPage.tsx'));
const GeorgianTaxResidencyPage = React.lazy(() => import('src/pages/services/GeorgianTaxResidencyPage.tsx'));
const GeorgianBankingPage = React.lazy(() => import('src/pages/services/GeorgianBankingPage.tsx'));
const GeorgianVisaPage = React.lazy(() => import('src/pages/services/GeorgianVisaPage.tsx'));
const GeorgianIEStatusPage = React.lazy(() => import('src/pages/services/GeorgianIEStatusPage.tsx'));
const CompanyFormationPage = React.lazy(() => import('src/pages/services/CompanyFormationPage.tsx'));
const TaxOptimizationPage = React.lazy(() => import('src/pages/services/TaxOptimizationPage.tsx'));
const BankingSolutionsPage = React.lazy(() => import('src/pages/services/BankingSolutionsPage.tsx'));
const LegalCompliancePage = React.lazy(() => import('src/pages/services/LegalCompliancePage.tsx'));
const AssetProtectionPage = React.lazy(() => import('src/pages/services/AssetProtectionPage.tsx'));
const InvestmentAdvisoryPage = React.lazy(() => import('src/pages/services/InvestmentAdvisoryPage.tsx'));
const VisaResidencyPage = React.lazy(() => import('src/pages/services/VisaResidencyPage.tsx'));
const MarketResearchPage = React.lazy(() => import('src/pages/services/MarketResearchPage.tsx'));

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <LanguageProvider>
          <Router>
            <React.Suspense fallback={
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <span className="text-white font-bold text-xl">C19</span>
                  </div>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium">Loading Consulting19...</p>
                </div>
              </div>
            }>
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
            </React.Suspense>
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;