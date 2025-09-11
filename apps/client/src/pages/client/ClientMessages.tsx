import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  Send, 
  User, 
  Clock, 
  CheckCircle,
  MessageSquare,
  Phone,
  Video,
  Languages,
  Volume2,
  VolumeX
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
  is_online: boolean;
}

const ClientMessages = () => {
  const { user, profile } = useAuth();
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && profile) {
      fetchConsultantAndMessages();
      setupRealtimeSubscription();
    }
  }, [user, profile]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConsultantAndMessages = async () => {
    try {
      setLoading(true);
      
      // Get client data with consultant
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select(`
          id,
          assigned_consultant_id,
          consultant:user_profiles!clients_assigned_consultant_id_fkey(
            id, full_name, email, timezone
          )
        `)
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientError || !clientData) {
        console.error('Client fetch error:', clientError);
        return;
      }

      if (clientData.consultant) {
        setConsultant({
          ...clientData.consultant,
          is_online: Math.random() > 0.5 // Mock online status
        });
        
        // Fetch messages
        await fetchMessages(clientData.consultant.id);
      }
    } catch (err) {
      console.error('Error fetching consultant and messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (consultantId: string) => {
    try {
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:user_profiles!messages_sender_id_fkey(id, full_name, role),
          receiver:user_profiles!messages_receiver_id_fkey(id, full_name, role)
        `)
        .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${consultantId}),and(sender_id.eq.${consultantId},receiver_id.eq.${user?.id})`)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        return;
      }

      setMessages(messagesData || []);
      
      // Mark messages as read
      await markMessagesAsRead(consultantId);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const markMessagesAsRead = async (consultantId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', consultantId)
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
            audio.play().catch(() => {});
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
      
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user?.id,
          receiver_id: consultant.id,
          content: newMessage,
          original_language: profile?.preferred_language || 'en',
          target_language: 'en',
          is_translated: false
        });

      if (error) {
        throw error;
      }

      setNewMessage('');
      
      // Refresh messages
      if (consultant) {
        await fetchMessages(consultant.id);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
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

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Messages - Client Portal</title>
        </Helmet>
        
        <div className="h-full flex items-center justify-center">
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
        
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <User className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-yellow-900 mb-4">No Consultant Assigned</h3>
            <p className="text-yellow-800">
              You need to be assigned to a consultant to start messaging. 
              This usually happens within 24 hours of account creation.
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
          <p className="text-gray-600 mt-1">Chat with your consultant</p>
        </div>

        <div className="h-96 flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Chat Header */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  {consultant.is_online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{consultant.full_name}</h3>
                  <p className="text-sm text-gray-600">
                    Your Consultant • {consultant.is_online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-2 rounded-lg transition-colors ${
                    soundEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                
                <button
                  onClick={() => setAutoTranslate(!autoTranslate)}
                  className={`p-2 rounded-lg transition-colors ${
                    autoTranslate ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Languages className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${isMyMessage(message) ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      isMyMessage(message)
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      
                      {message.translated_content && message.translated_content !== message.content && (
                        <div className="mt-2 pt-2 border-t border-gray-200/20">
                          <p className="text-xs opacity-80 italic">{message.translated_content}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-1">
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
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Conversation</h3>
                    <p className="text-gray-600">
                      Send your first message to {consultant.full_name}
                    </p>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end space-x-3">
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Message ${consultant.full_name}...`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={1}
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                  
                  {autoTranslate && (
                    <div className="absolute bottom-2 right-2">
                      <Languages className="w-4 h-4 text-green-500" title="Auto-translate enabled" />
                    </div>
                  )}
                </div>
                
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientMessages;