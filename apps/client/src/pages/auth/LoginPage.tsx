import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Shield, ArrowLeft } from 'lucide-react';
import { useAuth, Button, Card } from '@consulting19/shared';

const LoginPage = () => {
  const [email, setEmail] = useState('client@consulting19.com');
  const [password, setPassword] = useState('Client123!');
  const [mfaCode, setMfaCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'login' | 'mfa'>('login');

  const { signIn, verifyMfaCode, mfaChallenge } = useAuth();
  const navigate = useNavigate();

  // Check if MFA challenge is active
  useEffect(() => {
    if (mfaChallenge) {
      setStep('mfa');
    } else {
      setStep('login');
    }
  }, [mfaChallenge]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signIn(email, password);
    
    if (error) {
      if (error.message === 'mfa_required') {
        // MFA is required, UI will switch to MFA step automatically via useEffect
        setError('');
      } else {
        setError(error.message);
      }
      setLoading(false);
    } else {
      // Successful login without MFA
      navigate('/');
    }
  };

  const handleMfaVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mfaChallenge) {
      setError('No MFA challenge active');
      return;
    }

    setLoading(true);
    setError('');

    const { error } = await verifyMfaCode(mfaChallenge.challengeId, mfaCode);
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // MFA verification successful, user will be redirected via auth state change
      navigate('/');
    }
  };

  const resetToLogin = () => {
    setStep('login');
    setMfaCode('');
    setError('');
    // Note: Don't clear mfaChallenge here, let AuthContext handle it
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
          
          {step === 'login' ? (
            <>
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
              <p className="mt-2 text-gray-600">Sign in to your client dashboard</p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-900">Two-Factor Authentication</h2>
              <p className="mt-2 text-gray-600">Enter the code from your authenticator app</p>
            </>
          )}
          
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

        {/* Login Form */}
        {step === 'login' && (
          <Card>
            <Card.Body>
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
            </Card.Body>
          </Card>
        )}

        {/* MFA Verification Form */}
        {step === 'mfa' && (
          <Card>
            <Card.Body>
              <form onSubmit={handleMfaVerification} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-gray-600">
                    Enter the 6-digit code from your authenticator app
                  </p>
                </div>

                <div>
                  <label htmlFor="mfa-code" className="block text-sm font-medium text-gray-700 mb-2">
                    Authentication Code
                  </label>
                  <input
                    id="mfa-code"
                    type="text"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    className="w-full px-4 py-3 text-center text-lg font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    autoComplete="one-time-code"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Open your authenticator app and enter the 6-digit code
                  </p>
                </div>

                <div className="space-y-3">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg" 
                    loading={loading}
                    disabled={loading || mfaCode.length !== 6}
                  >
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </Button>

                  <button
                    type="button"
                    onClick={resetToLogin}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </button>
                </div>
              </form>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LoginPage;