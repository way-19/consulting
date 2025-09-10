import React, { useState } from 'react';
import { Bot, X, Send, MessageSquare } from 'lucide-react';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  isMinimized: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  isOpen, 
  onClose, 
  onMinimize, 
  isMinimized 
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI assistant. I can help you navigate the client portal, explain features, and answer questions about your projects and services. How can I help you today?',
      timestamp: new Date(),
    }
  ]);

  const quickQuestions = [
    'How do I upload documents?',
    'Where can I see my projects?',
    'How to message my consultant?',
    'How do I pay my invoices?',
    'What services are available?',
    'How to schedule a meeting?'
  ];

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(message),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAIResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('document') || lowerMessage.includes('upload')) {
      return 'To upload documents, go to the File Manager section in your sidebar. You can drag and drop files or click the upload button. Accepted formats include PDF, DOCX, XLSX, JPG, and PNG.';
    }
    if (lowerMessage.includes('project')) {
      return 'You can view your projects in the Projects section. There you\'ll see project progress, associated tasks, and can communicate with your consultant about project details.';
    }
    if (lowerMessage.includes('message') || lowerMessage.includes('consultant')) {
      return 'To message your consultant, go to the Messages section. You can have real-time conversations and your consultant will typically respond within a few hours during business hours.';
    }
    if (lowerMessage.includes('pay') || lowerMessage.includes('invoice') || lowerMessage.includes('billing')) {
      return 'For payments, visit the Billing section where you can view pending invoices and pay securely through Stripe. All payments are encrypted and you\'ll receive email confirmations.';
    }
    if (lowerMessage.includes('service')) {
      return 'Available services from your consultant appear in the Services section. Once you have an assigned consultant, you\'ll see their custom service offerings there.';
    }
    if (lowerMessage.includes('meeting') || lowerMessage.includes('schedule')) {
      return 'To schedule meetings, go to the Meetings section. You can book consultation slots with your consultant with various duration options (30, 60, or 120 minutes).';
    }
    
    return 'I\'m here to help you navigate the client portal. You can ask me about documents, projects, messaging your consultant, payments, services, or scheduling meetings. What would you like to know more about?';
  };

  const handleQuickQuestion = (question: string) => {
    setMessage(question);
    sendMessage();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-blue-100">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onMinimize}
            className="text-white/80 hover:text-white transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs px-4 py-2 rounded-2xl ${
              msg.type === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}>
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Questions */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2 mb-3">
          <p className="text-xs font-medium text-gray-700">Quick questions:</p>
          <div className="grid grid-cols-1 gap-1">
            {quickQuestions.slice(0, 2).map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
        
        {/* Input */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;