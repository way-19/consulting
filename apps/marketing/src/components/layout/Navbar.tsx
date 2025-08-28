import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '@consulting19/shared';
import { Button } from '@consulting19/ui';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [countriesOpen, setCountriesOpen] = useState(false);

  const services = [
    { id: 'company-formation', name: 'Company Formation', href: '/services/company-formation' },
    { id: 'tax-optimization', name: 'Tax Optimization', href: '/services/tax-optimization' },
    { id: 'banking-solutions', name: 'Banking Solutions', href: '/services/banking-solutions' },
    { id: 'legal-compliance', name: 'Legal Compliance', href: '/services/legal-compliance' },
    { id: 'asset-protection', name: 'Asset Protection', href: '/services/asset-protection' },
    { id: 'investment-advisory', name: 'Investment Advisory', href: '/services/investment-advisory' },
    { id: 'visa-residency', name: 'Visa & Residency', href: '/services/visa-residency' },
    { id: 'market-research', name: 'Market Research', href: '/services/market-research' },
  ];

  const countries = [
    { id: 'uae', name: 'UAE', flag: '🇦🇪', href: '/countries/uae' },
    { id: 'estonia', name: 'Estonia', flag: '🇪🇪', href: '/countries/estonia' },
    { id: 'georgia', name: 'Georgia', flag: '🇬🇪', href: '/countries/georgia' },
    { id: 'malta', name: 'Malta', flag: '🇲🇹', href: '/countries/malta' },
    { id: 'panama', name: 'Panama', flag: '🇵🇦', href: '/countries/panama' },
    { id: 'portugal', name: 'Portugal', flag: '🇵🇹', href: '/countries/portugal' },
    { id: 'usa', name: 'USA', flag: '🇺🇸', href: '/countries/usa' },
    { id: 'switzerland', name: 'Switzerland', flag: '🇨🇭', href: '/countries/switzerland' },
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
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              
              {servicesOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                  {services.map((service) => (
                    <Link
                      key={service.id}
                      to={service.href}
                      onClick={closeAllDropdowns}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:translate-x-1 transition-all duration-200"
                    >
                      {service.name}
                    </Link>
                  ))}
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
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              
              {countriesOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                  {countries.map((country) => (
                    <Link
                      key={country.id}
                      to={country.href}
                      onClick={closeAllDropdowns}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:translate-x-1 transition-all duration-200"
                    >
                      <span className="mr-3">{country.flag}</span>
                      {country.name}
                    </Link>
                  ))}
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

            <LanguageSelector />

            <div className="flex items-center space-x-2 ml-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  {t('nav.login')}
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">
                  {t('nav.register')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/services"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.services')}
              </Link>
              <Link
                to="/countries"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.countries')}
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.about')}
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.contact')}
              </Link>
              <Link
                to="/blog"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.blog')}
              </Link>
              <Link
                to="/ai-assistant"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                AI Assistant
              </Link>
              
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-3 space-x-3">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">
                      {t('nav.login')}
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <Button size="sm" className="w-full">
                      {t('nav.register')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;