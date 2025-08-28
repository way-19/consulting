import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useLanguage } from '@consulting19/shared';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleDropdown = (dropdown: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">Consulting19</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Home Button */}
            <Link
              to="/"
              className="text-gray-700 hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              {t('nav.home')}
            </Link>

            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => toggleDropdown('services', e)}
                className="text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center"
              >
                {t('nav.services')}
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {activeDropdown === 'services' && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link to="/services" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    {t('nav.allServices')}
                  </Link>
                  <Link to="/services/company-formation" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    {t('nav.companyFormation')}
                  </Link>
                  <Link to="/services/tax-consulting" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    {t('nav.taxConsulting')}
                  </Link>
                </div>
              )}
            </div>

            {/* Countries Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => toggleDropdown('countries', e)}
                className="text-gray-700 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center"
              >
                {t('nav.countries')}
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {activeDropdown === 'countries' && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link to="/countries" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    {t('nav.allCountries')}
                  </Link>
                  <Link to="/countries/estonia" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    🇪🇪 Estonia
                  </Link>
                  <Link to="/countries/dubai" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    🇦🇪 Dubai
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/blog"
              className="text-gray-700 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-blue-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              {t('nav.blog')}
            </Link>

            <Link
              to="/about"
              className="text-gray-700 hover:bg-gradient-to-r hover:from-teal-500 hover:to-cyan-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              {t('nav.about')}
            </Link>

            <Link
              to="/contact"
              className="text-gray-700 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              {t('nav.contact')}
            </Link>

            <LanguageSelector />

            {/* Auth Buttons */}
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {t('nav.login')}
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {t('nav.register')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/services"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.services')}
              </Link>
              <Link
                to="/countries"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.countries')}
              </Link>
              <Link
                to="/blog"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.blog')}
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.about')}
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.contact')}
              </Link>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.register')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;