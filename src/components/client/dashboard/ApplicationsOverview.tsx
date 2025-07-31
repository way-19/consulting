import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  FileText,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';

interface ApplicationsOverviewProps {
  applications: any[];
  legacyOrders: any[];
  clientId: string;
}

const ApplicationsOverview: React.FC<ApplicationsOverviewProps> = ({
  applications,
  legacyOrders,
  clientId
}) => {
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    in_progress: 0,
    completed: 0,
    requires_action: 0
  });

  useEffect(() => {
    const calculateCounts = () => {
      const counts = {
        pending: 0,
        in_progress: 0,
        completed: 0,
        requires_action: 0
      };

      // Count from new applications
      applications.forEach(app => {
        switch (app.status) {
          case 'submitted':
          case 'under_review':
            counts.pending++;
            break;
          case 'processing':
            counts.in_progress++;
            break;
          case 'completed':
            counts.completed++;
            break;
          case 'documents_required':
          case 'payment_required':
            counts.requires_action++;
            break;
        }
      });

      // Count from legacy orders
      legacyOrders.forEach(order => {
        switch (order.integration_status) {
          case 'assigned':
            counts.pending++;
            break;
          case 'in_progress':
            counts.in_progress++;
            break;
          case 'completed':
            counts.completed++;
            break;
          default:
            counts.requires_action++;
            break;
        }
      });

      setStatusCounts(counts);
    };

    calculateCounts();
  }, [applications, legacyOrders]);

  const statusCards = [
    {
      name: 'Pending Review',
      count: statusCounts.pending,
      icon: Clock,
      color: 'from-yellow-400 to-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-200'
    },
    {
      name: 'In Progress',
      count: statusCounts.in_progress,
      icon: TrendingUp,
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200'
    },
    {
      name: 'Action Required',
      count: statusCounts.requires_action,
      icon: AlertTriangle,
      color: 'from-red-400 to-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      borderColor: 'border-red-200'
    },
    {
      name: 'Completed',
      count: statusCounts.completed,
      icon: CheckCircle,
      color: 'from-green-400 to-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      borderColor: 'border-green-200'
    }
  ];

  // Get recent applications (mix of legacy and new)
  const recentItems = [
    ...applications.slice(0, 3).map(app => ({
      ...app,
      type: 'application',
      title: `${app.service_type} - ${app.countries?.name}`,
      date: app.created_at
    })),
    ...legacyOrders.slice(0, 2).map(order => ({
      ...order,
      type: 'legacy_order',
      title: `Company Formation - ${order.source_country_slug}`,
      date: order.assignment_date
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Status overview cards */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Application Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statusCards.map((card) => (
            <div key={card.name} className={`${card.bgColor} ${card.borderColor} border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
              <div className="flex items-center">
                <div className={`flex-shrink-0 bg-gradient-to-r ${card.color} rounded-xl p-3 shadow-lg`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{card.name}</p>
                  <p className={`text-3xl font-bold ${card.textColor}`}>{card.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent applications */}
      <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary-600" />
              Recent Applications
            </h2>
            <Link
              to="/client/applications"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center"
            >
              View all
              <TrendingUp className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {recentItems.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-500 mb-6">Get started by browsing our services</p>
              <Link
                to="/client/services"
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Settings className="mr-2 h-4 w-4" />
                Browse Services
              </Link>
            </div>
          ) : (
            recentItems.map((item, index) => (
              <div key={`${item.type}-${item.id || index}`} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'completed' ? 'bg-green-100 text-green-800' :
                        item.status === 'in_progress' || item.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        item.status === 'documents_required' || item.status === 'payment_required' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status?.replace('_', ' ') || 'Pending'}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {item.type === 'legacy_order' ? 'Legacy Order' : 'Platform Application'}
                      </span>
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>

                    {item.consultant && (
                      <div className="mt-1 text-sm text-gray-500 flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        Consultant: {item.consultant?.first_name} {item.consultant?.last_name}
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex space-x-2">
                    <Link
                      to={item.type === 'legacy_order' 
                        ? `/client/applications?legacy=${item.legacy_payment_id}` 
                        : `/client/applications/${item.id}`
                      }
                      className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      View Details
                    </Link>
                    
                    {(item.status === 'documents_required' || item.status === 'payment_required') && (
                      <Link
                        to={item.status === 'payment_required' ? '/client/payments' : '/client/documents'}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-sm"
                      >
                        {item.status === 'payment_required' ? 'Pay Now' : 'Upload Docs'}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationsOverview;