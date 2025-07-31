import React from 'react';
import { Sparkles } from 'lucide-react';

interface HeaderProps {
  language: 'en' | 'tr';
  onLanguageToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ language, onLanguageToggle }) => {
  const content = {
    en: {
      about: 'About',
      services: 'Services',
      countries: 'Countries',
      contact: 'Contact'
    },
    tr: {
      about: 'Hakkımızda',
      services: 'Hizmetler',
      countries: 'Ülkeler',
      contact: 'İletişim'
    }
  };

  const t = content[language];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mr-3">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CONSULTING19</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-gray-700 hover:text-purple-600 transition-colors">
              {t.about}
            </a>
            <a href="#services" className="text-gray-700 hover:text-purple-600 transition-colors">
              {t.services}
            </a>
            <a href="#countries" className="text-gray-700 hover:text-purple-600 transition-colors">
              {t.countries}
            </a>
            <a href="#contact" className="text-gray-700 hover:text-purple-600 transition-colors">
              {t.contact}
            </a>
          </nav>

          {/* Language Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onLanguageToggle}
              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium">
                {language === 'en' ? '🇺🇸 EN' : '🇹🇷 TR'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;