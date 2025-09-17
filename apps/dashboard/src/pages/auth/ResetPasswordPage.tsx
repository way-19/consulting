import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '@consulting19/shared';
import { Card, Button } from '@consulting19/ui';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await resetPassword(email);
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card>
            <Card.Body className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">E-postanızı Kontrol Edin</h2>
              <p className="text-gray-600 mb-6">
                Şifre sıfırlama talimatlarını {email} adresine gönderdik
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full" icon={ArrowLeft} iconPosition="left">
                  Giriş Sayfasına Dön
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }

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
          <h2 className="text-3xl font-bold text-gray-900">Şifre Sıfırlama</h2>
          <p className="mt-2 text-gray-600">Sıfırlama talimatları almak için e-postanızı girin</p>
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="E-posta adresinizi girin"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg" 
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Gönderiliyor...' : 'Sıfırlama Talimatlarını Gönder'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Giriş Sayfasına Dön
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;