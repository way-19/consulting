import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useLanguage } from '@consulting19/shared';
import { Button } from '@consulting19/ui';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [countriesOpen, setCountriesOpen] = useState(false);

  const services = [
    { name: 'Company Formation', href: '/services/company-formation' },
    { name: 'Tax Optimization', href: '/services/tax-optimization' },
    { name: 'Banking Solutions', href: '/services/banking-solutions' },
    { name: 'Legal Compliance', href: '/services/legal-compliance' },
    { name: 'Asset Protection', href: '/services/asset-protection' },
    { name: 'Investment Advisory', href: '/services/investment-advisory' },
  ];

  const countries = [
    { name: 'UAE', flag: '🇦🇪', href: '/countries/uae' },
    { name: 'Estonia', flag: '🇪🇪', href: '/countries/estonia' },
    { name: 'Georgia', flag: '🇬🇪', href: '/countries/georgia' },
    { name: 'Malta', flag: '🇲🇹', href: '/countries/malta' },
    { name: 'Panama', flag: '🇵🇦', href: '/countries/panama' },
    { name: 'Portugal', flag: '🇵🇹', href: '/countries/portugal' },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C19</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Consulting19</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
              {t('nav.home')}
            </Link>

            {/* Services Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <span>{t('nav.services')}</span>
                <ChevronDown size={16} />
              </button>
              
              <div 
                className={`absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg border transition-all duration-200 ${
                  servicesOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <div className="py-2">
                  {services.map((service) => (
                    <Link
                      key={service.name}
                      to={service.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Countries Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                onMouseEnter={() => setCountriesOpen(true)}
                onMouseLeave={() => setCountriesOpen(false)}
              >
                <span>{t('nav.countries')}</span>
                <ChevronDown size={16} />
              </button>
              
              <div 
                className={`absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg border transition-all duration-200 ${
                  countriesOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onMouseEnter={() => setCountriesOpen(true)}
                onMouseLeave={() => setCountriesOpen(false)}
              >
                <div className="py-2">
                  {countries.map((country) => (
                    <Link
                      key={country.name}
                      to={country.href}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    >
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
              {t('nav.about')}
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
              {t('nav.contact')}
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
              {t('nav.blog')}
            </Link>

            <LanguageSelector />

            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">{t('nav.login')}</Button>
              </Link>
              <Link to="/register">
                <Button>{t('nav.register')}</Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.home')}
              </Link>
              
              {/* Mobile Services */}
              <div>
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className="flex items-center justify-between w-full px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  <span>{t('nav.services')}</span>
                  <ChevronDown size={16} className={`transform transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                </button>
                {servicesOpen && (
                  <div className="pl-6 space-y-1">
                    {services.map((service) => (
                      <Link
                        key={service.name}
                        to={service.href}
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        {service.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Countries */}
              <div>
                <button
                  onClick={() => setCountriesOpen(!countriesOpen)}
                  className="flex items-center justify-between w-full px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  <span>{t('nav.countries')}</span>
                  <ChevronDown size={16} className={`transform transition-transform ${countriesOpen ? 'rotate-180' : ''}`} />
                </button>
                {countriesOpen && (
                  <div className="pl-6 space-y-1">
                    {countries.map((country) => (
                      <Link
                        key={country.name}
                        to={country.href}
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        <span>{country.flag}</span>
                        <span>{country.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/about"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.about')}
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.contact')}
              </Link>
              <Link
                to="/blog"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.blog')}
              </Link>

              <div className="px-3 py-2">
                <LanguageSelector />
              </div>

              <div className="px-3 py-2 space-y-2">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full">{t('nav.login')}</Button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">{t('nav.register')}</Button>
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