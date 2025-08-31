import React from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Card, Button } from '../../shared/components/ui';
import { useLanguage } from '../../shared/contexts/LanguageContext';

const ClientMessages = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600">Communicate with your consultant and support team</p>
      </div>

      <Card>
        <Card.Body className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Messaging System Coming Soon
          </h3>
          <p className="text-gray-600 mb-6">
            Real-time messaging with your consultant will be available here
          </p>
          <Button icon={Send}>
            Contact Support
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ClientMessages;