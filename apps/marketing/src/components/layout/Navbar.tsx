import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { useLanguage, useAuth } from '@consulting19/shared';
import { Button } from '@consulting19/ui';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [countriesOpen, setCountriesOpen] = useState(false);

  const services = [
    { id: 'company-formation', name: 'Company Formation', description: 'Complete business registration services' },
    { id: 'tax-optimization', name: 'Tax Optimization', description: 'Strategic tax planning and compliance' },
    { id: 'banking-solutions', name: 'Banking Solutions', description: 'International banking assistance' },
    { id: 'legal-compliance', name: 'Legal Compliance', description: 'Ongoing regulatory support' },
    { id: 'asset-protection', name: 'Asset Protection', description: 'Wealth protection strategies' },
    { id: 'investment-advisory', name: 'Investment Advisory', description: 'Commercial investment guidance' },
    { id: 'visa-residency', name: 'Visa & Residency', description: 'Immigration and residency solutions' },
    { id: 'market-research', name: 'Market Research', description: 'Business intelligence and analysis' },
  ];

  const countries = [
    { id: 'uae', name: 'UAE', flag: '🇦🇪', highlight: '0% tax in free zones' },
    { id: 'estonia', name: 'Estonia', flag: '🇪🇪', highlight: 'Digital e-Residency' },
    { id: 'georgia', name: 'Georgia', flag: '🇬🇪', highlight: '1% small business tax' },
    { id: 'malta', name: 'Malta', flag: '🇲🇹', highlight: 'EU access, 5% tax' },
    { id: 'panama', name: 'Panama', flag: '🇵🇦', highlight: 'Territorial taxation' },
    { id: 'portugal', name: 'Portugal', flag: '🇵🇹', highlight: 'Golden Visa program' },
    { id: 'usa', name: 'USA', flag: '🇺🇸', highlight: 'World\'s largest market' },
    { id: 'switzerland', name: 'Switzerland', flag: '🇨🇭', highlight: 'Banking excellence' },
  ];

  const closeAllDropdowns = () => {
    setServicesOpen(false);
    setCountriesOpen(false);
  };

  const handleServicesClick = () => {
    setServicesOpen(!servicesOpen);
    setCountriesOpen(false);
  };

  const handleCountriesClick = () => {
    setCountriesOpen(!countriesOpen);
    setServicesOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C19</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Consulting19</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 px-2 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
            >
              {t('nav.home')}
            </Link>

            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={handleServicesClick}
                className="text-gray-700 hover:text-blue-600 px-2 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
              >
                {t('nav.services')}
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {servicesOpen && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                  {services.slice(0, 6).map((service) => (
                    <Link
                      key={service.id}
                      to={`/services/${service.id}`}
                      onClick={closeAllDropdowns}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 hover:translate-x-1"
                    >
                      <div className="font-medium">{service.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{service.description}</div>
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <Link
                      to="/services"
                      onClick={closeAllDropdowns}
                      className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium transition-colors duration-200 flex items-center"
                    >
                      Tüm Hizmetleri Görüntüle
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Countries Dropdown */}
            <div className="relative">
              <button
                onClick={handleCountriesClick}
                className="text-gray-700 hover:text-blue-600 px-2 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
              >
                {t('nav.countries')}
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${countriesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {countriesOpen && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                  {countries.slice(0, 6).map((country) => (
                    <Link
                      key={country.id}
                      to={`/countries/${country.id}`}
                      onClick={closeAllDropdowns}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 hover:translate-x-1"
                    >
                      <div className="flex items-center">
                        <span className="text-lg mr-3">{country.flag}</span>
                        <div>
                          <div className="font-medium">{country.name}</div>
                          <div className="text-xs text-gray-500">{country.highlight}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <Link
                      to="/countries"
                      onClick={closeAllDropdowns}
                      className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium transition-colors duration-200 flex items-center"
                    >
                      Tüm Ülkeleri Görüntüle
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/about"
              className="text-gray-700 hover:text-blue-600 px-2 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
            >
              {t('nav.about')}
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600 px-2 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
            >
              {t('nav.contact')}
            </Link>
            <Link
              to="/blog"
              className="text-gray-700 hover:text-blue-600 px-2 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
            >
              {t('nav.blog')}
            </Link>
            <Link
              to="/ai-assistant"
              className="text-gray-700 hover:text-blue-600 px-2 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
            >
              AI Assistant
            </Link>

            {/* Language Selector */}
            <LanguageSelector />

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link to="/dashboard">
                  <Button size="sm" variant="outline">
                    {t('nav.dashboard')}
                  </Button>
                </Link>
                <Button size="sm" variant="ghost" onClick={handleSignOut}>
                  {t('nav.logout')}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button size="sm" variant="ghost">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    {t('nav.register')}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/services"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.services')}
              </Link>
              <Link
                to="/countries"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.countries')}
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.about')}
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.contact')}
              </Link>
              <Link
                to="/blog"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.blog')}
              </Link>
              <Link
                to="/ai-assistant"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                AI Assistant
              </Link>

              {user ? (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.dashboard')}
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;