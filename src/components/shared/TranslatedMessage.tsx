import React, { useState } from 'react';
import { Languages, Eye, EyeOff } from 'lucide-react';
import { getLanguageFlag, getLanguageName } from '../../lib/translation';

interface TranslatedMessageProps {
  originalMessage: string;
  translatedMessage?: string;
  originalLanguage: string;
  translatedLanguage?: string;
  userLanguage: string;
  showTranslationToggle?: boolean;
}

const TranslatedMessage: React.FC<TranslatedMessageProps> = ({
  originalMessage,
  translatedMessage,
  originalLanguage,
  translatedLanguage,
  userLanguage,
  showTranslationToggle = true
}) => {
  const [showOriginal, setShowOriginal] = useState(false);
  
  // Determine which message to show by default
  const shouldShowTranslation = translatedMessage && 
    translatedLanguage === userLanguage && 
    originalLanguage !== userLanguage;

  const displayMessage = shouldShowTranslation && !showOriginal 
    ? translatedMessage 
    : originalMessage;

  const displayLanguage = shouldShowTranslation && !showOriginal 
    ? translatedLanguage 
    : originalLanguage;

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <p className="text-gray-800 flex-1">{displayMessage}</p>
        
        {shouldShowTranslation && showTranslationToggle && (
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="ml-3 p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
            title={showOriginal ? 'Çeviriyi göster' : 'Orijinali göster'}
          >
            {showOriginal ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Language indicator */}
      <div className="flex items-center space-x-2 text-xs text-gray-500">
        <span className="flex items-center space-x-1">
          <span>{getLanguageFlag(displayLanguage || 'en')}</span>
          <span>{getLanguageName(displayLanguage || 'en')}</span>
        </span>
        
        {shouldShowTranslation && (
          <>
            <Languages className="h-3 w-3" />
            <span className="text-blue-600">
              {showOriginal ? 'Orijinal' : 'Çevrildi'}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default TranslatedMessage;