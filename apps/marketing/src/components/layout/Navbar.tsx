import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useLanguage } from '@consulting19/shared';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [countriesOpen, setCountriesOpen] = useState(false);

  const services = [
    { key: 'companyFormation', href: '/services/company-formation' },
    { key: 'taxOptimization', href: '/services/tax-optimization' },
    { key: 'bankingSolutions', href: '/services/banking-solutions' },
    { key: 'legalCompliance', href: '/services/legal-compliance' }
  ];

  const countries = [
    { key: 'allCountries', href: '/countries', flag: '' },
    { key: 'estonia', href: '/countries/estonia', flag: '🇪🇪' },
    { key: 'uae', href: '/countries/uae', flag: '🇦🇪' },
    { key: 'georgia', href: '/countries/georgia', flag: '🇬🇪' },
    { key: 'malta', href: '/countries/malta', flag: '🇲🇹' },
    { key: 'portugal', href: '/countries/portugal', flag: '🇵🇹' },
    { key: 'usa', href: '/countries/usa', flag: '🇺🇸' }
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">Consulting19</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              {t('nav.home')}
            </Link>

            {/* Services Dropdown */}
            <div className="relative group">
              <button
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium flex items-center"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                {t('nav.services')}
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {servicesOpen && (
                <div
                  className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <div className="py-1">
                    {services.map((service) => (
                      <Link
                        key={service.key}
                        to={service.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {t(`nav.${service.key}`)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Countries Dropdown */}
            <div className="relative group">
              <button
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium flex items-center"
                onMouseEnter={() => setCountriesOpen(true)}
                onMouseLeave={() => setCountriesOpen(false)}
              >
                {t('nav.countries')}
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {countriesOpen && (
                <div
                  className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                  onMouseEnter={() => setCountriesOpen(true)}
                  onMouseLeave={() => setCountriesOpen(false)}
                >
                  <div className="py-1">
                    {countries.map((country) => (
                      <Link
                        key={country.key}
                        to={country.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {country.flag} {t(`nav.${country.key}`)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/about" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              {t('nav.about')}
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              {t('nav.blog')}
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              {t('nav.contact')}
            </Link>

            <LanguageSelector />

            <Link to="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              {t('nav.login')}
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              {t('nav.register')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <LanguageSelector />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.home')}
            </Link>

            {/* Mobile Services */}
            <div className="px-3 py-2">
              <div className="text-gray-700 text-base font-medium mb-2">{t('nav.services')}</div>
              {services.map((service) => (
                <Link
                  key={service.key}
                  to={service.href}
                  className="block px-4 py-1 text-sm text-gray-600 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  {t(`nav.${service.key}`)}
                </Link>
              ))}
            </div>

            {/* Mobile Countries */}
            <div className="px-3 py-2">
              <div className="text-gray-700 text-base font-medium mb-2">{t('nav.countries')}</div>
              {countries.map((country) => (
                <Link
                  key={country.key}
                  to={country.href}
                  className="block px-4 py-1 text-sm text-gray-600 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  {country.flag} {t(`nav.${country.key}`)}
                </Link>
              ))}
            </div>

            <Link
              to="/about"
              className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.about')}
            </Link>
            <Link
              to="/blog"
              className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.blog')}
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.contact')}
            </Link>
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.login')}
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white block px-3 py-2 rounded-md text-base font-medium mx-3 mt-2"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.register')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;