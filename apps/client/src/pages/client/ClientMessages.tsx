import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  Send, 
  Paperclip, 
  Search,
  MoreVertical,
  User,
  CheckCircle,
  Languages,
  Volume2,
  VolumeX,
  Globe,
  Settings,
  ChevronDown,
  MessageSquare,
  Clock,
  Smile
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface Message {
  id: string;
  content: string;
  translated_content?: string;
  original_language: string;
  target_language: string;
  is_translated: boolean;
  is_read: boolean;
  created_at: string;
  sender: {
    id: string;
    full_name: string;
    role: string;
  };
  receiver: {
    id: string;
    full_name: string;
    role: string;
  };
}

interface Consultant {
  id: string;
  full_name: string;
  email: string;
  timezone: string;
  preferred_language: string;
  spoken_languages: string[];
  is_online: boolean;
}

const ClientMessages = () => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [translating, setTranslating] = useState<string | null>(null);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [typingIndicator, setTypingIndicator] = useState(false);

  const supportedLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  useEffect(() => {
    if (user && profile) {
      fetchConsultant();
      setupRealtimeSubscription();
    }
  }, [user, profile]);

  useEffect(() => {
    if (consultant) {
      fetchMessages();
      // Set default language from user preferences
      setSelectedLanguage(profile?.preferred_language || 'en');
    }
  }, [consultant, profile]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConsultant = async () => {
    try {
      // Get client data with assigned consultant
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select(`
          id,
          assigned_consultant_id,
          consultant:user_profiles!clients_assigned_consultant_id_fkey(
            id, full_name, email, timezone, preferred_language, metadata
          )
        `)
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientError || !clientData?.consultant) {
        console.log('No consultant assigned yet');
        return;
      }

      // Extract spoken languages from metadata
      const spokenLanguages = clientData.consultant.metadata?.spoken_languages || ['en'];
      
      setConsultant({
        ...clientData.consultant,
        spoken_languages: spokenLanguages,
        is_online: Math.random() > 0.5 // Mock online status
      });
    } catch (err) {
      console.error('Error fetching consultant:', err);
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      if (!consultant) return;

      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:user_profiles!messages_sender_id_fkey(id, full_name, role),
          receiver:user_profiles!messages_receiver_id_fkey(id, full_name, role)
        `)
        .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${consultant.id}),and(sender_id.eq.${consultant.id},receiver_id.eq.${user?.id})`)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        return;
      }

      setMessages(messagesData || []);
      
      // Mark messages as read
      await markMessagesAsRead();
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('receiver_id', user?.id)
        .eq('is_read', false);
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user) return;

    const channel = supabase
      .channel('client-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        },
        (payload) => {
          const newMessage = payload.new as any;
          setMessages(prev => [...prev, newMessage]);
          
          // Play notification sound
          if (soundEnabled) {
            const audio = new Audio('/notification.mp3');
            audio.play().catch(() => {}); // Ignore errors
          }
          
          // Auto-translate if enabled and languages differ
          if (autoTranslate && newMessage.original_language !== selectedLanguage) {
            translateMessage(newMessage.id, newMessage.content, newMessage.original_language, selectedLanguage);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !consultant || sending) return;

    try {
      setSending(true);
      
      // Determine target language (consultant's preferred language)
      const targetLang = consultant.preferred_language || 'en';
      const needsTranslation = selectedLanguage !== targetLang;
      
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user?.id,
          receiver_id: consultant.id,
          content: newMessage,
          original_language: selectedLanguage,
          target_language: targetLang,
          is_translated: false
        });

      if (error) {
        throw error;
      }

      setNewMessage('');
      
      // Auto-translate if needed
      if (needsTranslation && autoTranslate) {
        // Translation will be handled by the system
      }
      
      fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const translateMessage = async (messageId: string, content: string, fromLang: string, toLang: string) => {
    try {
      setTranslating(messageId);
      
      const { data, error } = await supabase.functions.invoke('translate-message', {
        body: {
          text: content,
          target_lang: toLang.toUpperCase()
        }
      });

      if (error) {
        throw error;
      }

      // Update message with translation
      await supabase
        .from('messages')
        .update({
          translated_content: data.translated,
          is_translated: true,
          target_language: toLang
        })
        .eq('id', messageId);

      fetchMessages();
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setTranslating(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isMyMessage = (message: Message) => {
    return message.sender.id === user?.id;
  };

  const getLanguageInfo = (code: string) => {
    return supportedLanguages.find(lang => lang.code === code) || supportedLanguages[0];
  };

  const currentLangInfo = getLanguageInfo(selectedLanguage);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Messages - Client Portal</title>
        </Helmet>
        
        <div className="h-[600px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading messages...</p>
          </div>
        </div>
      </>
    );
  }

  if (!consultant) {
    return (
      <>
        <Helmet>
          <title>Messages - Client Portal</title>
        </Helmet>
        
        <div className="h-[600px] flex items-center justify-center">
          <div className="text-center max-w-md">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Consultant Assigned</h3>
            <p className="text-gray-600 mb-6">
              You'll be able to message your consultant once you're assigned to one. 
              This usually happens within 24 hours of account creation.
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Messages - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-1">Communicate with your consultant</p>
          </div>
          
          {/* Language & Settings */}
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Globe className="w-4 h-4 text-gray-600" />
                <span className="text-sm">{currentLangInfo.flag}</span>
                <span className="text-sm font-medium">{currentLangInfo.name}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              
              {showLanguageSelector && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowLanguageSelector(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-64 overflow-y-auto">
                    <div className="py-1">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-200">
                        Consultant speaks:
                      </div>
                      {consultant.spoken_languages.map((langCode) => {
                        const langInfo = getLanguageInfo(langCode);
                        return (
                          <button
                            key={langCode}
                            onClick={() => {
                              setSelectedLanguage(langCode);
                              setShowLanguageSelector(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center space-x-2 ${
                              selectedLanguage === langCode ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                            }`}
                          >
                            <span>{langInfo.flag}</span>
                            <span>{langInfo.name}</span>
                            {selectedLanguage === langCode && (
                              <CheckCircle className="w-3 h-3 ml-auto" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Settings */}
            <button
              onClick={() => setAutoTranslate(!autoTranslate)}
              className={`p-2 rounded-lg transition-colors ${
                autoTranslate ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
              }`}
              title={autoTranslate ? 'Disable auto-translate' : 'Enable auto-translate'}
            >
              <Languages className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                soundEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}
              title={soundEnabled ? 'Disable sounds' : 'Enable sounds'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" style={{ height: '600px' }}>
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                {consultant.is_online && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{consultant.full_name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{consultant.is_online ? 'Online' : 'Offline'}</span>
                  <span>•</span>
                  <span>Your Consultant</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Globe className="w-3 h-3" />
                    <span>Speaks: {consultant.spoken_languages.map(lang => getLanguageInfo(lang).flag).join(' ')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="text-xs text-gray-500 text-right">
                <div>Your language: {currentLangInfo.flag} {currentLangInfo.name}</div>
                <div className={`${autoTranslate ? 'text-green-600' : 'text-gray-400'}`}>
                  Auto-translate: {autoTranslate ? 'ON' : 'OFF'}
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50" style={{ height: 'calc(600px - 140px)' }}>
            {messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${isMyMessage(message) ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-sm px-4 py-2 rounded-2xl relative group ${
                    isMyMessage(message)
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                  }`}>
                    <div className="flex items-start justify-between">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      {!isMyMessage(message) && message.original_language !== selectedLanguage && (
                        <button
                          onClick={() => translateMessage(message.id, message.content, message.original_language, selectedLanguage)}
                          disabled={translating === message.id}
                          className="ml-2 text-blue-600 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Translate message"
                        >
                          {translating === message.id ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600"></div>
                          ) : (
                            <Languages className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                    
                    {message.translated_content && message.translated_content !== message.content && (
                      <div className="mt-2 pt-2 border-t border-gray-200/20">
                        <p className="text-xs opacity-80 italic">{message.translated_content}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Languages className="w-2 h-2 opacity-60" />
                          <span className="text-xs opacity-60">
                            Translated from {getLanguageInfo(message.original_language).name}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs ${
                        isMyMessage(message) ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.created_at)}
                      </span>
                      {isMyMessage(message) && (
                        <CheckCircle className={`w-3 h-3 ${
                          message.is_read ? 'text-blue-200' : 'text-blue-300'
                        }`} />
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Your Conversation</h3>
                  <p className="text-gray-600 mb-4">
                    Send your first message to {consultant.full_name}
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 max-w-sm mx-auto">
                    <div className="flex items-center space-x-2 mb-2">
                      <Languages className="w-4 h-4" />
                      <span className="font-semibold">Multi-Language Support</span>
                    </div>
                    <p className="text-xs">
                      Messages are automatically translated between your language ({currentLangInfo.name}) 
                      and your consultant's language. Communication barriers eliminated!
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {typingIndicator && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-end space-x-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message ${consultant.full_name} in ${currentLangInfo.name}...`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={1}
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
                
                {/* Language indicator */}
                <div className="absolute bottom-2 right-2 flex items-center space-x-1">
                  {autoTranslate && selectedLanguage !== (consultant.preferred_language || 'en') && (
                    <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                      <Languages className="w-3 h-3" />
                      <span>Auto-translate</span>
                    </div>
                  )}
                  <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {currentLangInfo.flag}
                  </div>
                </div>
              </div>
              
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Smile className="w-5 h-5" />
              </button>
              
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || sending}
                className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {sending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <div className="flex items-center space-x-4">
                <span className={`flex items-center space-x-1 ${autoTranslate ? 'text-green-600' : ''}`}>
                  <Languages className="w-3 h-3" />
                  <span>Auto-translate: {autoTranslate ? 'ON' : 'OFF'}</span>
                </span>
                <span className={`flex items-center space-x-1 ${soundEnabled ? 'text-blue-600' : ''}`}>
                  {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                  <span>Sound: {soundEnabled ? 'ON' : 'OFF'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Consultant Language Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Language Support</h3>
                <p className="text-sm text-gray-600">
                  {consultant.full_name} speaks: {consultant.spoken_languages.map(lang => getLanguageInfo(lang).name).join(', ')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">Your Language: {currentLangInfo.name}</div>
              <div className="text-xs text-gray-500">
                {selectedLanguage !== (consultant.preferred_language || 'en') 
                  ? 'Messages will be auto-translated' 
                  : 'Direct communication'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Translation Info */}
        {selectedLanguage !== (consultant.preferred_language || 'en') && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Languages className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">🌍 Real-Time Translation Active</h4>
                <p className="text-xs text-blue-800">
                  <strong>Your language:</strong> {currentLangInfo.name} → 
                  <strong> Consultant's language:</strong> {getLanguageInfo(consultant.preferred_language || 'en').name}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Messages are automatically translated using DeepL technology for seamless communication.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientMessages;