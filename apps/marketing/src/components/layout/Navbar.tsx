import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@shared/contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Navbar: React.FC = () => {
  const { t } = useLanguage();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              {t('brand.name', 'Brand')}
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              {t('nav.home', 'Home')}
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900">
              {t('nav.about', 'About')}
            </Link>
            <Link to="/services" className="text-gray-600 hover:text-gray-900">
              {t('nav.services', 'Services')}
            </Link>
            <Link to="/countries" className="text-gray-600 hover:text-gray-900">
              {t('nav.countries', 'Countries')}
            </Link>
            <Link to="/blog" className="text-gray-600 hover:text-gray-900">
              {t('nav.blog', 'Blog')}
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900">
              {t('nav.contact', 'Contact')}
            </Link>
            <LanguageSelector />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;