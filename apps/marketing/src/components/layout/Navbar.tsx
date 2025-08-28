import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '@consulting19/shared';

const Navbar = () => {
  const { t, currentLanguage, setLanguage } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock data - in real app, this would come from API
  const services = [
    { id: 1, name: t('services.companyFormation'), slug: 'company-formation' },
    { id: 2, name: t('services.bankAccount'), slug: 'bank-account' },
    { id: 3, name: t('services.taxConsulting'), slug: 'tax-consulting' },
    { id: 4, name: t('services.legalServices'), slug: 'legal-services' },
    { id: 5, name: t('services.accounting'), slug: 'accounting' },
    { id: 6, name: t('services.compliance'), slug: 'compliance' },
    { id: 7, name: t('services.investment'), slug: 'investment' },
    { id: 8, name: t('services.insurance'), slug: 'insurance' },
  ];

  const countries = [
    { id: 1, name: 'Dubai', slug: 'dubai', flag: '🇦🇪' },
    { id: 2, name: 'Singapore', slug: 'singapore', flag: '🇸🇬' },
    { id: 3, name: 'Hong Kong', slug: 'hong-kong', flag: '🇭🇰' },
    { id: 4, name: 'Estonia', slug: 'estonia', flag: '🇪🇪' },
    { id: 5, name: 'Cyprus', slug: 'cyprus', flag: '🇨🇾' },
    { id: 6, name: 'Malta', slug: 'malta', flag: '🇲🇹' },
    { id: 7, name: 'Switzerland', slug: 'switzerland', flag: '🇨🇭' },
    { id: 8, name: 'Luxembourg', slug: 'luxembourg', flag: '🇱🇺' },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const closeAllDropdowns = () => {
    setOpenDropdown(null);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50" ref={dropdownRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeAllDropdowns}>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C19</span>
            </div>
            <span className="text-lg font-bold text-gray-900">Consulting19</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('services')}
                className="flex items-center px-2 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                {t('nav.services')}
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${
                  openDropdown === 'services' ? 'rotate-180' : ''
                }`} />
              </button>
              
              {openDropdown === 'services' && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {services.slice(0, 6).map((service) => (
                    <Link
                      key={service.id}
                      to={`/services/${service.slug}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      onClick={closeAllDropdowns}
                    >
                      {service.name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <Link
                      to="/services"
                      className="flex items-center justify-between px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                      onClick={closeAllDropdowns}
                    >
                      {t('nav.viewAllServices')}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Countries Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('countries')}
                className="flex items-center px-2 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                {t('nav.countries')}
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${
                  openDropdown === 'countries' ? 'rotate-180' : ''
                }`} />
              </button>
              
              {openDropdown === 'countries' && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {countries.slice(0, 6).map((country) => (
                    <Link
                      key={country.id}
                      to={`/countries/${country.slug}`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      onClick={closeAllDropdowns}
                    >
                      <span className="mr-3">{country.flag}</span>
                      {country.name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <Link
                      to="/countries"
                      className="flex items-center justify-between px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                      onClick={closeAllDropdowns}
                    >
                      {t('nav.viewAllCountries')}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Other Navigation Links */}
            <Link
              to="/about"
              className="px-2 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
              onClick={closeAllDropdowns}
            >
              {t('nav.about')}
            </Link>
            
            <Link
              to="/blog"
              className="px-2 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
              onClick={closeAllDropdowns}
            >
              {t('nav.blog')}
            </Link>
            
            <Link
              to="/contact"
              className="px-2 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
              onClick={closeAllDropdowns}
            >
              {t('nav.contact')}
            </Link>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('language')}
                className="flex items-center px-2 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                {languages.find(lang => lang.code === currentLanguage)?.flag}
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${
                  openDropdown === 'language' ? 'rotate-180' : ''
                }`} />
              </button>
              
              {openDropdown === 'language' && (
                <div className="absolute top-full right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        setLanguage(language.code as 'en' | 'tr' | 'pt');
                        closeAllDropdowns();
                      }}
                      className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-blue-50 transition-colors duration-200 ${
                        currentLanguage === language.code ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                      }`}
                    >
                      <span className="mr-3">{language.flag}</span>
                      {language.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-2 ml-4">
              <Link
                to="/auth/login"
                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                onClick={closeAllDropdowns}
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/auth/register"
                className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                onClick={closeAllDropdowns}
              >
                {t('nav.register')}
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              <Link
                to="/services"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.services')}
              </Link>
              <Link
                to="/countries"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.countries')}
              </Link>
              <Link
                to="/about"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.about')}
              </Link>
              <Link
                to="/blog"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.blog')}
              </Link>
              <Link
                to="/contact"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.contact')}
              </Link>
              
              {/* Mobile Language Selector */}
              <div className="px-4 py-2">
                <div className="text-xs font-medium text-gray-500 mb-2">{t('nav.language')}</div>
                <div className="space-y-1">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        setLanguage(language.code as 'en' | 'tr' | 'pt');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center w-full px-3 py-2 text-sm text-left rounded-lg transition-colors duration-200 ${
                        currentLanguage === language.code ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="mr-3">{language.flag}</span>
                      {language.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="px-4 pt-4 border-t border-gray-200 space-y-2">
                <Link
                  to="/auth/login"
                  className="block w-full px-4 py-2 text-sm font-medium text-center text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/auth/register"
                  className="block w-full px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.register')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;