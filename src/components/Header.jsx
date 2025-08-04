import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCountriesOpen, setIsCountriesOpen] = useState(false);
  const location = useLocation();

  const countries = [
    { name: 'Georgia', slug: 'georgia', flag: '🇬🇪' },
    { name: 'USA', slug: 'usa', flag: '🇺🇸' },
    { name: 'Montenegro', slug: 'montenegro', flag: '🇲🇪' },
    { name: 'Estonia', slug: 'estonia', flag: '🇪🇪' },
    { name: 'Portugal', slug: 'portugal', flag: '🇵🇹' },
    { name: 'Malta', slug: 'malta', flag: '🇲🇹' },
    { name: 'Panama', slug: 'panama', flag: '🇵🇦' },
    { name: 'UAE', slug: 'uae', flag: '🇦🇪' },
    { name: 'Switzerland', slug: 'switzerland', flag: '🇨🇭' },
    { name: 'Spain', slug: 'spain', flag: '🇪🇸' }
  ];

  const navigation = [
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">C19</span>
            </div>
            <span className="text-xl font-bold text-gray-900">CONSULTING19</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === item.href ? 'text-purple-600' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}

            <Link
              to="/blog"
              className={`text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === '/blog' ? 'text-purple-600' : ''
              }`}
            >
              Blog
            </Link>

            {/* Countries Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCountriesOpen(!isCountriesOpen)}
                className="flex items-center text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Countries
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isCountriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCountriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="grid grid-cols-2 gap-1 p-2">
                    {countries.map((country) => (
                      <Link
                        key={country.slug}
                        to={`/${country.slug}`}
                        onClick={() => setIsCountriesOpen(false)}
                        className="flex items-center p-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors rounded-lg"
                      >
                        <span className="text-lg mr-2">{country.flag}</span>
                        <span className="font-medium">{country.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/login"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-6 space-y-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-700 hover:text-purple-600 py-2 text-lg font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}

            <Link
              to="/blog"
              onClick={() => setIsMenuOpen(false)}
              className="block text-gray-700 hover:text-purple-600 py-2 text-lg font-medium transition-colors"
            >
              Blog
            </Link>

            <div className="border-t border-gray-200 pt-6">
              <div className="text-gray-700 font-medium mb-4">Countries</div>
              <div className="grid grid-cols-2 gap-3">
                {countries.map((country) => (
                  <Link
                    key={country.slug}
                    to={`/${country.slug}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center p-3 text-sm text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="text-lg mr-3">{country.flag}</span>
                    <span>{country.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;