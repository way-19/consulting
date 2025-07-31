// pages/dashboards/ClientDashboard.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const { t, currentLanguage, changeLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleCompanyFormation = () => {
    window.open('https://consulting19.com/order-online', '_blank');
  };

  const handleAIAssistant = () => {
    window.open('https://aiagent19.com', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl">🌟</span>
              <h1 className="ml-2 text-xl font-bold text-purple-600">Client Portal</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => changeLanguage('tr')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    currentLanguage === 'tr' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  TR
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    currentLanguage === 'en' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  EN
                </button>
              </div>
              
              <div className="text-sm text-gray-600">
                {user?.first_name} {user?.last_name}
              </div>
              
              <button
                onClick={handleLogout}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              >
                {currentLanguage === 'tr' ? 'Çıkış' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {currentLanguage === 'tr' 
              ? `Hoş geldiniz, ${user?.first_name}!` 
              : `Welcome back, ${user?.first_name}!`
            }
          </h2>
          <p className="text-gray-600 mt-2">
            {currentLanguage === 'tr' 
              ? 'Başvurularınızı takip edin, danışmanlarla iletişim kurun ve iş kurulum sürecinizi yönetin' 
              : 'Track your applications, communicate with consultants, and manage your business setup'
            }
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              🏢 {currentLanguage === 'tr' ? 'Şirket Kuruluşu' : 'Company Formation'}
            </h3>
            <p className="text-blue-100 mb-4">
              {currentLanguage === 'tr' 
                ? 'Yeni bir şirket kurmak için hemen başlayın' 
                : 'Start forming your company right away'
              }
            </p>
            <button 
              onClick={handleCompanyFormation}
              className="bg-white text-purple-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100"
            >
              {currentLanguage === 'tr' ? 'Başla' : 'Get Started'}
            </button>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-blue-500 text-white rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              🤖 {currentLanguage === 'tr' ? 'AI Asistan' : 'AI Assistant'}
            </h3>
            <p className="text-green-100 mb-4">
              {currentLanguage === 'tr' 
                ? 'Sorularınız için AI destekli yardım alın' 
                : 'Get AI-powered help for your questions'
              }
            </p>
            <button 
              onClick={handleAIAssistant}
              className="bg-white text-green-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100"
            >
              {currentLanguage === 'tr' ? 'Sohbet Et' : 'Chat Now'}
            </button>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              📞 {currentLanguage === 'tr' ? 'Danışman Desteği' : 'Consultant Support'}
            </h3>
            <p className="text-orange-100 mb-4">
              {currentLanguage === 'tr' 
                ? 'Uzman danışmanlarımızla iletişime geçin' 
                : 'Connect with our expert consultants'
              }
            </p>
            <button className="bg-white text-orange-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100">
              {currentLanguage === 'tr' ? 'İletişim' : 'Contact'}
            </button>
          </div>
        </div>

        {/* Application Status */}
        <div className="bg-white rounded-lg p-6 shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">
            {currentLanguage === 'tr' ? 'Başvuru Durumu' : 'Application Status'}
          </h3>
          
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📋</div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              {currentLanguage === 'tr' ? 'Henüz başvuru yok' : 'No applications yet'}
            </h4>
            <p className="text-gray-600 mb-6">
              {currentLanguage === 'tr' 
                ? 'Hizmetlerimizi inceleyerek başlayın' 
                : 'Get started by exploring our services'
              }
            </p>
            <button 
              onClick={() => navigate('/services')}
              className="bg-purple-600 text-white px-6 py-3 rounded-md font-medium hover:bg-purple-700"
            >
              {currentLanguage === 'tr' ? 'Hizmetleri İncele' : 'Browse Services'}
            </button>
          </div>
        </div>

        {/* Available Countries */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-4">
            {currentLanguage === 'tr' ? 'Mevcut Ülkeler' : 'Available Countries'}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { name: 'Georgia', slug: 'georgia', flag: '🇬🇪' },
              { name: 'USA', slug: 'usa', flag: '🇺🇸' },
              { name: 'Montenegro', slug: 'montenegro', flag: '🇲🇪' },
              { name: 'Estonia', slug: 'estonia', flag: '🇪🇪' },
              { name: 'Portugal', slug: 'portugal', flag: '🇵🇹' },
              { name: 'Malta', slug: 'malta', flag: '🇲🇹' },
              { name: 'Panama', slug: 'panama', flag: '🇵🇦' }
            ].map((country) => (
              <button
                key={country.slug}
                onClick={() => navigate(`/${country.slug}`)}
                className="p-4 text-center bg-gray-50 rounded-lg hover:bg-purple-50 hover:border-purple-200 border border-transparent transition-colors"
              >
                <div className="text-2xl mb-2">{country.flag}</div>
                <div className="text-sm font-medium text-gray-900">{country.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;