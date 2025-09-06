import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Save, 
  Eye, 
  EyeOff,
  Phone,
  Building,
  Globe,
  Mail,
  QrCode,
  Smartphone,
  Key,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@consulting19/shared';

const ClientSettings = () => {
  const { 
    user, 
    profile, 
    updateProfile, 
    changePassword,
    enrollMfaFactor,
    verifyMfaFactor,
    unenrollMfaFactor,
    getMfaFactors
  } = useAuth();

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    display_name: '',
    phone: '',
    company: '',
    timezone: 'UTC'
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  // 2FA state
  const [mfaFactors, setMfaFactors] = useState<any[]>([]);
  const [enrolling2FA, setEnrolling2FA] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [factorId, setFactorId] = useState('');
  const [mfaLoading, setMfaLoading] = useState(false);

  // General state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (profile) {
      setProfileForm({
        full_name: profile.full_name || '',
        display_name: profile.display_name || '',
        phone: profile.phone || '',
        company: profile.company || '',
        timezone: profile.timezone || 'UTC'
      });
    }
    
    // Load existing MFA factors
    loadMfaFactors();
  }, [profile]);

  const loadMfaFactors = async () => {
    try {
      const { factors, error } = await getMfaFactors();
      if (error) {
        console.error('Error loading MFA factors:', error);
      } else {
        setMfaFactors(factors || []);
      }
    } catch (err) {
      console.error('Error loading MFA factors:', err);
    }
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await updateProfile(profileForm);
      
      if (error) {
        showMessage('Failed to update profile: ' + error.message, 'error');
      } else {
        showMessage('Profile updated successfully!', 'success');
      }
    } catch (err) {
      showMessage('An unexpected error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('Passwords do not match', 'error');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showMessage('Password must be at least 6 characters long', 'error');
      return;
    }

    setLoading(true);

    try {
      const { error } = await changePassword(passwordForm.newPassword);
      
      if (error) {
        showMessage('Failed to change password: ' + error.message, 'error');
      } else {
        showMessage('Password changed successfully!', 'success');
        setPasswordForm({ newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      showMessage('An unexpected error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll2FA = async () => {
    try {
      setMfaLoading(true);
      
      const { factor, qrCode, secret, error } = await enrollMfaFactor('totp');
      
      if (error) {
        showMessage('Failed to enroll 2FA: ' + error.message, 'error');
        return;
      }

      setFactorId(factor.id);
      setQrCode(qrCode);
      setSecretKey(secret);
      setEnrolling2FA(true);
      showMessage('Scan the QR code with your authenticator app', 'success');
    } catch (err) {
      showMessage('Failed to start 2FA enrollment', 'error');
    } finally {
      setMfaLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!verificationCode || !factorId) {
      showMessage('Please enter the 6-digit code from your authenticator app', 'error');
      return;
    }

    try {
      setMfaLoading(true);
      
      const { error } = await verifyMfaFactor(factorId, verificationCode);
      
      if (error) {
        showMessage('Invalid verification code. Please try again.', 'error');
        return;
      }

      showMessage('2FA enabled successfully! Your account is now more secure.', 'success');
      setEnrolling2FA(false);
      setVerificationCode('');
      setQrCode('');
      setSecretKey('');
      setFactorId('');
      
      // Reload MFA factors
      await loadMfaFactors();
    } catch (err) {
      showMessage('Failed to verify 2FA code', 'error');
    } finally {
      setMfaLoading(false);
    }
  };

  const handleDisable2FA = async (factorId: string) => {
    if (!confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
      return;
    }

    try {
      setMfaLoading(true);
      
      const { error } = await unenrollMfaFactor(factorId);
      
      if (error) {
        showMessage('Failed to disable 2FA: ' + error.message, 'error');
        return;
      }

      showMessage('2FA disabled successfully.', 'success');
      await loadMfaFactors();
    } catch (err) {
      showMessage('Failed to disable 2FA', 'error');
    } finally {
      setMfaLoading(false);
    }
  };

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Berlin',
    'Europe/Istanbul',
    'Asia/Dubai',
    'Asia/Singapore',
    'Asia/Tokyo',
    'Australia/Sydney'
  ];

  const has2FAEnabled = mfaFactors.length > 0;

  return (
    <>
      <Helmet>
        <title>Settings - Client Portal</title>
      </Helmet>
      
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-1">Manage your profile, security, and preferences</p>
        </div>

        {/* Messages */}
        {message && (
          <div className={`p-4 rounded-lg border ${
            messageType === 'success' 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-red-50 border-red-200 text-red-700'
          } flex items-center`}>
            {messageType === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertTriangle className="w-5 h-5 mr-2" />
            )}
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, full_name: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={profileForm.display_name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, display_name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="How you'd like to be addressed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={profileForm.company}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your company name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={profileForm.timezone}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {timezones.map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </div>

          {/* Security Settings */}
          <div className="space-y-6">
            {/* Password Change */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter new password"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !passwordForm.newPassword || !passwordForm.confirmPassword}
                  className="w-full flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Lock className="w-4 h-4 mr-2" />
                  )}
                  {loading ? 'Updating...' : 'Change Password'}
                </button>
              </form>
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Two-Factor Authentication</h2>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${has2FAEnabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Status: {has2FAEnabled ? 'Enabled' : 'Disabled'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {has2FAEnabled 
                          ? 'Your account is protected with 2FA' 
                          : 'Add an extra layer of security to your account'
                        }
                      </p>
                    </div>
                  </div>
                  {has2FAEnabled && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                      Secure
                    </span>
                  )}
                </div>
              </div>

              {!has2FAEnabled && !enrolling2FA && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">🔒 Enhanced Security</h4>
                    <p className="text-xs text-blue-800 mb-3">
                      Two-factor authentication adds an extra layer of security by requiring both your password 
                      and a code from your phone to sign in.
                    </p>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Use apps like Google Authenticator, Authy, or Microsoft Authenticator</li>
                      <li>• Works even without internet connection</li>
                      <li>• Protects against password theft and phishing</li>
                    </ul>
                  </div>
                  
                  <button
                    onClick={handleEnroll2FA}
                    disabled={mfaLoading}
                    className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {mfaLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Smartphone className="w-4 h-4 mr-2" />
                    )}
                    {mfaLoading ? 'Setting up...' : 'Enable Two-Factor Authentication'}
                  </button>
                </div>
              )}

              {enrolling2FA && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Set Up Your Authenticator</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Scan this QR code with your authenticator app or enter the secret manually
                    </p>

                    {/* QR Code */}
                    {qrCode && (
                      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6 inline-block">
                        <img src={qrCode} alt="2FA QR Code" className="w-48 h-48 mx-auto" />
                      </div>
                    )}

                    {/* Secret Key */}
                    {secretKey && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center space-x-2 mb-2">
                          <Key className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Manual Entry Secret:</span>
                        </div>
                        <code className="text-sm font-mono text-gray-900 bg-white px-2 py-1 rounded border">
                          {secretKey}
                        </code>
                        <p className="text-xs text-gray-600 mt-2">
                          Use this if you can't scan the QR code
                        </p>
                      </div>
                    )}

                    {/* Verification */}
                    <div className="max-w-xs mx-auto">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter the 6-digit code from your app
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-3 text-center text-lg font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="000000"
                      />
                      
                      <div className="flex space-x-3 mt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setEnrolling2FA(false);
                            setQrCode('');
                            setSecretKey('');
                            setVerificationCode('');
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleVerify2FA}
                          disabled={verificationCode.length !== 6 || mfaLoading}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          {mfaLoading ? 'Verifying...' : 'Verify & Enable'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {has2FAEnabled && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h4 className="text-sm font-semibold text-green-900">2FA is Active</h4>
                    </div>
                    <p className="text-xs text-green-800">
                      Your account is protected with two-factor authentication. You'll need to enter a code 
                      from your authenticator app when signing in.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {mfaFactors.map((factor) => (
                      <div key={factor.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="w-5 h-5 text-gray-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {factor.friendly_name || 'Authenticator App'}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Added {new Date(factor.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDisable2FA(factor.id)}
                          disabled={mfaLoading}
                          className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
                        >
                          Disable
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account ID</label>
              <p className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded">
                {user?.id?.substring(0, 8)}...
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
              <p className="text-sm text-gray-900">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {profile?.role || 'Client'}
              </span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Security Level</label>
              <div className="flex items-center space-x-2">
                <Shield className={`w-4 h-4 ${has2FAEnabled ? 'text-green-600' : 'text-orange-600'}`} />
                <span className={`text-sm font-medium ${has2FAEnabled ? 'text-green-600' : 'text-orange-600'}`}>
                  {has2FAEnabled ? 'High (2FA Enabled)' : 'Standard (2FA Disabled)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientSettings;