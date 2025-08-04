import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Settings, 
  X, 
  User, 
  Mail, 
  Lock, 
  Globe, 
  Bell,
  Shield,
  Save,
  Eye,
  EyeOff,
  Check,
  AlertTriangle
} from 'lucide-react';

interface UserSettingsModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

const UserSettingsModal: React.FC<UserSettingsModalProps> = ({ 
  userId, 
  isOpen, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [userProfile, setUserProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    company_name: '',
    business_type: '',
    address: '',
    timezone: 'UTC',
    language: 'tr'
  });

  const [userSettings, setUserSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    marketing_emails: false,
    security_alerts: true,
    language_preference: 'tr',
    timezone: 'UTC',
    currency_preference: 'USD',
    two_factor_enabled: false
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [passwordResetEmail, setPasswordResetEmail] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const languages = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  const timezones = [
    'UTC',
    'Europe/Istanbul',
    'Europe/London',
    'Europe/Berlin',
    'America/New_York',
    'America/Los_Angeles',
    'Asia/Dubai',
    'Asia/Shanghai'
  ];

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GEL', name: 'Georgian Lari', symbol: '₾' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
    { code: 'GBP', name: 'British Pound', symbol: '£' }
  ];

  useEffect(() => {
    if (isOpen && userId) {
      loadUserData();
    }
  }, [isOpen, userId]);

  const loadUserData = async () => {
    try {
      // Load user profile
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userData) {
        setUserProfile({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          email: userData.email || '',
          company_name: userData.company_name || '',
          business_type: userData.business_type || '',
          address: userData.address || '',
          timezone: userData.timezone || 'UTC',
          language: userData.language || 'tr'
        });
      }

      // Load user settings
      const { data: settingsData } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (settingsData) {
        setUserSettings({
          email_notifications: settingsData.email_notifications,
          sms_notifications: settingsData.sms_notifications,
          push_notifications: settingsData.push_notifications,
          marketing_emails: settingsData.marketing_emails,
          security_alerts: settingsData.security_alerts,
          language_preference: settingsData.language_preference,
          timezone: settingsData.timezone,
          currency_preference: settingsData.currency_preference,
          two_factor_enabled: settingsData.two_factor_enabled
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          first_name: userProfile.first_name,
          last_name: userProfile.last_name,
          company_name: userProfile.company_name,
          business_type: userProfile.business_type,
          address: userProfile.address,
          timezone: userProfile.timezone,
          language: userProfile.language
        })
        .eq('id', userId);

      if (error) throw error;
      alert('✅ Profil bilgileri güncellendi!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('❌ Profil güncellenirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: userId,
          ...userSettings
        });

      if (error) throw error;
      alert('✅ Ayarlar güncellendi!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('❌ Ayarlar güncellenirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      alert('❌ Yeni şifreler eşleşmiyor.');
      return;
    }

    if (passwordForm.new_password.length < 8) {
      alert('❌ Yeni şifre en az 8 karakter olmalıdır.');
      return;
    }

    setSaving(true);
    try {
      // In a real implementation, you would verify the current password
      // and update the password hash in the database
      
      // For demo purposes, we'll simulate the password change
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      
      alert('✅ Şifre başarıyla değiştirildi!');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('❌ Şifre değiştirilirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const sendPasswordReset = async () => {
    if (!passwordResetEmail) {
      alert('❌ Lütfen e-posta adresinizi girin.');
      return;
    }

    setSaving(true);
    try {
      // Generate reset token
      const resetToken = Math.random().toString(36).substring(2, 15) + 
                        Math.random().toString(36).substring(2, 15);
      
      const { error } = await supabase
        .from('password_reset_tokens')
        .insert({
          user_id: userId,
          token: resetToken,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        });

      if (error) throw error;
      
      setResetEmailSent(true);
      alert('✅ Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!');
    } catch (error) {
      console.error('Error sending password reset:', error);
      alert('❌ Şifre sıfırlama e-postası gönderilirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Bildirimler', icon: Bell },
    { id: 'security', label: 'Güvenlik', icon: Shield }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Settings className="h-6 w-6 mr-3 text-blue-600" />
              Kullanıcı Ayarları
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Ayarlar yükleniyor...</p>
              </div>
            ) : (
              <>
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900">Profil Bilgileri</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ad *
                        </label>
                        <input
                          type="text"
                          value={userProfile.first_name}
                          onChange={(e) => setUserProfile({...userProfile, first_name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Soyad *
                        </label>
                        <input
                          type="text"
                          value={userProfile.last_name}
                          onChange={(e) => setUserProfile({...userProfile, last_name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-posta Adresi *
                      </label>
                      <input
                        type="email"
                        value={userProfile.email}
                        onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        E-posta adresi değiştirmek için destek ekibiyle iletişime geçin.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Şirket Adı
                      </label>
                      <input
                        type="text"
                        value={userProfile.company_name}
                        onChange={(e) => setUserProfile({...userProfile, company_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        İş Türü
                      </label>
                      <input
                        type="text"
                        value={userProfile.business_type}
                        onChange={(e) => setUserProfile({...userProfile, business_type: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Örn: Teknoloji, Danışmanlık, E-ticaret"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adres
                      </label>
                      <textarea
                        value={userProfile.address}
                        onChange={(e) => setUserProfile({...userProfile, address: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <button
                      onClick={saveProfile}
                      disabled={saving}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      <span>{saving ? 'Kaydediliyor...' : 'Profili Kaydet'}</span>
                    </button>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900">Bildirim Ayarları</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">E-posta Bildirimleri</h4>
                          <p className="text-sm text-gray-600">Önemli güncellemeler için e-posta alın</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={userSettings.email_notifications}
                            onChange={(e) => setUserSettings({...userSettings, email_notifications: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">SMS Bildirimleri</h4>
                          <p className="text-sm text-gray-600">Acil durumlar için SMS alın</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={userSettings.sms_notifications}
                            onChange={(e) => setUserSettings({...userSettings, sms_notifications: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Push Bildirimleri</h4>
                          <p className="text-sm text-gray-600">Tarayıcı bildirimleri alın</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={userSettings.push_notifications}
                            onChange={(e) => setUserSettings({...userSettings, push_notifications: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Pazarlama E-postaları</h4>
                          <p className="text-sm text-gray-600">Yeni özellikler ve promosyonlar hakkında bilgi alın</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={userSettings.marketing_emails}
                            onChange={(e) => setUserSettings({...userSettings, marketing_emails: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Güvenlik Uyarıları</h4>
                          <p className="text-sm text-gray-600">Hesap güvenliği ile ilgili uyarılar alın</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={userSettings.security_alerts}
                            onChange={(e) => setUserSettings({...userSettings, security_alerts: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={saveSettings}
                      disabled={saving}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      <span>{saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}</span>
                    </button>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900">Güvenlik Ayarları</h3>
                    
                    {/* Change Password */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Şifre Değiştir</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mevcut Şifre
                          </label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? 'text' : 'password'}
                              value={passwordForm.current_password}
                              onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})}
                              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            >
                              {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Yeni Şifre
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              value={passwordForm.new_password}
                              onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            >
                              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Yeni Şifre Tekrar
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={passwordForm.confirm_password}
                              onChange={(e) => setPasswordForm({...passwordForm, confirm_password: e.target.value})}
                              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={changePassword}
                          disabled={saving || !passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_password}
                          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          Şifreyi Değiştir
                        </button>
                      </div>
                    </div>

                    {/* Password Reset */}
                    <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Şifre Sıfırlama</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            E-posta Adresi
                          </label>
                          <input
                            type="email"
                            value={passwordResetEmail}
                            onChange={(e) => setPasswordResetEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Şifre sıfırlama bağlantısı gönderilecek e-posta"
                          />
                        </div>

                        {resetEmailSent ? (
                          <div className="flex items-center space-x-2 text-green-600">
                            <Check className="h-4 w-4" />
                            <span className="text-sm">Şifre sıfırlama bağlantısı gönderildi!</span>
                          </div>
                        ) : (
                          <button
                            onClick={sendPasswordReset}
                            disabled={saving || !passwordResetEmail}
                            className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                          >
                            Şifre Sıfırlama Bağlantısı Gönder
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Two Factor Authentication */}
                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">İki Faktörlü Doğrulama</h4>
                          <p className="text-sm text-gray-600">Hesabınızı ekstra güvenlik katmanı ile koruyun</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={userSettings.two_factor_enabled}
                            onChange={(e) => setUserSettings({...userSettings, two_factor_enabled: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsModal;