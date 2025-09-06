import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Globe,
  Shield,
  Lock,
  Save,
  Eye,
  EyeOff,
  QrCode,
  Smartphone,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

const ClientSettings = () => {
  const { user, profile } = useAuth();
  
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
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // 2FA state
  const [mfaFactors, setMfaFactors] = useState<any[]>([]);
  const [showEnroll2FA, setShowEnroll2FA] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [pendingFactorId, setPendingFactorId] = useState('');
  
  // UI states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [enrolling2FA, setEnrolling2FA] = useState(false);
  const [verifying2FA, setVerifying2FA] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessages, setSuccessMessages] = useState<Record<string, string>>({});

  const { enrollMfaFactor, verifyMfaFactor, unenrollMfaFactor, getMfaFactors } = useAuth();

  useEffect(() => {
    if (profile) {
      setProfileForm({
        full_name: profile.full_name || '',
        display_name: profile.display_name || '',
        phone: profile.phone || '',
        company: profile.company || '',
        timezone: profile.timezone || 'UTC'
      });
      
      loadMfaFactors();
    }
  }, [profile]);

  const loadMfaFactors = async () => {
    const { data, error } = await getMfaFactors();
    if (error) {
      console.error('Error loading MFA factors:', error);
    } else {
      setMfaFactors(data || []);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors(prev => ({ ...prev, profile: '' }));
    setSuccessMessages(prev => ({ ...prev, profile: '' }));

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: profileForm.full_name,
          display_name: profileForm.display_name,
          phone: profileForm.phone,
          company: profileForm.company,
          timezone: profileForm.timezone
        })
        .eq('id', user?.id);

      if (error) {
        throw error;
      }

      setSuccessMessages(prev => ({ ...prev, profile: 'Profile updated successfully!' }));
      setTimeout(() => setSuccessMessages(prev => ({ ...prev, profile: '' })), 3000);
    } catch (err: any) {
      setErrors(prev => ({ ...prev, profile: err.message }));
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrors(prev => ({ ...prev, password: 'Passwords do not match' }));
      return;
    }

    setSaving(true);
    setErrors(prev => ({ ...prev, password: '' }));
    setSuccessMessages(prev => ({ ...prev, password: '' }));

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) {
        throw error;
      }

      setSuccessMessages(prev => ({ ...prev, password: 'Password updated successfully!' }));
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccessMessages(prev => ({ ...prev, password: '' })), 3000);
    } catch (err: any) {
      setErrors(prev => ({ ...prev, password: err.message }));
    } finally {
      setSaving(false);
    }
  };

  const handleEnable2FA = async () => {
    setEnrolling2FA(true);
    setErrors(prev => ({ ...prev, mfa: '' }));

    try {
      const { error, factorId, qrCode, secret } = await enrollMfaFactor();
      
      if (error) {
        throw error;
      }

      if (factorId && qrCode && secret) {
        setPendingFactorId(factorId);
        setQrCode(qrCode);
        setSecret(secret);
        setShowEnroll2FA(true);
      }
    } catch (err: any) {
      setErrors(prev => ({ ...prev, mfa: err.message }));
    } finally {
      setEnrolling2FA(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!pendingFactorId || !verificationCode) {
      setErrors(prev => ({ ...prev, mfa: 'Please enter verification code' }));
      return;
    }

    setVerifying2FA(true);
    setErrors(prev => ({ ...prev, mfa: '' }));

    try {
      const { error } = await verifyMfaFactor(pendingFactorId, verificationCode);
      
      if (error) {
        throw error;
      }

      setSuccessMessages(prev => ({ ...prev, mfa: '2FA enabled successfully!' }));
      setShowEnroll2FA(false);
      setVerificationCode('');
      setPendingFactorId('');
      setQrCode('');
      setSecret('');
      
      await loadMfaFactors();
      setTimeout(() => setSuccessMessages(prev => ({ ...prev, mfa: '' })), 3000);
    } catch (err: any) {
      setErrors(prev => ({ ...prev, mfa: err.message }));
    } finally {
      setVerifying2FA(false);
    }
  };

  const handleDisable2FA = async (factorId: string) => {
    if (!confirm('Are you sure you want to disable 2FA? This will make your account less secure.')) {
      return;
    }

    setSaving(true);
    setErrors(prev => ({ ...prev, mfa: '' }));

    try {
      const { error } = await unenrollMfaFactor(factorId);
      
      if (error) {
        throw error;
      }

      setSuccessMessages(prev => ({ ...prev, mfa: '2FA disabled successfully!' }));
      await loadMfaFactors();
      setTimeout(() => setSuccessMessages(prev => ({ ...prev, mfa: '' })), 3000);
    } catch (err: any) {
      setErrors(prev => ({ ...prev, mfa: err.message }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Settings - Client Portal</title>
      </Helmet>
      
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences and security settings</p>
        </div>

        {/* Profile Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Profile Information
          </h2>
          
          {errors.profile && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              {errors.profile}
            </div>
          )}
          
          {successMessages.profile && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              {successMessages.profile}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, full_name: e.target.value }))}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your full name"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="How you'd like to be addressed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={profileForm.company}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your company name"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>

        {/* Password Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            Change Password
          </h2>
          
          {errors.password && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              {errors.password}
            </div>
          )}
          
          {successMessages.password && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              {successMessages.password}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  required
                  className="w-full pl-9 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Two-Factor Authentication
          </h2>
          
          {errors.mfa && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              {errors.mfa}
            </div>
          )}
          
          {successMessages.mfa && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              {successMessages.mfa}
            </div>
          )}

          {mfaFactors.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">2FA is enabled</p>
                    <p className="text-sm text-green-700">Your account is protected with 2FA</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDisable2FA(mfaFactors[0].id)}
                  disabled={saving}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                  Disable 2FA
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Secure Your Account</h3>
                <p className="text-sm text-blue-800 mb-4">
                  Add an extra layer of security to your account with two-factor authentication.
                  You'll need an authenticator app like Google Authenticator or Authy.
                </p>
                <button
                  onClick={handleEnable2FA}
                  disabled={enrolling2FA}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {enrolling2FA ? 'Setting up...' : 'Enable 2FA'}
                </button>
              </div>
            </div>
          )}

          {/* 2FA Setup Modal */}
          {showEnroll2FA && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Setup Two-Factor Authentication</h3>
                
                <div className="space-y-6">
                  {/* QR Code */}
                  <div className="text-center">
                    <div className="mb-4">
                      <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Scan this QR code with your authenticator app:
                      </p>
                    </div>
                    
                    {qrCode && (
                      <div 
                        className="mx-auto mb-4 border border-gray-300 rounded-lg p-4 bg-gray-50"
                        dangerouslySetInnerHTML={{ __html: qrCode }}
                      />
                    )}
                    
                    <div className="text-xs text-gray-500 mb-4">
                      <p className="font-medium">Manual entry:</p>
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all">
                        {secret}
                      </code>
                    </div>
                  </div>

                  {/* Verification Code Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter verification code
                    </label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-2 text-center text-lg font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent tracking-widest"
                      placeholder="000000"
                      maxLength={6}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Enter the 6-digit code from your authenticator app
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEnroll2FA(false);
                        setVerificationCode('');
                        setPendingFactorId('');
                        setQrCode('');
                        setSecret('');
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleVerify2FA}
                      disabled={verifying2FA || verificationCode.length !== 6}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      {verifying2FA ? 'Verifying...' : 'Verify & Enable'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Information</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Account Type</p>
                <p className="text-sm text-gray-600">Client Account</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Member Since</p>
                <p className="text-sm text-gray-600">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientSettings;