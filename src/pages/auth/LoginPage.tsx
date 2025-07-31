// pages/auth/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const { t, currentLanguage, changeLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    
    if (result.success) {
      // Redirect based on role will be handled by the router
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  const demoLogins = [
    { email: 'admin@consulting19.com', password: 'Admin2024!', role: 'Admin' },
    { email: 'consultant@consulting19.com', password: 'Consultant2024!', role: 'Consultant' },
    { email: 'client@consulting19.com', password: 'Client2024!', role: 'Client' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Language Toggle */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-white bg-opacity-20 rounded-lg p-1">
            <button
              onClick={() => changeLanguage('tr')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentLanguage === 'tr' 
                  ? 'bg-white text-purple-600' 
                  : 'text-white hover:text-purple-200'
              }`}
            >
              TR
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentLanguage === 'en' 
                  ? 'bg-white text-purple-600' 
                  : 'text-white hover:text-purple-200'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">CONSULTING19</h1>
            <p className="text-gray-600 mt-2">
              {currentLanguage === 'tr' ? 'Hesabınıza giriş yapın' : 'Sign in to your account'}
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {currentLanguage === 'tr' ? 'E-posta' : 'Email'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {currentLanguage === 'tr' ? 'Şifre' : 'Password'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-50"
            >
              {loading 
                ? (currentLanguage === 'tr' ? 'Giriş yapılıyor...' : 'Signing in...') 
                : (currentLanguage === 'tr' ? 'Giriş Yap' : 'Sign In')
              }
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              {currentLanguage === 'tr' ? 'Demo Hesapları:' : 'Demo Accounts:'}
            </h3>
            <div className="space-y-2">
              {demoLogins.map((demo, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setEmail(demo.email);
                    setPassword(demo.password);
                  }}
                  className="block w-full text-left text-xs bg-white p-2 rounded border hover:bg-gray-50"
                >
                  <div className="font-medium">{demo.role}</div>
                  <div className="text-gray-600">{demo.email}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link 
              to="/" 
              className="text-purple-600 hover:text-purple-700 text-sm"
            >
              {currentLanguage === 'tr' ? '← Ana sayfaya dön' : '← Back to homepage'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;