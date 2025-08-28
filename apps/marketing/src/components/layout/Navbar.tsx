import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth, useLanguage } from '@consulting19/shared';
import { Button } from '@consulting19/ui';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [countriesOpen, setCountriesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, signOut, userRole } = useAuth();
  const { t } = useLanguage();

  const services = [
    { name: 'Company Formation', href: '/services/company-formation' },
    { name: 'Tax Optimization', href: '/services/tax-optimization' },
    { name: 'Banking Solutions', href: '/services/banking-solutions' },
    { name: 'Legal Compliance', href: '/services/legal-compliance' },
    { name: 'Asset Protection', href: '/services/asset-protection' },
    { name: 'Investment Advisory', href: '/services/investment-advisory' },
  ];

  const countries = [
    { name: 'UAE 🇦🇪', href: '/countries/uae' },
    { name: 'Estonia 🇪🇪', href: '/countries/estonia' },
    { name: 'Georgia 🇬🇪', href: '/countries/georgia' },
    { name: 'Malta 🇲🇹', href: '/countries/malta' },
    { name: 'Panama 🇵🇦', href: '/countries/panama' },
    { name: 'Portugal 🇵🇹', href: '/countries/portugal' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      setUserMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getDashboardLink = () => {
    if (userRole === 'admin') return 'https://admin.consulting19.com';
    if (userRole === 'consultant') return 'https://consultant.consulting19.com';
    return 'https://client.consulting19.com';
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
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
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              {t('nav.home')}
            </Link>

            {/* Services Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <span className="font-medium">{t('nav.services')}</span>
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
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <Link
                      to="/services"
                      className="block px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                    >
                      {t('nav.viewAllServices')}
                    </Link>
                  </div>
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
                <span className="font-medium">{t('nav.countries')}</span>
                <ChevronDown size={16} />
              </button>
              
              <div 
                className={`absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg border transition-all duration-200 ${
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
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    >
                      {country.name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <Link
                      to="/countries"
                      className="block px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                    >
                      {t('nav.viewAllCountries')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              {t('nav.about')}
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              {t('nav.blog')}
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              {t('nav.contact')}
            </Link>

            <LanguageSelector />

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <ChevronDown size={16} />
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border">
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm text-gray-500 border-b">
                        {user.email}
                      </div>
                      <a
                        href={getDashboardLink()}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      >
                        {t('nav.dashboard')}
                      </a>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        {t('nav.logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost">{t('nav.login')}</Button>
                </Link>
                <Link to="/register">
                  <Button>{t('nav.register')}</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
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
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.home')}
              </Link>
              
              <div className="space-y-1">
                <div className="text-gray-500 text-xs uppercase tracking-wider px-3 py-2">
                  {t('nav.services')}
                </div>
                {services.map((service) => (
                  <Link
                    key={service.name}
                    to={service.href}
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {service.name}
                  </Link>
                ))}
                <Link
                  to="/services"
                  className="block px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {t('nav.viewAllServices')}
                </Link>
              </div>

              <div className="space-y-1 pt-4">
                <div className="text-gray-500 text-xs uppercase tracking-wider px-3 py-2">
                  {t('nav.countries')}
                </div>
                {countries.map((country) => (
                  <Link
                    key={country.name}
                    to={country.href}
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {country.name}
                  </Link>
                ))}
                <Link
                  to="/countries"
                  className="block px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {t('nav.viewAllCountries')}
                </Link>
              </div>

              <div className="space-y-1 pt-4 border-t">
                <Link
                  to="/about"
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {t('nav.about')}
                </Link>
                <Link
                  to="/blog"
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {t('nav.blog')}
                </Link>
                <Link
                  to="/contact"
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {t('nav.contact')}
                </Link>
              </div>

              {user ? (
                <div className="space-y-1 pt-4 border-t">
                  <div className="px-3 py-2 text-sm text-gray-500">
                    {user.email}
                  </div>
                  <a
                    href={getDashboardLink()}
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                  >
                    {t('nav.dashboard')}
                  </a>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <div className="space-y-1 pt-4 border-t">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 transition-colors duration-200"
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