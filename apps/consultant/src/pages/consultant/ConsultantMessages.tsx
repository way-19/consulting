import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import MassCommunicationManager from '../../components/MassCommunicationManager';
import ConsultantLanguageSettingsModal from '../../components/ConsultantLanguageSettingsModal';
import { Send, Search, Phone, Video, MoreVertical, User, Clock, CheckCircle, Languages, Volume2, VolumeX, Megaphone, BookTemplate as Template, BarChart3, Users, MessageSquare, Star, Archive, X } from 'lucide-react';
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

interface Client {
  id: string;
  profile_id: string;
  company_name: string;
  profile: {
    full_name: string;
    preferred_language: string;
  };
  unread_count: number;
  last_message: string;
  last_message_time: string;
  is_online: boolean;
}

const ConsultantMessages = () => {
  const { user, profile } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [translating, setTranslating] = useState<string | null>(null);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMassCommunication, setShowMassCommunication] = useState(false);
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mass communication state
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [showMassMessage, setShowMassMessage] = useState(false);
  const [massMessageData, setMassMessageData] = useState({
    subject: '',
    message: '',
    priority: 'medium',
    send_email: true,
    translate_message: true
  });
  const [sendingMassMessage, setSendingMassMessage] = useState(false);

  useEffect(() => {
    if (user && profile) {
      fetchClients();
      setupRealtimeSubscription();
    }
  }, [user, profile]);

  useEffect(() => {
    if (selectedClient) {
      fetchMessages();
    }
  }, [selectedClient]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchClients = async () => {
    try {
      setLoading(true);
      
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select(`
          *,
          profile:user_profiles!clients_profile_id_fkey(full_name, preferred_language)
        `)
        .eq('assigned_consultant_id', user?.id)
        .eq('status', 'active');

      if (clientsError) {
        console.error('Error fetching clients:', clientsError);
        return;
      }

      // Enrich with message data
      const enrichedClients = await Promise.all(
        (clientsData || []).map(async (client) => {
          // Get unread message count
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('sender_id', client.profile_id)
            .eq('receiver_id', user?.id)
            .eq('is_read', false);

          // Get last message
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('content, created_at')
            .or(`and(sender_id.eq.${client.profile_id},receiver_id.eq.${user?.id}),and(sender_id.eq.${user?.id},receiver_id.eq.${client.profile_id})`)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          return {
            ...client,
            unread_count: unreadCount || 0,
            last_message: lastMessage?.content || '',
            last_message_time: lastMessage?.created_at || client.created_at,
            is_online: Math.random() > 0.5 // Mock online status
          };
        })
      );

      setClients(enrichedClients);
      
      // Auto-select first client if none selected
      if (!selectedClient && enrichedClients.length > 0) {
        setSelectedClient(enrichedClients[0]);
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedClient) return;

    try {
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:user_profiles!messages_sender_id_fkey(id, full_name, role),
          receiver:user_profiles!messages_receiver_id_fkey(id, full_name, role)
        `)
        .or(`and(sender_id.eq.${selectedClient.profile_id},receiver_id.eq.${user?.id}),and(sender_id.eq.${user?.id},receiver_id.eq.${selectedClient.profile_id})`)
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
    }
  };

  const markMessagesAsRead = async () => {
    if (!selectedClient) return;

    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', selectedClient.profile_id)
        .eq('receiver_id', user?.id)
        .eq('is_read', false);
      
      // Update client unread count
      setClients(prev => 
        prev.map(client => 
          client.id === selectedClient.id 
            ? { ...client, unread_count: 0 }
            : client
        )
      );
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user) return;

    const channel = supabase
      .channel('consultant-messages')
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
          
          // Add to messages if it's from selected client
          if (selectedClient && newMessage.sender_id === selectedClient.profile_id) {
            setMessages(prev => [...prev, newMessage]);
          }
          
          // Update client list
          fetchClients();
          
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
    if (!newMessage.trim() || !selectedClient || sending) return;

    try {
      setSending(true);
      
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user?.id,
          receiver_id: selectedClient.profile_id,
          content: newMessage,
          original_language: profile?.preferred_language || 'en',
          target_language: selectedClient.profile.preferred_language || 'en',
          is_translated: false
        });

      if (error) {
        throw error;
      }

      setNewMessage('');
      fetchMessages();
      fetchClients();
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const translateMessage = async (messageId: string, content: string) => {
    try {
      setTranslating(messageId);
      
      const targetLang = profile?.preferred_language || 'en';
      
      const { data, error } = await supabase.functions.invoke('translate-message', {
        body: {
          text: content,
          target_lang: targetLang.toUpperCase()
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
          target_language: targetLang
        })
        .eq('id', messageId);

      fetchMessages();
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setTranslating(null);
    }
  };

  const handleMassMessage = async () => {
    if (!massMessageData.message.trim() || selectedClients.length === 0) {
      alert('Please enter a message and select at least one client');
      return;
    }

    try {
      setSendingMassMessage(true);

      // Send message to each selected client
      const messagePromises = selectedClients.map(async (clientProfileId) => {
        const { error } = await supabase
          .from('messages')
          .insert({
            sender_id: user?.id,
            receiver_id: clientProfileId,
            content: massMessageData.message,
            original_language: profile?.preferred_language || 'en',
            target_language: 'en', // Will be auto-detected/translated
            is_translated: false
          });

        if (error) throw error;

        // Send notification
        await supabase.functions.invoke('notify', {
          body: {
            recipient_id: clientProfileId,
            type: 'mass_message_sent',
            payload: {
              subject: massMessageData.subject,
              consultant_name: profile?.full_name,
              priority: massMessageData.priority
            },
            email_notification: massMessageData.send_email
          }
        });
      });

      await Promise.all(messagePromises);

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'message_sent',
          description: `Sent mass message to ${selectedClients.length} clients`,
          payload: {
            subject: massMessageData.subject,
            message: massMessageData.message,
            recipient_count: selectedClients.length,
            priority: massMessageData.priority
          }
        });

      alert(`Message sent to ${selectedClients.length} clients successfully!`);
      setShowMassMessage(false);
      setSelectedClients([]);
      setMassMessageData({
        subject: '',
        message: '',
        priority: 'medium',
        send_email: true,
        translate_message: true
      });
      fetchClients();
    } catch (err) {
      console.error('Mass message error:', err);
      alert('Failed to send mass message. Please try again.');
    } finally {
      setSendingMassMessage(false);
    }
  };

  const handleClientSelection = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSelectAllClients = () => {
    const visibleClientIds = filteredClients.map(client => client.profile_id);
    setSelectedClients(
      selectedClients.length === visibleClientIds.length ? [] : visibleClientIds
    );
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

  const filteredClients = clients.filter(client =>
    client.profile.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Messages - Consultant Dashboard</title>
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

  return (
    <>
      <Helmet>
        <title>Messages - Consultant Dashboard</title>
      </Helmet>
      
      <div className="h-full flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Client List Sidebar */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            {/* Mass Communication Controls */}
            {selectedClients.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-800">
                    {selectedClients.length} clients selected for mass message
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowMassCommunication(true)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <Megaphone className="w-3 h-3 mr-1 inline" />
                      Advanced Campaign
                    </button>
                    <button
                      onClick={() => setSelectedClients([])}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Quick Mass Communication Button */}
            <div className="mb-4">
              <button
                onClick={() => setShowMassCommunication(true)}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Megaphone className="w-5 h-5" />
                  <span className="font-semibold">Mass Communication Center</span>
                </div>
                <div className="text-xs text-blue-100 mt-1">
                  Templates • Campaigns • Analytics
                </div>
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mt-3 flex justify-between items-center">
              <button
                onClick={handleSelectAllClients}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {selectedClients.length === filteredClients.length && filteredClients.length > 0 ? 'Deselect All' : 'Select All'}
              </button>
              <span className="text-xs text-gray-500">
                Select multiple clients for mass messaging
              </span>
            </div>
          </div>

          {/* Client List */}
          <div className="flex-1 overflow-y-auto">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    selectedClient?.id === client.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <input
                      type="checkbox"
                      checked={selectedClients.includes(client.profile_id)}
                      onChange={() => handleClientSelection(client.profile_id)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        {client.is_online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {client.profile.full_name}
                          </h3>
                          {client.unread_count > 0 && (
                            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                              {client.unread_count}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">{client.company_name}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {client.last_message || 'No messages yet'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {client.last_message_time ? formatTime(client.last_message_time) : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No clients found</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedClient ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    {selectedClient.is_online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedClient.profile.full_name}</h3>
                    <p className="text-sm text-gray-600">
                      {selectedClient.company_name} • {selectedClient.is_online ? 'Online' : 'Offline'}
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

                  <button
                    onClick={() => setShowLanguageSettings(true)}
                    className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                    title="Language Settings"
                  >
                    <Globe className="w-4 h-4" />
                  </button>
                      key={message.id}
                      className={`flex ${isMyMessage(message) ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        isMyMessage(message)
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}>
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-sm">{message.content}</p>
                          {!isMyMessage(message) && (
                            <button
                              onClick={() => translateMessage(message.id, message.content)}
                              disabled={translating === message.id}
                              className="ml-2 text-blue-600 hover:text-blue-700"
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
                        Send your first message to {selectedClient.profile.full_name}
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
                      placeholder={`Message ${selectedClient.profile.full_name}...`}
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
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Client</h3>
                <p className="text-gray-600">Choose a client from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>

        {/* Mass Message Modal */}
        {showMassMessage && !showMassCommunication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Send Mass Message to {selectedClients.length} Clients
                </h2>
                <button
                  onClick={() => setShowMassMessage(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject/Title *
                  </label>
                  <input
                    type="text"
                    value={massMessageData.subject}
                    onChange={(e) => setMassMessageData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Monthly Document Submission Reminder"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={massMessageData.message}
                    onChange={(e) => setMassMessageData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Type your message that will be sent to all selected clients..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={massMessageData.priority}
                      onChange={(e) => setMassMessageData(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={massMessageData.send_email}
                        onChange={(e) => setMassMessageData(prev => ({ ...prev, send_email: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-900">Send email notification</span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={massMessageData.translate_message}
                        onChange={(e) => setMassMessageData(prev => ({ ...prev, translate_message: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-900">Auto-translate to client languages</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-yellow-900 mb-2">📤 Mass Messaging Info</h4>
                  <ul className="text-xs text-yellow-800 space-y-1">
                    <li>• Messages will be sent to {selectedClients.length} selected clients</li>
                    <li>• Auto-translation will adapt message to each client's language</li>
                    <li>• Email notifications will be sent if enabled</li>
                    <li>• All messages are logged for audit purposes</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => setShowMassMessage(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMassMessage}
                  disabled={sendingMassMessage || !massMessageData.message.trim() || selectedClients.length === 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {sendingMassMessage ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2 inline" />
                      Send to {selectedClients.length} Clients
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Mass Communication Manager */}
        <MassCommunicationManager
          isOpen={showMassCommunication}
          onClose={() => setShowMassCommunication(false)}
          preSelectedClients={selectedClients}
        />

        {/* Language Settings Modal */}
        <ConsultantLanguageSettingsModal
          isOpen={showLanguageSettings}
          onClose={() => setShowLanguageSettings(false)}
          onSave={() => {
            // Refresh consultant language info display
            setShowLanguageSettings(false);
          }}
        />
      </div>
    </>
  );
};

export default ConsultantMessages;