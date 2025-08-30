import React, { useState } from 'react';
import { Languages, Copy, Loader2 } from 'lucide-react';
import { Button } from '@consulting19/ui';
import { useI18n } from '../hooks/useI18n';

interface TranslateButtonProps {
  sourceText: string;
  targetLang: 'tr' | 'pt';
  onTranslated: (translatedText: string) => void;
  size?: 'sm' | 'md';
  variant?: 'copy' | 'translate';
}

const TranslateButton: React.FC<TranslateButtonProps> = ({
  sourceText,
  targetLang,
  onTranslated,
  size = 'sm',
  variant = 'translate'
}) => {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);

  const handleCopy = () => {
    onTranslated(sourceText);
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          texts: [sourceText],
          target_lang: targetLang.toUpperCase(),
          source_lang: 'EN'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.translations && data.translations[0]) {
          onTranslated(data.translations[0]);
        }
      } else {
        console.error('Translation failed:', response.statusText);
        // Fallback to copy
        onTranslated(sourceText);
      }
    } catch (error) {
      console.error('Translation error:', error);
      // Fallback to copy
      onTranslated(sourceText);
    } finally {
      setLoading(false);
    }
  };

  const langKey = targetLang === 'tr' ? 'Turkish' : 'Portuguese';
  const actionKey = variant === 'copy' ? 'fillFromEnglish' : 'to' + langKey;

  return (
    <Button
      variant="outline"
      size={size}
      onClick={variant === 'copy' ? handleCopy : handleTranslate}
      disabled={loading || !sourceText.trim()}
      icon={loading ? Loader2 : variant === 'copy' ? Copy : Languages}
      className="text-xs"
    >
      {loading ? t('common.translate.translating') : t(`common.translate.${actionKey}`)}
    </Button>
  );
};

export default TranslateButton;