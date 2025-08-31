import React from 'react';
import { FileText, Globe, MessageSquare } from 'lucide-react';
import { Card } from '../../shared/components/ui';

const AdminContent = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
        <p className="text-gray-600">Manage global platform content and categories</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover>
          <Card.Body className="text-center">
            <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Global Service Categories
            </h3>
            <p className="text-gray-600 mb-4">
              Manage homepage service categories and descriptions
            </p>
            <div className="text-sm text-gray-500">
              Coming soon
            </div>
          </Card.Body>
        </Card>

        <Card hover>
          <Card.Body className="text-center">
            <FileText className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Static Pages
            </h3>
            <p className="text-gray-600 mb-4">
              Manage about, privacy, terms and other static pages
            </p>
            <div className="text-sm text-gray-500">
              Coming soon
            </div>
          </Card.Body>
        </Card>

        <Card hover>
          <Card.Body className="text-center">
            <MessageSquare className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Email Templates
            </h3>
            <p className="text-gray-600 mb-4">
              Manage system email templates and notifications
            </p>
            <div className="text-sm text-gray-500">
              Coming soon
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default AdminContent;