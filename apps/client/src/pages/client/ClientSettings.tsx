import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  User,
  Mail,
  Phone,
  Building,
  Globe,
  Lock,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Save,
  CheckCircle,
  AlertTriangle,
  Smartphone,
  QrCode,
  Key,
  X
} from 'lucide-react';
import { useAuth } from '@consulting19/shared';
import { supabase } from '@consulting19/shared/lib/supabase';

const ClientSettings = () => {
  const { user, profile, updateProfile, enrollMfaFactor, verifyMfaFactor, unenrollMfaFactor } = useAuth();
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    display_name: '',
    phone: '',
    company: '',
    preferred_language: 'en',
    timezone: 'UTC'
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // 2FA state
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [enrolling2FA, setEnrolling2FA] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [show2FAModal, setShow2FAModal] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (profile) {
      setProfileForm({
        full_name: profile.full_name || '',
        display_name: profile.display_name || '',
        phone: profile.phone || '',
        company: profile.company || '',
        preferred_language: profile.preferred_language || 'en',
        timezone: profile.timezone || 'UTC'
      });
      
      // Check if 2FA is enabled
      checkMfaStatus();
    }
  }, [profile]);

  const checkMfaStatus = async () => {
    try {
      const { data } = await supabase.auth.mfa.listFactors();
      const hasActiveFactor = data?.totp?.some(factor => factor.status === 'verified');
      setMfaEnabled(hasActiveFactor || false);
    } catch (err) {
      console.error('Error checking MFA status:', err);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await updateProfile(profileForm);
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err: any) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError('New passwords do not match');
      setPasswordLoading(false);
      return;
    }

    if (passwordForm.new_password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      setPasswordLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.new_password
      });

      if (error) {
        setPasswordError(error.message);
      } else {
        setPasswordSuccess('Password updated successfully!');
        setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
        setTimeout(() => setPasswordSuccess(''), 3000);
      }
    } catch (err: any) {
      setPasswordError('Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    try {
      setEnrolling2FA(true);
      setError('');

      const { data, error } = await enrollMfaFactor({
        factorType: 'totp',
        friendlyName: `${profile?.full_name || user?.email}'s Authenticator`,
        issuer: 'Consulting19'
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data) {
        setQrCode(data.qr_code);
        setSecret(data.secret);
        setShow2FAModal(true);
      }
    } catch (err: any) {
      setError('Failed to start 2FA enrollment');
    } finally {
      setEnrolling2FA(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const { data, error } = await verifyMfaFactor({
        factorId: secret,
        challengeId: secret,
        code: verificationCode
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data) {
        setMfaEnabled(true);
        setShow2FAModal(false);
        setVerificationCode('');
        setQrCode('');
        setSecret('');
        setSuccess('Two-factor authentication enabled successfully!');
        setTimeout(() => setSuccess(''), 3000);
        
        // Create audit log
        await supabase
          .from('audit_logs')
          .insert({
            user_id: user?.id,
            action_type: '2fa_enabled',
            description: 'Two-factor authentication enabled',
            payload: { method: 'totp' }
          });
      }
    } catch (err: any) {
      setError('Failed to verify 2FA code');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      const { error } = await unenrollMfaFactor();

      if (error) {
        setError(error.message);
        return;
      }

      setMfaEnabled(false);
      setSuccess('Two-factor authentication disabled');
      setTimeout(() => setSuccess(''), 3000);

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: '2fa_disabled',
          description: 'Two-factor authentication disabled',
          payload: {}
        });
    } catch (err: any) {
      setError('Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !profile) {
    return (
      <>
        <Helmet>
          <title>Settings - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </>
    );
  }

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

        {/* Global Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {success}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Account Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2 text-gray-600" />
              Account Information
            </h2>
          </div>
          
          <form onSubmit={handleProfileUpdate} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  placeholder="How should we address you?"
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
                  Preferred Language
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={profileForm.preferred_language}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, preferred_language: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="en">🇺🇸 English</option>
                    <option value="tr">🇹🇷 Türkçe</option>
                    <option value="pt">🇵🇹 Português</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  value={profileForm.timezone}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, timezone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">EST (New York)</option>
                  <option value="Europe/London">GMT (London)</option>
                  <option value="Europe/Berlin">CET (Berlin)</option>
                  <option value="Europe/Istanbul">TRT (Istanbul)</option>
                  <option value="Asia/Dubai">GST (Dubai)</option>
                </select>
              </div>
            </div>

            <div className="border-t pt-6">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Password Change */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-gray-600" />
              Change Password
            </h2>
          </div>
          
          <form onSubmit={handlePasswordChange} className="p-6 space-y-6">
            {passwordError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                {passwordError}
              </div>
            )}
            
            {passwordSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                {passwordSuccess}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordForm.current_password}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, current_password: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, new_password: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordForm.confirm_password}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm_password: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="border-t pt-6">
              <button
                type="submit"
                disabled={passwordLoading}
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {passwordLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Lock className="w-4 h-4 mr-2" />
                )}
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-gray-600" />
              Two-Factor Authentication
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Add an extra layer of security to your account
            </p>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  mfaEnabled ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Smartphone className={`w-6 h-6 ${
                    mfaEnabled ? 'text-green-600' : 'text-gray-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Authenticator App
                  </h3>
                  <p className="text-sm text-gray-600">
                    Use an authenticator app to generate verification codes
                  </p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      mfaEnabled 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {mfaEnabled ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Enabled
                        </>
                      ) : (
                        'Disabled'
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {!mfaEnabled ? (
                  <button
                    onClick={handleEnable2FA}
                    disabled={enrolling2FA}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {enrolling2FA ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Shield className="w-4 h-4 mr-2" />
                    )}
                    {enrolling2FA ? 'Setting up...' : 'Enable 2FA'}
                  </button>
                ) : (
                  <button
                    onClick={handleDisable2FA}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <X className="w-4 h-4 mr-2" />
                    )}
                    {loading ? 'Disabling...' : 'Disable 2FA'}
                  </button>
                )}
              </div>
            </div>

            {/* 2FA Information */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                🔐 Enhanced Account Security
              </h4>
              <p className="text-xs text-blue-800">
                Two-factor authentication adds an extra layer of security by requiring both your password 
                and a verification code from your mobile device to access your account.
              </p>
              {!mfaEnabled && (
                <p className="text-xs text-blue-700 mt-2">
                  <strong>Recommended:</strong> Enable 2FA to protect your business data and financial information.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Account Security Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Email Address</span>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">Verified</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Password</span>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">Strong</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Two-Factor Authentication</span>
              <div className="flex items-center space-x-2">
                {mfaEnabled ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Enabled</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-yellow-600 font-medium">Disabled</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2FA Setup Modal */}
        {show2FAModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                Enable Two-Factor Authentication
              </h2>
              
              <div className="space-y-6">
                {/* Step 1: QR Code */}
                <div className="text-center">
                  <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {qrCode ? (
                      <img 
                        src={qrCode} 
                        alt="QR Code" 
                        className="w-40 h-40"
                      />
                    ) : (
                      <div className="text-center">
                        <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">QR Code Loading...</p>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                  </p>
                </div>

                {/* Step 2: Verification */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter the 6-digit code from your app
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
                      placeholder="123456"
                      maxLength={6}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Enter the 6-digit code displayed in your authenticator app
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShow2FAModal(false);
                      setQrCode('');
                      setSecret('');
                      setVerificationCode('');
                      setError('');
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleVerify2FA}
                    disabled={loading || verificationCode.length !== 6}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
                    ) : (
                      'Verify & Enable'
                    )}
                  </button>
                </div>

                {/* Help Text */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">📱 Recommended Apps:</h4>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Google Authenticator (iOS/Android)</li>
                    <li>• Authy (iOS/Android/Desktop)</li>
                    <li>• Microsoft Authenticator</li>
                    <li>• 1Password (Premium)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientSettings;