import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Users, Menu, X, ChevronDown, User } from 'lucide-react';
import { useLanguage } from '@consulting19/shared';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCountriesOpen, setIsCountriesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Featured countries to show in dropdown
  const featuredCountries = [
    { name: 'United Arab Emirates', code: 'ae', flag: '🇦🇪' },
    { name: 'Estonia', code: 'ee', flag: '🇪🇪' },
    { name: 'Georgia', code: 'ge', flag: '🇬🇪' },
    { name: 'Malta', code: 'mt', flag: '🇲🇹' },
    { name: 'Panama', code: 'pa', flag: '🇵🇦' },
    { name: 'Portugal', code: 'pt', flag: '🇵🇹' }
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsCountriesOpen(false);
      setIsUserMenuOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Consulting19
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/services" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-105 transform"
            >
              {t('nav.services')}
            </Link>

            {/* Countries Dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsCountriesOpen(!isCountriesOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-105 transform"
              >
                <span>{t('nav.countries')}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCountriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCountriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 py-2 z-50">
                  {featuredCountries.map((country) => (
                    <Link
                      key={country.code}
                      to={`/countries/${country.code}`}
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 transition-all duration-200"
                      onClick={() => setIsCountriesOpen(false)}
                    >
                      <span className="text-lg">{country.flag}</span>
                      <span className="font-medium">{country.name}</span>
                    </Link>
                  ))}
                  <div className="border-t border-gray-200/50 my-2"></div>
                  <Link
                    to="/countries"
                    className="flex items-center space-x-3 px-4 py-2 text-blue-600 hover:bg-blue-50/80 font-medium transition-all duration-200"
                    onClick={() => setIsCountriesOpen(false)}
                  >
                    <Globe className="w-4 h-4" />
                    <span>All Countries</span>
                  </Link>
                </div>
              )}
            </div>

            <Link 
              to="/about" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-105 transform"
            >
              {t('nav.about')}
            </Link>
            <Link 
              to="/blog" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-105 transform"
            >
              {t('nav.blog')}
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-105 transform"
            >
              {t('nav.contact')}
            </Link>
          </div>

          {/* Right Side - Language Selector & User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            
            {/* User Menu */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <User className="w-4 h-4" />
                <span>{t('nav.account')}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 py-2 z-50">
                  <Link
                    to="/auth/login"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 transition-all duration-200"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/auth/register"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 transition-all duration-200"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    {t('nav.register')}
                  </Link>
                  <div className="border-t border-gray-200/50 my-2"></div>
                  <Link
                    to="/client-dashboard"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 transition-all duration-200"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Client Dashboard
                  </Link>
                  <Link
                    to="/consultant-dashboard"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 transition-all duration-200"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Consultant Dashboard
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg">
            <div className="px-4 py-4 space-y-4">
              <Link 
                to="/services" 
                className="block text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.services')}
              </Link>
              <Link 
                to="/countries" 
                className="block text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.countries')}
              </Link>
              <Link 
                to="/about" 
                className="block text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.about')}
              </Link>
              <Link 
                to="/blog" 
                className="block text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.blog')}
              </Link>
              <Link 
                to="/contact" 
                className="block text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.contact')}
              </Link>
              
              <div className="border-t border-gray-200/50 pt-4">
                <LanguageSelector />
              </div>
              
              <div className="space-y-2">
                <Link
                  to="/auth/login"
                  className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium text-center transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/auth/register"
                  className="block border border-blue-600 text-blue-600 px-4 py-2 rounded-lg font-medium text-center hover:bg-blue-50 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
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