import React, { useState } from 'react';
import { MessageCircle, Send, User, Bot } from 'lucide-react';
import { Card, Button } from '../../../packages/ui/src';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

interface Message {
  id: string;
  sender: 'client' | 'consultant';
  content: string;
  timestamp: string;
  read: boolean;
}

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState('1');
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: '1',
      name: 'Ahmed Al-Rashid',
      role: 'UAE Business Specialist',
      lastMessage: 'Your bank account opening is progressing well...',
      timestamp: '2 hours ago',
      unread: 2,
      avatar: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: '2',
      name: 'Maria Kask',
      role: 'Estonia Digital Business Expert',
      lastMessage: 'Your e-Residency application has been approved!',
      timestamp: '1 day ago',
      unread: 0,
      avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=200'
    }
  ];

  const messages: Message[] = [
    {
      id: '1',
      sender: 'consultant',
      content: 'Hello! I\'ve received your documents for the UAE company formation. Everything looks good and we can proceed with the registration.',
      timestamp: '10:30 AM',
      read: true
    },
    {
      id: '2',
      sender: 'client',
      content: 'Great! How long will the process take?',
      timestamp: '10:35 AM',
      read: true
    },
    {
      id: '3',
      sender: 'consultant',
      content: 'The DIFC registration typically takes 7-10 business days. I\'ll keep you updated on the progress.',
      timestamp: '10:40 AM',
      read: true
    },
    {
      id: '4',
      sender: 'consultant',
      content: 'Your bank account opening is progressing well. The bank has requested one additional document - a utility bill from your home country.',
      timestamp: '2 hours ago',
      read: false
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 flex">
          {/* Conversations List */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 ${
                    selectedConversation === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={conversation.avatar}
                      alt={conversation.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-900 truncate">
                          {conversation.name}
                        </h3>
                        {conversation.unread > 0 && (
                          <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-blue-600">{conversation.role}</p>
                      <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                      <p className="text-xs text-gray-400">{conversation.timestamp}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={conversations.find(c => c.id === selectedConversation)?.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {conversations.find(c => c.id === selectedConversation)?.name}
                  </h3>
                  <p className="text-sm text-blue-600">
                    {conversations.find(c => c.id === selectedConversation)?.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                    message.sender === 'client' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'client' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {message.sender === 'client' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`p-3 rounded-lg ${
                      message.sender === 'client'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'client' ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  icon={Send}
                  size="md"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Messages;