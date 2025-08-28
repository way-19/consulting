import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronDown, Menu, X } from 'lucide-react';
import { useLanguage } from '@consulting19/shared';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const { t } = useLanguage();
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isCountriesOpen, setIsCountriesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const servicesRef = useRef<HTMLDivElement>(null);
  const countriesRef = useRef<HTMLDivElement>(null);

  // Auto-close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
      if (countriesRef.current && !countriesRef.current.contains(event.target as Node)) {
        setIsCountriesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Consulting19
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Home Button */}
            <Link
              to="/"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              <Home className="w-4 h-4 mr-2" />
              {t('nav.home')}
            </Link>

            {/* Services Dropdown */}
            <div className="relative" ref={servicesRef}>
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                {t('nav.services')}
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {isServicesOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Link
                      to="/services"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {t('nav.allServices')}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Countries Dropdown */}
            <div className="relative" ref={countriesRef}>
              <button
                onClick={() => setIsCountriesOpen(!isCountriesOpen)}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-600 hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                {t('nav.countries')}
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {isCountriesOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Link
                      to="/countries"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {t('nav.allCountries')}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/about"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              {t('nav.about')}
            </Link>

            <Link
              to="/blog"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-600 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              {t('nav.blog')}
            </Link>

            <Link
              to="/contact"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-orange-500 hover:to-yellow-600 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              {t('nav.contact')}
            </Link>

            <LanguageSelector />

            <Link
              to="/auth/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              {t('nav.login')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                to="/"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                <Home className="w-4 h-4 mr-2" />
                {t('nav.home')}
              </Link>
              <Link
                to="/services"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {t('nav.services')}
              </Link>
              <Link
                to="/countries"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {t('nav.countries')}
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {t('nav.about')}
              </Link>
              <Link
                to="/blog"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {t('nav.blog')}
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {t('nav.contact')}
              </Link>
              <div className="px-3 py-2">
                <LanguageSelector />
              </div>
              <Link
                to="/auth/login"
                className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
              >
                {t('nav.login')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;