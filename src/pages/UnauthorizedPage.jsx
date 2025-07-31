// pages/UnauthorizedPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const UnauthorizedPage = () => {
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-red-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Language Toggle */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-white bg-opacity-20 rounded-lg p-1">
            <button
              onClick={() => changeLanguage('tr')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentLanguage === 'tr' 
                  ? 'bg-white text-red-600' 
                  : 'text-white hover:text-red-200'
              }`}
            >
              TR
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentLanguage === 'en' 
                  ? 'bg-white text-red-600' 
                  : 'text-white hover:text-red-200'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Error Content */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-6xl mb-6">🚫</div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {currentLanguage === 'tr' ? 'Yetkisiz Erişim' : 'Unauthorized Access'}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {currentLanguage === 'tr' 
              ? 'Bu sayfaya erişim yetkiniz bulunmamaktadır. Lütfen doğru hesapla giriş yapın.' 
              : 'You do not have permission to access this page. Please login with the correct account.'
            }
          </p>

          <div className="space-y-3">
            <Link
              to="/login"
              className="block w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              {currentLanguage === 'tr' ? 'Giriş Yap' : 'Login'}
            </Link>
            
            <Link
              to="/"
              className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors font-medium"
            >
              {currentLanguage === 'tr' ? 'Ana Sayfaya Dön' : 'Back to Homepage'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;