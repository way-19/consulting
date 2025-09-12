import React, { useState, useEffect } from 'react';
import { X, Save, Languages, CheckCircle, Globe, User } from 'lucide-react';
import { useAuth } from '@consulting19/shared';
import { supabase } from '@consulting19/shared/lib/supabase';

interface ConsultantLanguageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const ConsultantLanguageSettingsModal: React.FC<ConsultantLanguageSettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const { user, profile, refreshProfile } = useAuth();
  const [spokenLanguages, setSpokenLanguages] = useState<string[]>([]);
  const [isTranslator, setIsTranslator] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const availableLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
  ];

  useEffect(() => {
    if (isOpen && profile) {
      // Load current settings
      setSpokenLanguages(profile.metadata?.spoken_languages || ['en']);
      setIsTranslator(profile.metadata?.is_translator || false);
      setError('');
      setSuccess('');
    }
  }, [isOpen, profile]);

  const handleLanguageToggle = (langCode: string) => {
    setSpokenLanguages(prev => {
      if (prev.includes(langCode)) {
        // Don't allow removing if it's the only language
        if (prev.length === 1) {
          setError('At least one language must be selected');
          return prev;
        }
        return prev.filter(code => code !== langCode);
      } else {
        setError('');
        return [...prev, langCode];
      }
    });
  };

  const handleSaveSettings = async () => {
    if (spokenLanguages.length === 0) {
      setError('Please select at least one language you can speak');
      return;
    }

    try {
      setSaving(true);
      setError('');

      // Update user profile with language settings
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          metadata: {
            ...profile?.metadata,
            spoken_languages: spokenLanguages,
            is_translator: isTranslator
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (updateError) {
        throw updateError;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'profile_updated',
          description: 'Updated language settings and translator status',
          payload: {
            spoken_languages: spokenLanguages,
            is_translator: isTranslator,
            previous_languages: profile?.metadata?.spoken_languages,
            previous_translator: profile?.metadata?.is_translator
          }
        });

      setSuccess('Language settings saved successfully!');
      await refreshProfile();
      onSave();
      
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 2000);

    } catch (err: any) {
      console.error('Error updating language settings:', err);
      setError(err.message || 'Failed to save language settings');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
              <Languages className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Language Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            {success}
          </div>
        )}

        {/* Content */}
        <div className="space-y-6">
          {/* Spoken Languages */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-600" />
              Languages You Speak
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Select all languages you can communicate in with your clients. This helps with translation decisions.
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {availableLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageToggle(lang.code)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                    spokenLanguages.includes(lang.code)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{lang.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{lang.name}</div>
                      <div className="text-xs text-gray-500">{lang.code.toUpperCase()}</div>
                    </div>
                    {spokenLanguages.includes(lang.code) && (
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              Selected: {spokenLanguages.length} language{spokenLanguages.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Translator Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <User className="w-5 h-5 mr-2 text-green-600" />
              Professional Translator
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900 mb-1">I am a professional translator</div>
                  <p className="text-sm text-gray-600">
                    Check this if you provide professional translation services to clients
                  </p>
                </div>
                <button
                  onClick={() => setIsTranslator(!isTranslator)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isTranslator ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isTranslator ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              {isTranslator && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs text-green-800">
                    ✨ Your translator status will be shown to clients, which can help them understand 
                    your language capabilities and translation services.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">👀 How Clients See You</h4>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{profile?.full_name || 'Your Name'}</h4>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <span>🗣️ Speaks: {spokenLanguages.map(code => 
                      availableLanguages.find(l => l.code === code)?.name
                    ).join(', ')}</span>
                    {isTranslator && (
                      <>
                        <span>•</span>
                        <span className="text-green-600 font-medium">✨ Professional Translator</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={saving || spokenLanguages.length === 0}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2 inline" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultantLanguageSettingsModal;