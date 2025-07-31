// pages/dashboards/ConsultantDashboard.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const ConsultantDashboard = () => {
  const { user, logout } = useAuth();
  const { t, currentLanguage, changeLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl">🌟</span>
              <h1 className="ml-2 text-xl font-bold text-blue-600">Consultant Panel</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => changeLanguage('tr')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    currentLanguage === 'tr' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  TR
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    currentLanguage === 'en' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-blue-600'
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
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
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
            {currentLanguage === 'tr' ? 'Danışman Paneli' : 'Consultant Dashboard'}
          </h2>
          <p className="text-gray-600 mt-2">
            {currentLanguage === 'tr' 
              ? 'Müşterilerinizi yönetin ve gelir takibi yapın (65% komisyon)' 
              : 'Manage your clients and track revenue (65% commission)'
            }
          </p>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="flex items-center">
              <div className="bg-green-500 text-white w-12 h-12 rounded-lg flex items-center justify-center">
                💰
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-green-600">$12,450</div>
                <div className="text-sm text-gray-600">
                  {currentLanguage === 'tr' ? 'Aylık Gelir' : 'Monthly Revenue'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="flex items-center">
              <div className="bg-blue-500 text-white w-12 h-12 rounded-lg flex items-center justify-center">
                👥
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-blue-600">23</div>
                <div className="text-sm text-gray-600">
                  {currentLanguage === 'tr' ? 'Aktif Müşteri' : 'Active Clients'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="flex items-center">
              <div className="bg-purple-500 text-white w-12 h-12 rounded-lg flex items-center justify-center">
                ⭐
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-purple-600">4.8</div>
                <div className="text-sm text-gray-600">
                  {currentLanguage === 'tr' ? 'Müşteri Puanı' : 'Client Rating'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="flex items-center">
              <div className="bg-orange-500 text-white w-12 h-12 rounded-lg flex items-center justify-center">
                ⚡
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-orange-600">65%</div>
                <div className="text-sm text-gray-600">
                  {currentLanguage === 'tr' ? 'Komisyon Oranı' : 'Commission Rate'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Legacy Orders */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              📋 {currentLanguage === 'tr' ? 'Legacy Siparişler' : 'Legacy Orders'}
            </h3>
            <p className="text-gray-600 mb-4">
              {currentLanguage === 'tr' 
                ? 'consulting19.com/order-online üzerinden gelen siparişler' 
                : 'Orders from consulting19.com/order-online integration'
              }
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">Demo Customer</div>
                  <div className="text-sm text-gray-600">Georgia LLC - $1,299</div>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {currentLanguage === 'tr' ? 'Atandı' : 'Assigned'}
                </span>
              </div>
            </div>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
              {currentLanguage === 'tr' ? 'Tüm Siparişleri Görüntüle' : 'View All Orders'}
            </button>
          </div>

          {/* Custom Services */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              🛠️ {currentLanguage === 'tr' ? 'Özel Hizmetler' : 'Custom Services'}
            </h3>
            <p className="text-gray-600 mb-4">
              {currentLanguage === 'tr' 
                ? 'Kendi hizmetlerinizi oluşturun ve ödeme talepleri gönderin' 
                : 'Create your own services and send payment requests'
              }
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">
                    {currentLanguage === 'tr' ? 'Pazar Araştırması' : 'Market Research'}
                  </div>
                  <div className="text-sm text-gray-600">$299 - Active</div>
                </div>
                <button className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  {currentLanguage === 'tr' ? 'Ödeme Gönder' : 'Send Payment'}
                </button>
              </div>
            </div>
            <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
              {currentLanguage === 'tr' ? 'Yeni Hizmet Oluştur' : 'Create New Service'}
            </button>
          </div>
        </div>

        {/* Commission Breakdown */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-4">
            {currentLanguage === 'tr' ? 'Komisyon Dökümü' : 'Commission Breakdown'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-xl font-bold text-blue-600">$8,145</div>
              <div className="text-sm text-gray-600">
                {currentLanguage === 'tr' ? 'Legacy Siparişler' : 'Legacy Orders'}
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded">
              <div className="text-xl font-bold text-green-600">$2,980</div>
              <div className="text-sm text-gray-600">
                {currentLanguage === 'tr' ? 'Özel Hizmetler' : 'Custom Services'}
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded">
              <div className="text-xl font-bold text-purple-600">$825</div>
              <div className="text-sm text-gray-600">
                {currentLanguage === 'tr' ? 'Referans Bonusu' : 'Referral Bonus'}
              </div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded">
              <div className="text-xl font-bold text-orange-600">$500</div>
              <div className="text-sm text-gray-600">
                {currentLanguage === 'tr' ? 'Performans Bonusu' : 'Performance Bonus'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantDashboard;