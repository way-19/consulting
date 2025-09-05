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
  MoreVertical
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
  ];

  useEffect(() => {
    if (user && profile) {
      fetchConsultant();
      fetchMessages();
      setupRealtimeSubscription();
    }
  }, [user, profile]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConsultant = async () => {
    try {
      // Get client's assigned consultant
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('assigned_consultant_id')
        .eq('profile_id', user?.id)
        .single();

      if (clientError || !clientData) {
        console.error('Error fetching client data:', clientError);
        setConsultant(null);
        return;
      }

      if (!clientData?.assigned_consultant_id) {
        console.log('Client has no assigned consultant');
        setConsultant(null);
        return;
      }

      // Get consultant details
      const { data: consultantData, error: consultantError } = await supabase
        .from('user_profiles')
        .select('id, full_name, preferred_language, metadata')
        .eq('id', clientData.assigned_consultant_id)
        .eq('role', 'consultant')
        .single();

      if (consultantError || !consultantData) {
        console.error('Error fetching consultant:', consultantError);
        setConsultant(null);
        return;
      }

      console.log('Consultant found:', consultantData.full_name);
      setConsultant(consultantData);
      // Simulate online status
      setIsOnline(true); // Assume consultant is available
    } catch (err) {
      console.error('Unexpected error:', err);
      setConsultant(null);
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);

      if (!consultant) {
        setLoading(false);
        return;
      }

      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:user_profiles!messages_sender_id_fkey(full_name)
        `)
        .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
        .or(`sender_id.eq.${consultant.id},receiver_id.eq.${consultant.id}`)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        return;
      }

      setMessages(messagesData || []);

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('receiver_id', user?.id)
        .eq('is_read', false);
        
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user?.id}`
        },
        (payload) => {
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
      const isTranslated = translationEnabled && selectedLanguage !== consultant.preferred_language;

      // Translate message if needed
      if (isTranslated) {
        const { data: translationData, error: translationError } = await supabase.functions.invoke(
          'translate',
          {
            body: {
              texts: [newMessage],
              target_lang: consultant.preferred_language?.toUpperCase() || 'EN',
              source_lang: selectedLanguage.toUpperCase()
            }
          }
        );

        if (!translationError && translationData?.translations?.[0]) {
          translatedMessage = translationData.translations[0];
        }
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
          is_translated: isTranslated
        });

      if (messageError) {
        throw messageError;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'message_sent',
          description: 'Sent message to consultant',
          payload: { 
            message_length: newMessage.length,
            translated: isTranslated,
            language: selectedLanguage
          }
        });

      // Notify consultant
      await supabase.functions.invoke('notify', {
        body: {
          recipient_id: consultant.id,
          type: 'new_message',
          payload: {
            client_name: profile?.full_name,
            message_preview: newMessage.substring(0, 100)
          },
          email_notification: true
        }
      });

      setNewMessage('');
      fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">Chat with your consultant in real-time</p>
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
                  <p className="text-sm text-gray-600">
                    {isOnline ? 'Online' : 'Offline'} • Speaks {consultant.preferred_language || 'English'}
                  </p>
                </div>
              </div>
              
              {/* Translation Settings */}
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
                  title={translationEnabled ? 'Translation enabled' : 'Translation disabled'}
                >
                  <Globe className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Language Notice */}
            {selectedLanguage !== consultant.preferred_language && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  🌐 <strong>Auto-translation active:</strong> Your messages in {languages.find(l => l.code === selectedLanguage)?.name} 
                  will be translated to {consultant.preferred_language} for your consultant.
                </p>
              </div>
            )}
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
                        <div className="mt-2 pt-2 border-t border-white/20">
                          <p className="text-xs opacity-75">
                            Translated: {message.translated_content}
                          </p>
                        </div>
                      )}
                      <div className={`flex items-center justify-between mt-2 text-xs ${
                        isMyMessage ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <span>{formatTime(message.created_at)}</span>
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
                  <p className="text-gray-600">Start a conversation with your consultant</p>
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
                  placeholder={`Type your message in ${languages.find(l => l.code === selectedLanguage)?.name}...`}
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
                <span>Language: {languages.find(l => l.code === selectedLanguage)?.flag}</span>
                {translationEnabled && selectedLanguage !== consultant.preferred_language && (
                  <span className="text-green-600">• Auto-translation enabled</span>
                )}
              </div>
              <span>Press Enter to send</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
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

export default ClientMessages;