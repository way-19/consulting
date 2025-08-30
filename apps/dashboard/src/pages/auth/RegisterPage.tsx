import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Globe } from 'lucide-react';
import { useAuth } from '@consulting19/shared';
import { Card, Button } from '@consulting19/ui';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    role: 'client',
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const countries = [
    'United States', 'United Kingdom', 'Germany', 'France', 'Italy', 'Spain',
    'Canada', 'Australia', 'Singapore', 'UAE', 'Estonia', 'Malta', 'Georgia',
    'Portugal', 'Netherlands', 'Switzerland', 'Panama', 'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      setLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setError('Kullanım şartlarını kabul etmelisiniz');
      setLoading(false);
      return;
    }

    const { error } = await signUp(formData.email, formData.password, {
      full_name: formData.fullName,
      role: formData.role,
      country: formData.country,
    });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate(`/${formData.role}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <a href="https://consulting19.com" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">C19</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Consulting19</span>
          </a>
          <h2 className="text-3xl font-bold text-gray-900">Hesap Oluşturun</h2>
          <p className="mt-2 text-gray-600">Küresel iş genişleme yolculuğunuza başlayın</p>
        </div>

        {/* Form */}
        <Card>
          <Card.Body>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Soyad
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Adınızı ve soyadınızı girin"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="E-posta adresinizi girin"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Mevcut Ülke
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Ülkenizi seçin</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Şifre oluşturun"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre Onayı
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Şifrenizi onaylayın"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    <a href="https://consulting19.com/terms" className="text-blue-600 hover:text-blue-800">
                      Kullanım Şartları
                    </a>{' '}
                    ve{' '}
                    <a href="https://consulting19.com/privacy" className="text-blue-600 hover:text-blue-800">
                      Gizlilik Politikası
                    </a>'nı kabul ediyorum
                  </span>
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg" 
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Hesap oluşturuluyor...' : 'Hesap Oluştur'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                Zaten hesabınız var mı?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                  Giriş yapın
                </Link>
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;