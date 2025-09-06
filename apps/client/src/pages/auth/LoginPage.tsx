import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react';
import { useAuth } from '@consulting19/shared';

const LoginPage = () => {
  const [email, setEmail] = useState('client@consulting19.com');
  const [password, setPassword] = useState('Client123!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mfaCode, setMfaCode] = useState('');

  const { signIn, verifyMfaCode, mfaChallenge } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signIn(email, password);
    setLoading(false);
    
    if (error) {
      if (error.message === 'mfa_required') {
        // MFA challenge will be handled by the form below
        return;
      }
      setError(error.message);
    } else {
      navigate('/');
    }
  };

  const handleMfaVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await verifyMfaCode(mfaChallenge?.challengeId || '', mfaCode);
    setLoading(false);
    
    if (error) {
      setError(error.message);
    } else {
      navigate('/');
    }
  };

  // Show MFA form if challenge is active
  if (mfaChallenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C19</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Client Portal</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Two-Factor Authentication</h2>
            <p className="mt-2 text-gray-600">Enter the code from your authenticator app</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleMfaVerification} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="mfaCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Authentication Code
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="mfaCode"
                    type="text"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || mfaCode.length !== 6}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : null}
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">C19</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Client Portal</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Sign in to your client dashboard</p>
          
          {/* Test Credentials */}
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
              🔑 Test Accounts (Demo)
            </h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <div className="text-xs font-semibold text-red-700 mb-1">👑 Admin Panel</div>
                <div className="text-xs text-blue-800">
                  <div><strong>Email:</strong> admin@consulting19.com</div>
                  <div><strong>Password:</strong> Admin123!</div>
                  <div className="text-gray-600 mt-1">• System management • All data • Settings</div>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-green-100">
                <div className="text-xs font-semibold text-green-700 mb-1">💼 Consultant Dashboard</div>
                <div className="text-xs text-blue-800">
                  <div><strong>Email:</strong> giorgi.meskhi@consulting19.com</div>
                  <div><strong>Password:</strong> Consultant123!</div>
                  <div className="text-gray-600 mt-1">• Client management • Projects • Documents</div>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-purple-100">
                <div className="text-xs font-semibold text-purple-700 mb-1">👤 Client Dashboard</div>
                <div className="text-xs text-blue-800">
                  <div><strong>Email:</strong> client@consulting19.com</div>
                  <div><strong>Password:</strong> Client123!</div>
                  <div className="text-gray-600 mt-1">• My projects • Documents • Messages</div>
                </div>
              </div>
            </div>
            
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
              💡 <strong>Tip:</strong> After login, you'll be redirected based on your role
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleLogin} className="space-y-6">
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

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;