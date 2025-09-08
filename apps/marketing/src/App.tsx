import React from 'react';
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
              {/* Coming Soon Country Pages */}
              <Route path="/countries/usa" element={<ComingSoonCountryPage country="United States" flag="🇺🇸" />} />
              <Route path="/countries/uae" element={<ComingSoonCountryPage country="United Arab Emirates" flag="🇦🇪" />} />
              <Route path="/countries/estonia" element={<ComingSoonCountryPage country="Estonia" flag="🇪🇪" />} />
              <Route path="/countries/malta" element={<ComingSoonCountryPage country="Malta" flag="🇲🇹" />} />
              <Route path="/countries/portugal" element={<ComingSoonCountryPage country="Portugal" flag="🇵🇹" />} />
              <Route path="/countries/panama" element={<ComingSoonCountryPage country="Panama" flag="🇵🇦" />} />
              <Route path="/countries/switzerland" element={<ComingSoonCountryPage country="Switzerland" flag="🇨🇭" />} />
              <Route path="/countries/singapore" element={<ComingSoonCountryPage country="Singapore" flag="🇸🇬" />} />
              <Route path="/countries/netherlands" element={<ComingSoonCountryPage country="Netherlands" flag="🇳🇱" />} />
              <Route path="/countries/ireland" element={<ComingSoonCountryPage country="Ireland" flag="🇮🇪" />} />
              <Route path="/countries/gibraltar" element={<ComingSoonCountryPage country="Gibraltar" flag="🇬🇮" />} />
              <Route path="/countries/lithuania" element={<ComingSoonCountryPage country="Lithuania" flag="🇱🇹" />} />
              <Route path="/countries/canada" element={<ComingSoonCountryPage country="Canada" flag="🇨🇦" />} />
              <Route path="/countries/bulgaria" element={<ComingSoonCountryPage country="Bulgaria" flag="🇧🇬" />} />
              <Route path="/countries/spain" element={<ComingSoonCountryPage country="Spain" flag="🇪🇸" />} />
              <Route path="/countries/montenegro" element={<ComingSoonCountryPage country="Montenegro" flag="🇲🇪" />} />
            </Routes>
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;