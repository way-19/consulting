import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, User, Bot, Globe, Eye } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { supabase } from '@consulting19/supabase';
import { useAuth } from '@consulting19/shared';
import { useI18n } from '../../hooks/useI18n';
import ClientLayout from '../../components/layouts/ClientLayout';
import { Helmet } from 'react-helmet-async';

interface MessageThread {
  id: string;
  title: string;
  status: string;
  project: {
    title: string;
  } | null;
  participants: Array<{
    user: {
      full_name: string;
      role: string;
    };
    role: string;
  }>;
  last_message_at: string;
  unread_count: number;
}

interface Message {
  id: string;
  body_original: string;
  body_translated: any;
  from_lang: string;
  message_type: string;
  sender: {
    full_name: string;
    role: string;
  };
  created_at: string;
}

const ClientMessages = () => {
  const { user } = useAuth();
  const { t, formatRelativeTime, currentLanguage } = useI18n();
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showOriginal, setShowOriginal] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchThreads();
    }
  }, [user]);

  useEffect(() => {
    if (selectedThread) {
      fetchMessages(selectedThread.id);
    }
  }, [selectedThread]);

  const fetchThreads = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('message_threads')
        .select(`
          *,
          project:projects(title),
          participants:thread_participants(
            user:user_profiles(full_name, role),
            role
          )
        `)
        .eq('participants.user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching threads:', error);
      } else {
        setThreads(data || []);
        if (data && data.length > 0 && !selectedThread) {
          setSelectedThread(data[0]);
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (threadId: string) => {
    try {
      setMessagesLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:user_profiles!messages_sender_id_fkey(full_name, role)
        `)
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedThread || !user) return;

    try {
      setSending(true);
      
      // Insert message
      const { data, error } = await supabase
        .from('messages')
        .insert({
          thread_id: selectedThread.id,
          sender_id: user.id,
          body_original: newMessage,
          from_lang: currentLanguage,
          message_type: 'text'
        })
        .select(`
          *,
          sender:user_profiles!messages_sender_id_fkey(full_name, role)
        `)
        .single();

      if (error) {
        console.error('Error sending message:', error);
      } else {
        setMessages(prev => [...prev, data]);
        setNewMessage('');
        
        // Update thread timestamp
        await supabase
          .from('message_threads')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', selectedThread.id);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setSending(false);
    }
  };

  const getTranslatedMessage = (message: Message) => {
    if (!message.body_translated || !message.body_translated[currentLanguage]) {
      return message.body_original;
    }
    return message.body_translated[currentLanguage];
  };

  const hasTranslation = (message: Message) => {
    return message.body_translated && 
           message.body_translated[currentLanguage] && 
           message.from_lang !== currentLanguage;
  };

  if (loading) {
    return (
      <ClientLayout>
        <Helmet>
          <title>Messages - Consulting19</title>
        </Helmet>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <Helmet>
        <title>Messages - Consulting19</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">Communicate with your consultant and team</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Threads List */}
        <Card className="h-full">
          <Card.Header>
            <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="h-full overflow-y-auto">
              {threads.length > 0 ? (
                threads.map((thread) => (
                  <div
                    key={thread.id}
                    onClick={() => setSelectedThread(thread)}
                    className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedThread?.id === thread.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 text-sm">{thread.title}</h3>
                      {thread.unread_count > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                          {thread.unread_count}
                        </span>
                      )}
                    </div>
                    
                    {thread.project && (
                      <p className="text-xs text-gray-600 mb-2">
                        Project: {thread.project.title}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {thread.participants.map((participant, index) => (
                          <div key={index} className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium">
                              {participant.user.full_name.charAt(0)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatRelativeTime(thread.last_message_at)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No conversations yet</p>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        {/* Messages */}
        <div className="lg:col-span-2">
          {selectedThread ? (
            <Card className="h-full flex flex-col">
              <Card.Header>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">{selectedThread.title}</h2>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Auto-translate enabled</span>
                  </div>
                </div>
              </Card.Header>
              
              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messagesLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
                    ))}
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender.role === 'client' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                        message.sender.role === 'client' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender.role === 'client' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-600 text-white'
                        }`}>
                          {message.sender.role === 'client' ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                        </div>
                        <div className={`p-3 rounded-lg ${
                          message.sender.role === 'client'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm leading-relaxed">
                            {showOriginal === message.id ? message.body_original : getTranslatedMessage(message)}
                          </p>
                          
                          {hasTranslation(message) && (
                            <button
                              onClick={() => setShowOriginal(showOriginal === message.id ? null : message.id)}
                              className={`mt-2 text-xs flex items-center ${
                                message.sender.role === 'client' ? 'text-blue-200' : 'text-gray-500'
                              }`}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              {showOriginal === message.id ? 'Show translation' : 'Show original'}
                            </button>
                          )}
                          
                          <div className={`text-xs mt-2 ${
                            message.sender.role === 'client' ? 'text-blue-200' : 'text-gray-500'
                          }`}>
                            {formatRelativeTime(message.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <Card.Footer>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Button 
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    icon={Send}
                    loading={sending}
                  >
                    Send
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          ) : (
            <Card className="h-full">
              <Card.Body className="flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Select a Conversation
                  </h3>
                  <p className="text-gray-600">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </Card.Body>
            </Card>
          )}
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientMessages;