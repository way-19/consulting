import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './lib/language';
import { AuthProvider } from './lib/auth';

// Lazy load all page components to prevent early environment variable access
const HomePage = React.lazy(() => import('./pages/HomePage'));
const CountriesPage = React.lazy(() => import('./pages/CountriesPage'));
const ServicesPage = React.lazy(() => import('./pages/ServicesPage'));
const ConsultantProfilePage = React.lazy(() => import('./pages/ConsultantProfilePage'));
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const CountryPage = React.lazy(() => import('./pages/CountryPage'));
const GeorgianLLCFormationPage = React.lazy(() => import('./pages/services/GeorgianLLCFormationPage'));
const GeorgianIBCPage = React.lazy(() => import('./pages/services/GeorgianIBCPage'));
const GeorgianTaxResidencyPage = React.lazy(() => import('./pages/services/GeorgianTaxResidencyPage'));
const GeorgianBankingPage = React.lazy(() => import('./pages/services/GeorgianBankingPage'));
const GeorgianVisaPage = React.lazy(() => import('./pages/services/GeorgianVisaPage'));
const GeorgianIEStatusPage = React.lazy(() => import('./pages/services/GeorgianIEStatusPage'));
const CompanyFormationPage = React.lazy(() => import('./pages/services/CompanyFormationPage'));
const TaxOptimizationPage = React.lazy(() => import('./pages/services/TaxOptimizationPage'));
const BankingSolutionsPage = React.lazy(() => import('./pages/services/BankingSolutionsPage'));
const LegalCompliancePage = React.lazy(() => import('./pages/services/LegalCompliancePage'));
const AssetProtectionPage = React.lazy(() => import('./pages/services/AssetProtectionPage'));
const InvestmentAdvisoryPage = React.lazy(() => import('./pages/services/InvestmentAdvisoryPage'));
const VisaResidencyPage = React.lazy(() => import('./pages/services/VisaResidencyPage'));
const MarketResearchPage = React.lazy(() => import('./pages/services/MarketResearchPage'));

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