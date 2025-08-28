import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, LogOut, ChevronDown } from 'lucide-react';
import { useAuth, useLanguage } from '@consulting19/shared';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCountriesDropdownOpen, setIsCountriesDropdownOpen] = useState(false);
  const { user, userRole, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountriesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const featuredCountries = [
    { id: 'uae', name: t('countries.uae') },
    { id: 'estonia', name: t('countries.estonia') },
    { id: 'georgia', name: t('countries.georgia') },
    { id: 'malta', name: t('countries.malta') },
    { id: 'panama', name: t('countries.panama') },
  ];

  const navItems = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.services'), href: '/services' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.blog'), href: '/blog' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-lg relative z-50">
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
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Countries Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsCountriesDropdownOpen(!isCountriesDropdownOpen)}
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                {t('nav.countries')}
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${
                  isCountriesDropdownOpen ? 'rotate-180' : ''
                }`} />
              </button>
              
              {isCountriesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  {featuredCountries.map((country) => (
                    <Link
                      key={country.id}
                      to={`/countries/${country.id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                      onClick={() => setIsCountriesDropdownOpen(false)}
                    >
                      {country.name}
                    </Link>
                  ))}
                  <hr className="my-1 border-gray-200" />
                  <Link
                    to="/countries"
                    className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium transition-colors duration-200"
                    onClick={() => setIsCountriesDropdownOpen(false)}
                  >
                    {t('countries.all')}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            
            {user ? (
              <div className="flex items-center space-x-4">
                {userRole === 'admin' && (
                  <Link
                    to="/admin"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    Admin Panel
                  </Link>
                )}
                {(userRole === 'client' || userRole === 'consultant') && (
                  <a
                    href="https://dashboard.consulting19.com"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('nav.dashboard')}
                  </a>
                )}
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-red-600 transition-colors duration-200"
                  title="Sign Out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t">
          <div className="px-4 py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Countries Section */}
            <div className="pt-2">
              <div className="text-sm font-medium text-gray-900 mb-2">{t('nav.countries')}</div>
              <div className="pl-4 space-y-2">
                {featuredCountries.map((country) => (
                  <Link
                    key={country.id}
                    to={`/countries/${country.id}`}
                    className="block text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {country.name}
                  </Link>
                ))}
                <Link
                  to="/countries"
                  className="block text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('countries.all')}
                </Link>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <LanguageSelector />
            </div>

            {user ? (
              <div className="space-y-2">
                {userRole === 'admin' && (
                  <Link
                    to="/admin"
                    className="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                {(userRole === 'client' || userRole === 'consultant') && (
                  <a
                    href="https://dashboard.consulting19.com"
                    className="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('nav.dashboard')}
                  </a>
                )}
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium text-left"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block w-full text-center text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium border border-gray-300 px-4 py-2 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;