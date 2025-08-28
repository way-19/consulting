import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut, Settings, Globe } from 'lucide-react';
import { useLanguage } from '@consulting19/shared';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isCountriesOpen, setIsCountriesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const countriesRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countriesRef.current && !countriesRef.current.contains(event.target as Node)) {
        setIsCountriesOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const countries = [
    { name: 'United States', flag: '🇺🇸', path: '/countries/usa' },
    { name: 'United Kingdom', flag: '🇬🇧', path: '/countries/uk' },
    { name: 'Germany', flag: '🇩🇪', path: '/countries/germany' },
    { name: 'Singapore', flag: '🇸🇬', path: '/countries/singapore' },
    { name: 'Switzerland', flag: '🇨🇭', path: '/countries/switzerland' },
    { name: 'Dubai', flag: '🇦🇪', path: '/countries/dubai' }
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Consulting19
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Services */}
            <Link
              to="/services"
              className="relative px-4 py-2 text-gray-700 hover:text-white font-medium rounded-lg transition-all duration-300 overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg"></span>
              <span className="relative z-10">{t('nav.services')}</span>
            </Link>

            {/* Countries Dropdown */}
            <div className="relative" ref={countriesRef}>
              <button
                onClick={() => setIsCountriesOpen(!isCountriesOpen)}
                className="relative flex items-center px-4 py-2 text-gray-700 hover:text-white font-medium rounded-lg transition-all duration-300 overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg"></span>
                <span className="relative z-10 mr-1">{t('nav.countries')}</span>
                <ChevronDown className={`relative z-10 w-4 h-4 transition-transform duration-200 ${isCountriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCountriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  {countries.map((country) => (
                    <Link
                      key={country.name}
                      to={country.path}
                      className="relative flex items-center px-4 py-3 text-gray-700 hover:text-white transition-all duration-300 overflow-hidden group"
                      onClick={() => setIsCountriesOpen(false)}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                      <span className="relative z-10 text-xl mr-3">{country.flag}</span>
                      <span className="relative z-10 font-medium">{country.name}</span>
                    </Link>
                  ))}
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <Link
                      to="/countries"
                      className="relative flex items-center px-4 py-3 text-gray-700 hover:text-white font-semibold transition-all duration-300 overflow-hidden group"
                      onClick={() => setIsCountriesOpen(false)}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                      <Globe className="relative z-10 w-5 h-5 mr-3" />
                      <span className="relative z-10">All Countries</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* About */}
            <Link
              to="/about"
              className="relative px-4 py-2 text-gray-700 hover:text-white font-medium rounded-lg transition-all duration-300 overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg"></span>
              <span className="relative z-10">{t('nav.about')}</span>
            </Link>

            {/* Blog */}
            <Link
              to="/blog"
              className="relative px-4 py-2 text-gray-700 hover:text-white font-medium rounded-lg transition-all duration-300 overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg"></span>
              <span className="relative z-10">{t('nav.blog')}</span>
            </Link>

            {/* Contact */}
            <Link
              to="/contact"
              className="relative px-4 py-2 text-gray-700 hover:text-white font-medium rounded-lg transition-all duration-300 overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg"></span>
              <span className="relative z-10">{t('nav.contact')}</span>
            </Link>
          </div>

          {/* Right side - Language & Account */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            
            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <User className="w-4 h-4" />
                <span>Account</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  <Link
                    to="/auth/login"
                    className="relative flex items-center px-4 py-3 text-gray-700 hover:text-white transition-all duration-300 overflow-hidden group"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    <User className="relative z-10 w-4 h-4 mr-3" />
                    <span className="relative z-10">Login</span>
                  </Link>
                  <Link
                    to="/auth/register"
                    className="relative flex items-center px-4 py-3 text-gray-700 hover:text-white transition-all duration-300 overflow-hidden group"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    <Settings className="relative z-10 w-4 h-4 mr-3" />
                    <span className="relative z-10">Register</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            <Link
              to="/services"
              className="relative block px-4 py-3 text-gray-700 hover:text-white font-medium rounded-lg transition-all duration-300 overflow-hidden group"
              onClick={() => setIsOpen(false)}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg"></span>
              <span className="relative z-10">{t('nav.services')}</span>
            </Link>
            
            <Link
              to="/countries"
              className="relative block px-4 py-3 text-gray-700 hover:text-white font-medium rounded-lg transition-all duration-300 overflow-hidden group"
              onClick={() => setIsOpen(false)}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg"></span>
              <span className="relative z-10">{t('nav.countries')}</span>
            </Link>
            
            <Link
              to="/about"
              className="relative block px-4 py-3 text-gray-700 hover:text-white font-medium rounded-lg transition-all duration-300 overflow-hidden group"
              onClick={() => setIsOpen(false)}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg"></span>
              <span className="relative z-10">{t('nav.about')}</span>
            </Link>
            
            <Link
              to="/blog"
              className="relative block px-4 py-3 text-gray-700 hover:text-white font-medium rounded-lg transition-all duration-300 overflow-hidden group"
              onClick={() => setIsOpen(false)}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg"></span>
              <span className="relative z-10">{t('nav.blog')}</span>
            </Link>
            
            <Link
              to="/contact"
              className="relative block px-4 py-3 text-gray-700 hover:text-white font-medium rounded-lg transition-all duration-300 overflow-hidden group"
              onClick={() => setIsOpen(false)}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg"></span>
              <span className="relative z-10">{t('nav.contact')}</span>
            </Link>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <Link
                to="/auth/login"
                className="relative block px-4 py-3 text-gray-700 hover:text-white font-medium rounded-lg transition-all duration-300 overflow-hidden group"
                onClick={() => setIsOpen(false)}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg"></span>
                <span className="relative z-10">Login</span>
              </Link>
              
              <Link
                to="/auth/register"
                className="relative block px-4 py-3 text-gray-700 hover:text-white font-medium rounded-lg transition-all duration-300 overflow-hidden group"
                onClick={() => setIsOpen(false)}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg"></span>
                <span className="relative z-10">Register</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;