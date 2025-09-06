import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth, Button, Card, MfaVerification } from '@consulting19/shared';

const LoginPage = () => {
  const [email, setEmail] = useState('giorgi.meskhi@consulting19.com');
  const [password, setPassword] = useState('Consultant123!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMfaVerification, setShowMfaVerification] = useState(false);

  const { signIn, mfaChallenge } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error, requiresMfa } = await signIn(email, password);
    
    if (error) {
      if (error.message === 'mfa_required' || requiresMfa) {
        setShowMfaVerification(true);
      } else {
        setError(error.message);
      }
      setLoading(false);
    } else if (requiresMfa) {
      setShowMfaVerification(true);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  const handleDemoLogin = () => {
    // Demo login - bypass 2FA for demonstration
    setLoading(true);
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  const handleMfaSuccess = () => {
    setShowMfaVerification(false);
    navigate('/');
  };

  const handleMfaCancel = () => {
    setShowMfaVerification(false);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">C19</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Consultant Panel</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Consultant Login</h2>
          <p className="mt-2 text-gray-600">Access your consultant dashboard</p>
          
          {/* Test Credentials */}
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-3">🔑 Test Account (Demo)</h3>
            <div className="text-xs text-blue-800">
              <div><strong>Email:</strong> giorgi.meskhi@consulting19.com</div>
              <div><strong>Password:</strong> Consultant123!</div>
            </div>
          </div>
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
                  Email Address
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
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
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

              <Button 
                type="submit" 
                className="w-full" 
                size="lg" 
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            
            {/* Demo Login Button */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleDemoLogin}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Demo Login (Skip 2FA)
              </button>
            </div>
          </Card.Body>
        </Card>
        
        {/* MFA Verification Modal */}
        <MfaVerification
          isOpen={showMfaVerification}
          onSuccess={handleMfaSuccess}
          onCancel={handleMfaCancel}
        />
      </div>
    </div>
  );
};

export default LoginPage;