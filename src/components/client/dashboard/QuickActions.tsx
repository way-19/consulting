import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings, 
  FileText, 
  CreditCard, 
  MessageCircle,
  Plus,
  Search,
  Upload,
  Phone
} from 'lucide-react';

interface QuickActionsProps {
  client: any;
}

const QuickActions: React.FC<QuickActionsProps> = ({ client }) => {
  const actions = [
    {
      name: 'Browse Services',
      description: 'Explore available consulting services',
      href: '/client/services',
      icon: Settings,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      name: 'New Application',
      description: 'Start a new service application',
      href: '/client/applications',
      icon: Plus,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    {
      name: 'View Payments',
      description: 'Manage payments and invoices',
      href: '/client/payments',
      icon: CreditCard,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    },
    {
      name: 'Upload Documents',
      description: 'Submit required documents',
      href: '/client/documents',
      icon: Upload,
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700'
    },
    {
      name: 'Contact Consultant',
      description: 'Message your assigned consultant',
      href: '/client/communication',
      icon: MessageCircle,
      color: 'from-indigo-500 to-indigo-600',
      hoverColor: 'hover:from-indigo-600 hover:to-indigo-700'
    },
    {
      name: 'Search Services',
      description: 'Find specific services',
      href: '/client/services',
      icon: Search,
      color: 'from-teal-500 to-teal-600',
      hoverColor: 'hover:from-teal-600 hover:to-teal-700'
    }
  ];

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center mr-3">
          <Plus className="h-4 w-4 text-white" />
        </div>
        Quick Actions
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Link
            key={action.name}
            to={action.href}
            className={`group relative overflow-hidden bg-gradient-to-r ${action.color} ${action.hoverColor} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105`}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-3">
                <action.icon className="h-6 w-6 mr-3" />
                <h3 className="font-semibold text-lg">{action.name}</h3>
              </div>
              <p className="text-white/90 text-sm">{action.description}</p>
            </div>

            {/* Hover effect */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500"></div>
          </Link>
        ))}
      </div>

      {/* Welcome message for new clients */}
      {(!applications.length && !legacyOrders.length) && (
        <div className="mt-8 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-200">
          <h3 className="text-lg font-bold text-primary-900 mb-2">
            🎉 Welcome to CONSULTING19!
          </h3>
          <p className="text-primary-700 mb-4">
            You're all set up! Start by browsing our services or contact a consultant for personalized guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/client/services"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <Settings className="mr-2 h-4 w-4" />
              Browse Services
            </Link>
            <Link
              to="/client/communication"
              className="inline-flex items-center px-4 py-2 bg-white text-primary-600 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors font-medium"
            >
              <Phone className="mr-2 h-4 w-4" />
              Contact Support
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;