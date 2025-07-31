import React, { useState } from 'react';
import { Sparkles, ChevronDown, Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Header: React.FC = () => {
  const [isCountriesOpen, setIsCountriesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentLanguage, changeLanguage, t } = useLanguage();

  const countries = [
    { name: 'Georgia', slug: 'georgia', flag: '🇬🇪' },
    { name: 'USA', slug: 'usa', flag: '🇺🇸' },
    { name: 'Montenegro', slug: 'montenegro', flag: '🇲🇪' },
    { name: 'Estonia', slug: 'estonia', flag: '🇪🇪' },
    { name: 'Portugal', slug: 'portugal', flag: '🇵🇹' },
    { name: 'Malta', slug: 'malta', flag: '🇲🇹' },
    { name: 'Panama', slug: 'panama', flag: '🇵🇦' }
  ];

  const navigation = [
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.services'), href: '/services' },
    { name: t('nav.contact'), href: '/contact' },
    { name: t('nav.blog'), href: '/blog' },
    { name: t('nav.partnership'), href: '/partnership' }
  ];

  const toggleLanguage = () => {
    changeLanguage(currentLanguage === 'en' ? 'tr' : 'en');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mr-3">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CONSULTING19</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </a>
            ))}

            {/* Countries Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCountriesOpen(!isCountriesOpen)}
                className="flex items-center text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {t('nav.countries')}
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isCountriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCountriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="grid grid-cols-1 gap-1 p-2">
                    {countries.map((country) => (
                      <a
                        key={country.slug}
                        href={`/${country.slug}`}
                        onClick={() => setIsCountriesOpen(false)}
                        className="flex items-center p-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors rounded-lg"
                      >
                        <span className="text-lg mr-3">{country.flag}</span>
                        <span className="font-medium">{country.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">
                {currentLanguage === 'en' ? '🇺🇸 EN' : '🇹🇷 TR'}
              </span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-6 space-y-6">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-gray-700 hover:text-purple-600 py-2 text-lg font-medium transition-colors"
              >
                {item.name}
              </a>
            ))}

            <div className="border-t border-gray-200 pt-6">
              <div className="text-gray-700 font-medium mb-4">{t('nav.countries')}</div>
              <div className="grid grid-cols-2 gap-3">
                {countries.slice(0, 6).map((country) => (
                  <a
                    key={country.slug}
                    href={`/${country.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center p-3 text-sm text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="text-lg mr-3">{country.flag}</span>
                    <span>{country.name}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {currentLanguage === 'en' ? '🇹🇷 Türkçe' : '🇺🇸 English'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;