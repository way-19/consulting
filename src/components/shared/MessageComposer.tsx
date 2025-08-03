import React, { useState } from 'react';
import { Send, Paperclip, Mic, MicOff, Languages } from 'lucide-react';
import { translationService, getLanguageFlag, getLanguageName } from '../../lib/translation';

interface MessageComposerProps {
  onSendMessage: (message: string, language: string) => Promise<void>;
  placeholder?: string;
  userLanguage: string;
  recipientLanguage?: string;
  className?: string;
}

const MessageComposer: React.FC<MessageComposerProps> = ({
  onSendMessage,
  placeholder = 'Mesajınızı yazın...',
  userLanguage,
  recipientLanguage,
  className = ''
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      const detected = await translationService.detectLanguage(message);
      await onSendMessage(message, detected);
      setMessage('');
      setDetectedLanguage(null);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleMessageChange = async (value: string) => {
    setMessage(value);
    
    // Detect language as user types (debounced)
    if (value.length > 10) {
      const detected = await translationService.detectLanguage(value);
      setDetectedLanguage(detected);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording with Vapi
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-4 ${className}`}>
      {/* Language indicators */}
      {(detectedLanguage || recipientLanguage) && (
        <div className="flex items-center justify-between mb-3 text-sm">
          {detectedLanguage && (
            <div className="flex items-center space-x-2 text-blue-600">
              <Languages className="h-4 w-4" />
              <span>Algılanan dil: {getLanguageFlag(detectedLanguage)} {getLanguageName(detectedLanguage)}</span>
            </div>
          )}
          {recipientLanguage && recipientLanguage !== userLanguage && (
            <div className="flex items-center space-x-2 text-green-600">
              <span>→ Çevrilecek: {getLanguageFlag(recipientLanguage)} {getLanguageName(recipientLanguage)}</span>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex space-x-2">
          <textarea
            value={message}
            onChange={(e) => handleMessageChange(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            disabled={sending}
          />
          
          <div className="flex flex-col space-y-2">
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-2 rounded-lg transition-colors ${
                isRecording 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isRecording ? 'Kaydı durdur' : 'Sesli mesaj'}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
            
            <button
              type="button"
              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              title="Dosya ekle"
            >
              <Paperclip className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {message.length > 0 && `${message.length} karakter`}
          </div>
          
          <button
            type="submit"
            disabled={!message.trim() || sending}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span>{sending ? 'Gönderiliyor...' : 'Gönder'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageComposer;