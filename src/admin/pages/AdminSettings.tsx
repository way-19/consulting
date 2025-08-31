import React, { useState } from 'react';
import { Save, DollarSign, Globe, Mail, Zap } from 'lucide-react';
import { Card, Button } from '../../shared/components/ui';
import { useLanguage } from '../../shared/contexts/LanguageContext';

const AdminSettings = () => {
  const { t } = useLanguage();
  const [settings, setSettings] = useState({
    stripePublishableKey: '',
    stripeSecretKey: '',
    deeplApiKey: '',
    platformCommission: 35,
    consultantPayout: 65,
    defaultCurrency: 'USD',
    emailSender: 'noreply@consulting19.com',
    emailSenderName: 'Consulting19',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Save settings to Supabase system_settings table
      console.log('Saving settings:', settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure platform-wide settings and integrations</p>
        </div>
        <Button onClick={handleSave} loading={saving} icon={Save}>
          {saving ? 'Saving...' : t('save')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Settings */}
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Payment Settings</h2>
            </div>
          </Card.Header>
          <Card.Body className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stripe Publishable Key
              </label>
              <input
                type="text"
                value={settings.stripePublishableKey}
                onChange={(e) => handleInputChange('stripePublishableKey', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="pk_test_..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stripe Secret Key
              </label>
              <input
                type="password"
                value={settings.stripeSecretKey}
                onChange={(e) => handleInputChange('stripeSecretKey', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="sk_test_..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commission Split
              </label>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Platform Commission</span>
                    <span>{settings.platformCommission}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="50"
                    value={settings.platformCommission}
                    onChange={(e) => {
                      const platform = parseInt(e.target.value);
                      handleInputChange('platformCommission', platform);
                      handleInputChange('consultantPayout', 100 - platform);
                    }}
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <div className="font-semibold text-blue-900">Platform</div>
                    <div className="text-blue-700">{settings.platformCommission}%</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <div className="font-semibold text-green-900">Consultant</div>
                    <div className="text-green-700">{settings.consultantPayout}%</div>
                  </div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Translation Settings */}
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Translation Settings</h2>
            </div>
          </Card.Header>
          <Card.Body className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DeepL API Key
              </label>
              <input
                type="password"
                value={settings.deeplApiKey}
                onChange={(e) => handleInputChange('deeplApiKey', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter DeepL API key"
              />
              <p className="text-xs text-gray-500 mt-1">
                Used for automatic content translation
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Currency
              </label>
              <select
                value={settings.defaultCurrency}
                onChange={(e) => handleInputChange('defaultCurrency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="TRY">TRY - Turkish Lira</option>
              </select>
            </div>
          </Card.Body>
        </Card>

        {/* Email Settings */}
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Email Settings</h2>
            </div>
          </Card.Header>
          <Card.Body className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sender Name
              </label>
              <input
                type="text"
                value={settings.emailSenderName}
                onChange={(e) => handleInputChange('emailSenderName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sender Email
              </label>
              <input
                type="email"
                value={settings.emailSender}
                onChange={(e) => handleInputChange('emailSender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </Card.Body>
        </Card>

        {/* System Settings */}
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-semibold text-gray-900">System Settings</h2>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Maintenance Mode</div>
                  <div className="text-sm text-gray-600">Temporarily disable public access</div>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Auto-assign Consultants</div>
                  <div className="text-sm text-gray-600">Automatically assign new clients to consultants</div>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                </button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;