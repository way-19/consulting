import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut, Globe } from 'lucide-react';
import { useAuth, useLanguage } from '@consulting19/shared';
import { Button } from '@consulting19/ui';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCountriesOpen, setIsCountriesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, signOut, userRole } = useAuth();
  const { t } = useLanguage();

  const featuredCountries = [
    { id: 'uae', name: 'UAE', flag: '🇦🇪' },
    { id: 'estonia', name: 'Estonia', flag: '🇪🇪' },
    { id: 'georgia', name: 'Georgia', flag: '🇬🇪' },
    { id: 'malta', name: 'Malta', flag: '🇲🇹' },
    { id: 'panama', name: 'Panama', flag: '🇵🇦' },
    { id: 'portugal', name: 'Portugal', flag: '🇵🇹' },
  ];

  const getDashboardUrl = () => {
    switch (userRole) {
      case 'admin':
        return 'https://admin.consulting19.com';
      case 'consultant':
        return 'https://consultant.consulting19.com';
      case 'client':
        return 'https://client.consulting19.com';
      default:
        return '/login';
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
              <span className="text-white font-bold text-sm">C19</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Consulting19
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Services */}
            <Link to="/services" className="relative group px-4 py-2 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <span className="relative z-10 font-medium text-gray-700 group-hover:text-white transition-colors duration-300">
                {t('nav.services')}
              </span>
            </Link>

            {/* Countries Dropdown */}
            <div className="relative group">
              <button
                onClick={() => setIsCountriesOpen(!isCountriesOpen)}
                className="relative flex items-center space-x-1 px-4 py-2 rounded-lg overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <span className="relative z-10 font-medium text-gray-700 group-hover:text-white transition-colors duration-300">
                  {t('nav.countries')}
                </span>
                <ChevronDown className="relative z-10 w-4 h-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
              </button>

              {isCountriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                  {featuredCountries.map((country) => (
                    <Link
                      key={country.id}
                      to={`/countries/${country.id}`}
                      className="relative flex items-center space-x-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 group overflow-hidden"
                      onClick={() => setIsCountriesOpen(false)}
                    >
                      <span className="text-xl">{country.flag}</span>
                      <span className="font-medium">{country.name}</span>
                    </Link>
                  ))}
                  <hr className="my-2 border-gray-200" />
                  <Link
                    to="/countries"
                    className="relative flex items-center space-x-3 px-4 py-3 hover:bg-gradient-to-r hover:from-green-500 hover:to-teal-600 hover:text-white transition-all duration-300 group overflow-hidden"
                    onClick={() => setIsCountriesOpen(false)}
                  >
                    <Globe className="w-5 h-5" />
                    <span className="font-medium">All Countries</span>
                  </Link>
                </div>
              )}
            </div>

            {/* About */}
            <Link to="/about" className="relative group px-4 py-2 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <span className="relative z-10 font-medium text-gray-700 group-hover:text-white transition-colors duration-300">
                {t('nav.about')}
              </span>
            </Link>

            {/* Blog */}
            <Link to="/blog" className="relative group px-4 py-2 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <span className="relative z-10 font-medium text-gray-700 group-hover:text-white transition-colors duration-300">
                {t('nav.blog')}
              </span>
            </Link>

            {/* Contact */}
            <Link to="/contact" className="relative group px-4 py-2 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <span className="relative z-10 font-medium text-gray-700 group-hover:text-white transition-colors duration-300">
                {t('nav.contact')}
              </span>
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="relative flex items-center space-x-2 px-4 py-2 rounded-lg overflow-hidden group hover:bg-gradient-to-r hover:from-yellow-500 hover:to-orange-600 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-white transition-colors duration-300">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                    <a
                      href={getDashboardUrl()}
                      className="flex items-center space-x-2 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300"
                    >
                      <User className="w-4 h-4" />
                      <span>{t('nav.dashboard')}</span>
                    </a>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-600 hover:text-white transition-all duration-300"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                    {t('nav.register')}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              <Link
                to="/services"
                className="block px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.services')}
              </Link>
              <Link
                to="/countries"
                className="block px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-teal-500 hover:to-blue-600 hover:text-white transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.countries')}
              </Link>
              <Link
                to="/about"
                className="block px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-green-500 hover:to-teal-600 hover:text-white transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.about')}
              </Link>
              <Link
                to="/blog"
                className="block px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 hover:text-white transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.blog')}
              </Link>
              <Link
                to="/contact"
                className="block px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-600 hover:text-white transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.contact')}
              </Link>
              
              {user ? (
                <div className="pt-4 border-t border-gray-200">
                  <a
                    href={getDashboardUrl()}
                    className="block px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300"
                  >
                    {t('nav.dashboard')}
                  </a>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-600 hover:text-white transition-all duration-300"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link
                    to="/login"
                    className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700 transition-all duration-300"
                    onClick={() => setIsOpen(false)}
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