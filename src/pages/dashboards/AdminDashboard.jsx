// pages/dashboards/AdminDashboard.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
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
              <h1 className="text-xl font-bold text-red-600">Admin Panel</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => changeLanguage('tr')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    currentLanguage === 'tr' 
                      ? 'bg-red-600 text-white' 
                      : 'text-gray-600 hover:text-red-600'
                  }`}
                >
                  TR
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    currentLanguage === 'en' 
                      ? 'bg-red-600 text-white' 
                      : 'text-gray-600 hover:text-red-600'
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
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
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
            {currentLanguage === 'tr' ? 'Yönetici Paneli' : 'Admin Dashboard'}
          </h2>
          <p className="text-gray-600 mt-2">
            {currentLanguage === 'tr' 
              ? 'CONSULTING19.COM sisteminin tam kontrolü' 
              : 'Complete control of CONSULTING19.COM system'
            }
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-2xl font-bold text-blue-600 mb-2">1,247</div>
            <div className="text-sm text-gray-600">
              {currentLanguage === 'tr' ? 'Aktif Danışmanlık' : 'Active Consultations'}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-2xl font-bold text-green-600 mb-2">7</div>
            <div className="text-sm text-gray-600">
              {currentLanguage === 'tr' ? 'Stratejik Ülke' : 'Strategic Countries'}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-2xl font-bold text-purple-600 mb-2">98%</div>
            <div className="text-sm text-gray-600">
              {currentLanguage === 'tr' ? 'Başarı Oranı' : 'Success Rate'}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-2xl font-bold text-orange-600 mb-2">47min</div>
            <div className="text-sm text-gray-600">
              {currentLanguage === 'tr' ? 'Ort. Yanıt Süresi' : 'Avg Response Time'}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold mb-4">
              {currentLanguage === 'tr' ? 'Danışman Yönetimi' : 'Consultant Management'}
            </h3>
            <p className="text-gray-600 mb-4">
              {currentLanguage === 'tr' 
                ? 'Danışmanları yönet ve performanslarını takip et' 
                : 'Manage consultants and track their performance'
              }
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              {currentLanguage === 'tr' ? 'Yönet' : 'Manage'}
            </button>
          </div>

          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold mb-4">
              {currentLanguage === 'tr' ? 'Gelir Takibi' : 'Revenue Tracking'}
            </h3>
            <p className="text-gray-600 mb-4">
              {currentLanguage === 'tr' 
                ? 'Tüm gelir kaynaklarını ve komisyonları takip et' 
                : 'Track all revenue sources and commissions'
              }
            </p>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              {currentLanguage === 'tr' ? 'Görüntüle' : 'View'}
            </button>
          </div>

          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold mb-4">
              {currentLanguage === 'tr' ? 'AI Güvenlik' : 'AI Safety'}
            </h3>
            <p className="text-gray-600 mb-4">
              {currentLanguage === 'tr' 
                ? 'AI etkileşimlerini izle ve güvenlik kontrolleri' 
                : 'Monitor AI interactions and safety controls'
              }
            </p>
            <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
              {currentLanguage === 'tr' ? 'Kontrol Et' : 'Monitor'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;