import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  CreditCard, 
  MessageCircle, 
  FileText,
  Users,
  BarChart3,
  Settings,
  Globe
} from 'lucide-react';

interface QuickActionsProps {
  consultantId: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ consultantId }) => {
  const actions = [
    {
      name: 'Create Service',
      description: 'Add a new custom service',
      href: '/consultant/custom-services',
      icon: Plus,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      name: 'Send Payment Request',
      description: 'Request payment from client',
      href: '/consultant/payments',
      icon: CreditCard,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    {
      name: 'Message Clients',
      description: 'Communicate with your clients',
      href: '/consultant/communication',
      icon: MessageCircle,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    },
    {
      name: 'View Revenue',
      description: 'Track your earnings',
      href: '/consultant/revenue',
      icon: BarChart3,
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700'
    },
    {
      name: 'Legacy Orders',
      description: 'Manage assigned orders',
      href: '/consultant/legacy-orders',
      icon: FileText,
      color: 'from-indigo-500 to-indigo-600',
      hoverColor: 'hover:from-indigo-600 hover:to-indigo-700'
    },
    {
      name: 'Edit Country Pages',
      description: 'Customize your country pages',
      href: '/consultant/country-editor',
      icon: Globe,
      color: 'from-teal-500 to-teal-600',
      hoverColor: 'hover:from-teal-600 hover:to-teal-700'
    }
  ];

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center mr-3">
          <Settings className="h-4 w-4 text-white" />
        </div>
        Quick Actions
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <Link
            key={action.name}
            to={action.href}
            className={`group relative overflow-hidden bg-gradient-to-r ${action.color} ${action.hoverColor} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105`}
            style={{ animationDelay: `${index * 0.1}s` }}
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

      {/* Additional info */}
      <div className="mt-8 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-200">
        <h3 className="text-lg font-bold text-primary-900 mb-2">
          💡 Pro Tip
        </h3>
        <p className="text-primary-700">
          Create custom services for your legacy clients to increase your monthly recurring revenue. 
          Most consultants see a 40% increase in earnings within the first month.
        </p>
      </div>
    </div>
  );
};

export default QuickActions;