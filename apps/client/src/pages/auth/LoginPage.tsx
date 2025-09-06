import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth, Button, Card } from '@consulting19/shared';

const LoginPage = () => {
  const [email, setEmail] = useState('client@consulting19.com');
  const [password, setPassword] = useState('Client123!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const { signIn, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setError('');

    try {
      const { error } = await resetPassword(resetEmail);
      
      if (error) {
        setError(error.message);
      } else {
        setResetSuccess(true);
      }
    } catch (err) {
      setError('Failed to send reset email');
    } finally {
      setResetLoading(false);
    }
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
            <span className="text-2xl font-bold text-gray-900">Client Portal</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Access your business dashboard</p>
          
          {/* Test Credentials - Enhanced */}
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
              🔑 Test Accounts (Demo)
            </h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-lg border border-purple-100">
                <div className="text-xs font-semibold text-purple-700 mb-1">👤 Client Dashboard</div>
                <div className="text-xs text-blue-800">
                  <div><strong>Email:</strong> client@consulting19.com</div>
                  <div><strong>Password:</strong> Client123!</div>
                  <div className="text-gray-600 mt-1">• My projects • Documents • Messages</div>
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
              
              <div className="bg-white p-3 rounded-lg border border-red-100">
                <div className="text-xs font-semibold text-red-700 mb-1">👑 Admin Panel</div>
                <div className="text-xs text-blue-800">
                  <div><strong>Email:</strong> admin@consulting19.com</div>
                  <div><strong>Password:</strong> Admin123!</div>
                  <div className="text-gray-600 mt-1">• System management • All data • Settings</div>
                </div>
              </div>
            </div>
            
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
              💡 <strong>Tip:</strong> After login, you'll be redirected based on your role
            </div>
          </div>
        </div>

        {/* Form */}
        {!showForgotPassword ? (
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

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setError('');
                      setResetEmail(email);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Forgot your password?
                  </button>
                </div>
              </form>
            </Card.Body>
          </Card>
        ) : (
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">Reset Your Password</h3>
              <p className="text-sm text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
            </Card.Header>
            <Card.Body>
              {resetSuccess ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-900 mb-2">Check Your Email</h3>
                    <p className="text-sm text-green-700 mb-4">
                      We've sent a password reset link to <strong>{resetEmail}</strong>
                    </p>
                    <p className="text-xs text-gray-600">
                      If you don't see the email, check your spam folder or try again.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetSuccess(false);
                      setResetEmail('');
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    ← Back to login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="reset-email"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg" 
                    loading={resetLoading}
                    disabled={resetLoading}
                  >
                    {resetLoading ? 'Sending reset link...' : 'Send Reset Link'}
                  </Button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setError('');
                      setResetEmail('');
                    }}
                    className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    ← Back to login
                  </button>
                </form>
              )}
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LoginPage;