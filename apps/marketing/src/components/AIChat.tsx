import React from 'react';
import { Zap, Send, X } from 'lucide-react';
import { Button, Card } from '@consulting19/shared';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  onMessageChange: (message: string) => void;
}

const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose, message, onMessageChange }) => {
  const quickQuestions = [
    'I want to start a tech company',
    'Looking for tax optimization',
    'Need EU market access',
    'Interested in crypto business',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full max-h-[80vh] overflow-hidden">
        <Card.Header>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">AI Oracle Assistant</h3>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </Card.Header>
        <Card.Body className="h-96 flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800 text-sm">
                Hello! I'm your AI Oracle assistant. How can I help with your international business expansion?
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 mb-2">Quick questions:</p>
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => onMessageChange(question)}
                  className="w-full text-left p-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button icon={Send} disabled={!message.trim()}>
              Send
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AIChat;