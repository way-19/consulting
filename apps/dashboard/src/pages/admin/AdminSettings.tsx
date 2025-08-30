import React, { useState, useEffect } from 'react';
import { Settings, Save, DollarSign, Mail, Globe, Zap } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { supabase } from '@consulting19/supabase';
import { useI18n } from '../../hooks/useI18n';
import AdminLayout from '../../components/layouts/AdminLayout';
import { Helmet } from 'react-helmet-async';

interface SystemSettings {
  default_currency: string;
  commission_split: {
    platform: number;
    consultant: number;
  };
  email_sender: {
    name: string;
    email: string;
  };
  deepl_enabled: boolean;
  cache_ttl: number;
}

const AdminSettings = () => {
  const { t, formatNumber } = useI18n();
  const [settings, setSettings] = useState<SystemSettings>({
    default_currency: 'USD',
    commission_split: { platform: 35, consultant: 65 },
    email_sender: { name: 'Consulting19', email: 'noreply@consulting19.com' },
    deepl_enabled: true,
    cache_ttl: 3600,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['default_currency', 'commission_split', 'email_sender', 'deepl_enabled', 'cache_ttl']);

      if (error) {
        console.error('Error fetching settings:', error);
      } else if (data) {
        const settingsMap = data.reduce((acc, setting) => {
          acc[setting.setting_key] = setting.setting_value;
          return acc;
        }, {} as any);

        setSettings({
          default_currency: settingsMap.default_currency || 'USD',
          commission_split: settingsMap.commission_split || { platform: 35, consultant: 65 },
          email_sender: settingsMap.email_sender || { name: 'Consulting19', email: 'noreply@consulting19.com' },
          deepl_enabled: settingsMap.deepl_enabled || true,
          cache_ttl: settingsMap.cache_ttl || 3600,
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);

      // Update each setting
      const updates = [
        { key: 'default_currency', value: settings.default_currency },
        { key: 'commission_split', value: settings.commission_split },
        { key: 'email_sender', value: settings.email_sender },
        { key: 'deepl_enabled', value: settings.deepl_enabled },
        { key: 'cache_ttl', value: settings.cache_ttl },
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('system_settings')
          .upsert({
            setting_key: update.key,
            setting_value: update.value,
            category: update.key.includes('commission') || update.key.includes('currency') ? 'finance' : 
                     update.key.includes('email') ? 'email' :
                     update.key.includes('deepl') ? 'translation' : 'performance',
            updated_by: (await supabase.auth.getUser()).data.user?.id,
          });

        if (error) throw error;
      }

      // Log action
      await supabase.rpc('log_admin_action', {
        action_type: 'update',
        resource_type: 'system_settings',
        new_values: settings
      });

      alert(t('notifications.saved'));
    } catch (error) {
      console.error('Error saving settings:', error);
      alert(t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  const updateCommissionSplit = (platform: number) => {
    setSettings(prev => ({
      ...prev,
      commission_split: {
        platform,
        consultant: 100 - platform
      }
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <Helmet>
          <title>{t('settings.title')} - Consulting19</title>
        </Helmet>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>{t('settings.title')} - Consulting19</title>
      </Helmet>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('settings.title')}</h1>
            <p className="text-gray-600">{t('settings.subtitle')}</p>
          </div>
          <Button onClick={saveSettings} loading={saving} icon={Save}>
            {t('common.save')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Finance Settings */}
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">{t('settings.finance')}</h2>
            </div>
          </Card.Header>
          <Card.Body className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('settings.defaultCurrency')}
              </label>
              <select
                value={settings.default_currency}
                onChange={(e) => setSettings(prev => ({ ...prev, default_currency: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.name} ({currency.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('settings.commissionSplit')}
              </label>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{t('settings.platformFee')}</span>
                    <span>{settings.commission_split.platform}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="50"
                    value={settings.commission_split.platform}
                    onChange={(e) => updateCommissionSplit(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <div className="font-semibold text-blue-900">Platform</div>
                    <div className="text-blue-700">{settings.commission_split.platform}%</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <div className="font-semibold text-green-900">Consultant</div>
                    <div className="text-green-700">{settings.commission_split.consultant}%</div>
                  </div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Email Settings */}
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">{t('settings.email')}</h2>
            </div>
          </Card.Header>
          <Card.Body className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('settings.senderName')}
              </label>
              <input
                type="text"
                value={settings.email_sender.name}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  email_sender: { ...prev.email_sender, name: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('settings.senderEmail')}
              </label>
              <input
                type="email"
                value={settings.email_sender.email}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  email_sender: { ...prev.email_sender, email: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </Card.Body>
        </Card>

        {/* Translation Settings */}
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">{t('settings.translation')}</h2>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{t('settings.deeplEnabled')}</div>
                <div className="text-sm text-gray-600">Enable automatic translation features</div>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, deepl_enabled: !prev.deepl_enabled }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.deepl_enabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.deepl_enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </Card.Body>
        </Card>

        {/* Performance Settings */}
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-semibold text-gray-900">{t('settings.performance')}</h2>
            </div>
          </Card.Header>
          <Card.Body>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('settings.cacheTtl')}
              </label>
              <input
                type="number"
                value={settings.cache_ttl}
                onChange={(e) => setSettings(prev => ({ ...prev, cache_ttl: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="300"
                max="86400"
              />
              <div className="text-xs text-gray-500 mt-1">
                Current: {formatNumber(settings.cache_ttl)} seconds ({Math.round(settings.cache_ttl / 60)} minutes)
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;