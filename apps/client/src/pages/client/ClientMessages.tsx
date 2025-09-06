import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  MessageSquare, 
  Send, 
  Globe, 
  User, 
  Clock,
  CheckCircle,
  Languages,
  Settings,
  Smile,
  Paperclip,
  Mic,
  MoreVertical,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  translated_content: string | null;
  original_language: string;
  target_language: string;
  is_translated: boolean;
  is_read: boolean;
  created_at: string;
  sender: {
    full_name: string;
  };
}

interface Consultant {
  id: string;
  full_name: string;
  preferred_language: string;
  metadata: any;
}

const ClientMessages = () => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translationEnabled, setTranslationEnabled] = useState(true);
  const [sending, setSending] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ka', name: 'ქართული', flag: '🇬🇪' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  useEffect(() => {
    if (user && profile) {
      fetchConsultant();
    }
  }, [user, profile]);

  useEffect(() => {
    if (consultant) {
      fetchMessages();
      setupRealtimeSubscription();
    }
  }, [consultant]);

  useEffect(() => {
    // Only scroll to bottom if there are messages and user is near bottom
    if (messages.length > 0) {
      const chatContainer = messagesEndRef.current?.parentElement;
      if (chatContainer) {
        const isNearBottom = chatContainer.scrollTop + chatContainer.clientHeight >= chatContainer.scrollHeight - 100;
        if (isNearBottom || messages.length === 1) {
          scrollToBottom();
        }
      }
    }
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const fetchConsultant = async () => {
    try {
      console.log('🔍 Fetching consultant for user:', user?.email);
      
      // Step 1: Get client record
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id, profile_id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      console.log('👤 Client data found:', clientData);

      if (clientError) {
        console.error('❌ Client fetch error:', clientError);
        setLoading(false);
        return;
      }

      if (!clientData) {
        console.log('❌ No client record found for this user');
        setLoading(false);
        return;
      }

      if (!clientData?.assigned_consultant_id) {
        console.log('⚠️ No consultant assigned to this client');
        setLoading(false);
        return;
      }

      console.log('🎯 Looking for consultant ID:', clientData.assigned_consultant_id);

      // Step 2: Get consultant details
      const { data: consultantData, error: consultantError } = await supabase
        .from('user_profiles')
        .select('id, full_name, preferred_language, metadata, role, is_active')
        .eq('id', clientData.assigned_consultant_id)
        .maybeSingle();

      console.log('👨‍💼 Consultant query result:', consultantData);

      if (consultantError) {
        console.error('❌ Consultant fetch error:', consultantError);
        setLoading(false);
        return;
      }

      if (!consultantData) {
        console.log('❌ Consultant not found in database');
        setLoading(false);
        return;
      }

      if (consultantData.role !== 'consultant') {
        console.log('❌ User found but role is not consultant:', consultantData.role);
        setLoading(false);
        return;
      }

      if (!consultantData.is_active) {
        console.log('❌ Consultant found but not active');
        setLoading(false);
        return;
      }

      console.log('✅ Consultant successfully found:', consultantData.full_name);
      
      setConsultant(consultantData);
      setIsOnline(true); // Simulate online status
      setLoading(false);

    } catch (err) {
      console.error('💥 Unexpected error fetching consultant:', err);
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!consultant || !user) return;

    try {
      console.log('📨 Fetching messages between user and consultant');
      
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:user_profiles!messages_sender_id_fkey(full_name)
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${consultant.id}),and(sender_id.eq.${consultant.id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('❌ Messages fetch error:', messagesError);
        return;
      }

      console.log('✅ Messages fetched:', messagesData?.length || 0);
      setMessages(messagesData || []);

      // Mark messages as read
      if (messagesData && messagesData.length > 0) {
        await supabase
          .from('messages')
          .update({ is_read: true })
          .eq('receiver_id', user.id)
          .eq('is_read', false);
      }
        
    } catch (err) {
      console.error('💥 Unexpected error fetching messages:', err);
    }
  };

  const translateText = async (text: string, sourceLang: string, targetLang: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('translate-message', {
        body: {
          text: text,
          target_lang: targetLang.toLowerCase()
        }
      });

      if (error) {
        console.error('Translation service error:', error);
        return null;
      }

      return data?.translated || null;
    } catch (err) {
      console.error('Translation service error:', err);
      return null;
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user) return;

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        },
        (payload) => {
          console.log('📨 New message received via realtime');
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !consultant) return;

    try {
      setSending(true);

      let messageToSend = newMessage;
      let translatedMessage = null;
      const needsTranslation = translationEnabled && 
        selectedLanguage !== (consultant.preferred_language || 'en');

      console.log('📤 Sending message:', {
        originalLanguage: selectedLanguage,
        consultantLanguage: consultant.preferred_language,
        needsTranslation,
        translationEnabled
      });

      // Translate message if needed
      if (needsTranslation) {
        console.log('🌐 Translating message via DeepL...');
        translatedMessage = await translateText(
          newMessage, 
          selectedLanguage, 
          consultant.preferred_language || 'en'
        );
        console.log('✅ Translation result:', translatedMessage);
      }

      // Insert message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          sender_id: user?.id,
          receiver_id: consultant.id,
          content: messageToSend,
          translated_content: translatedMessage,
          original_language: selectedLanguage,
          target_language: consultant.preferred_language || 'en',
          is_translated: needsTranslation
        });

      if (messageError) {
        throw messageError;
      }

      console.log('✅ Message sent successfully');

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'message_sent',
          description: 'Sent message to consultant',
          payload: { 
            message_length: newMessage.length,
            translated: needsTranslation,
            language: selectedLanguage,
            consultant_id: consultant.id
          }
        });

      setNewMessage('');
      fetchMessages();
    } catch (err) {
      console.error('❌ Error sending message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getConsultantLanguages = () => {
    // Get languages from consultant metadata or default to English/Georgian
    const supportedLangs = consultant?.metadata?.languages || ['en', 'ka'];
    return languages.filter(lang => supportedLangs.includes(lang.code));
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Messages - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
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
        
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-6 rounded-lg text-center">
            <MessageSquare className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">No Consultant Assigned</h3>
            <p className="text-sm">
              You need to be assigned to a consultant to start messaging. 
              This typically happens after your initial consultation or service purchase.
            </p>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-xs">
              🔍 <strong>Debug Info:</strong> User ID: {user?.id} | Profile ID: {profile?.id}
            </div>
          </div>
        </div>
      </>
    );
  }

  const consultantLanguages = getConsultantLanguages();
  const currentLangObj = languages.find(l => l.code === selectedLanguage) || languages[0];
  const consultantLangObj = languages.find(l => l.code === (consultant.preferred_language || 'en')) || languages[0];
  const languagesDiffer = selectedLanguage !== (consultant.preferred_language || 'en');

  return (
    <>
      <Helmet>
        <title>Messages - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">Chat with your consultant in real-time with automatic translation</p>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[600px]">
          {/* Chat Header */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                    isOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{consultant.full_name}</h3>
                  <div className="text-sm text-gray-600">
                    {isOnline ? 'Online' : 'Offline'} • Speaks {consultantLangObj.flag} {consultantLangObj.name}
                    {consultantLanguages.length > 1 && (
                      <span className="text-blue-600 ml-1">
                        +{consultantLanguages.length - 1} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Translation Controls */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Languages className="w-4 h-4 text-gray-400" />
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => setTranslationEnabled(!translationEnabled)}
                  className={`p-2 rounded-lg transition-colors ${
                    translationEnabled 
                      ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={translationEnabled ? 'Auto-translation enabled' : 'Auto-translation disabled'}
                >
                  <Globe className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Language Notice */}
            {languagesDiffer && translationEnabled && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  🌐 <strong>Auto-translation active:</strong> Your messages in {currentLangObj.name} 
                  will be automatically translated to {consultantLangObj.name} for your consultant.
                </p>
              </div>
            )}

            {/* Language Warning */}
            {languagesDiffer && !translationEnabled && (
              <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  ⚠️ <strong>Translation disabled:</strong> You're writing in {currentLangObj.name} 
                  but your consultant prefers {consultantLangObj.name}. Consider enabling auto-translation.
                </p>
              </div>
            )}

            {/* Consultant Languages */}
            <div className="mt-3 flex items-center space-x-2">
              <span className="text-xs text-gray-500">Consultant speaks:</span>
              {consultantLanguages.map((lang, index) => (
                <span key={lang.code} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  {lang.flag} {lang.name}
                </span>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length > 0 ? (
              messages.map((message) => {
                const isMyMessage = message.sender_id === user?.id;
                return (
                  <div key={message.id} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      isMyMessage 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      {message.is_translated && message.translated_content && (
                        <div className={`mt-2 pt-2 border-t ${isMyMessage ? 'border-white/20' : 'border-gray-300'}`}>
                          <div className="flex items-center space-x-1 mb-1">
                            <Globe className="w-3 h-3 opacity-75" />
                            <span className="text-xs opacity-75">Auto-translated:</span>
                          </div>
                          <p className="text-xs opacity-90">
                            {message.translated_content}
                          </p>
                        </div>
                      )}
                      <div className={`flex items-center justify-between mt-2 text-xs ${
                        isMyMessage ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <div className="flex items-center space-x-1">
                          <span>{formatTime(message.created_at)}</span>
                          {message.is_translated && (
                            <span className="opacity-75">• Translated</span>
                          )}
                        </div>
                        {isMyMessage && (
                          <CheckCircle className={`w-3 h-3 ${message.is_read ? 'text-green-300' : 'text-blue-300'}`} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">Start a conversation with {consultant.full_name}</p>
                  <p className="text-xs text-gray-500">
                    {languagesDiffer 
                      ? `You can write in ${currentLangObj.name}, messages will be auto-translated to ${consultantLangObj.name}`
                      : `You both speak ${currentLangObj.name}`
                    }
                  </p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder={`Type your message in ${currentLangObj.name}...`}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <Paperclip className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={sendMessage}
                disabled={sending || !newMessage.trim()}
                className="w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {sending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <span>Your language: {currentLangObj.flag} {currentLangObj.name}</span>
                {translationEnabled && languagesDiffer && (
                  <span className="text-green-600">• Auto-translation: ON</span>
                )}
                {!translationEnabled && languagesDiffer && (
                  <span className="text-orange-600">• Auto-translation: OFF</span>
                )}
              </div>
              <span>Press Enter to send</span>
            </div>

            {/* Translation Warning */}
            {!translationEnabled && languagesDiffer && (
              <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-800">
                <AlertCircle className="w-3 h-3 inline mr-1" />
                Your consultant prefers {consultantLangObj.name}. Consider enabling auto-translation for better communication.
              </div>
            )}
          </div>
        </div>

        {/* Translation Info Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Translation Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Your Language</h4>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">{currentLangObj.flag}</span>
                <span className="font-medium">{currentLangObj.name}</span>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Consultant's Language</h4>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">{consultantLangObj.flag}</span>
                <span className="font-medium">{consultantLangObj.name}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Globe className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-900">Powered by DeepL</span>
            </div>
            <p className="text-xs text-green-800">
              High-quality automatic translation between languages. All translations are powered by DeepL's professional translation API.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientMessages;