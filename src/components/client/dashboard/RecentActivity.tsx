import React from 'react';
import { 
  Clock, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  MessageCircle,
  CreditCard,
  Calendar,
  Activity
} from 'lucide-react';

interface RecentActivityProps {
  applications: any[];
  legacyOrders: any[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({
  applications,
  legacyOrders
}) => {
  // Combine and sort all activities
  const activities = [
    ...applications.map(app => ({
      id: app.id,
      type: 'application',
      title: `Application ${app.status.replace('_', ' ')}`,
      description: `${app.service_type} - ${app.countries?.name}`,
      timestamp: app.updated_at || app.created_at,
      status: app.status,
      icon: getStatusIcon(app.status)
    })),
    ...legacyOrders.map(order => ({
      id: order.id,
      type: 'legacy_order',
      title: 'Legacy Order Updated',
      description: `Company Formation - ${order.source_country_slug}`,
      timestamp: order.assignment_date,
      status: order.integration_status,
      icon: FileText
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

  function getStatusIcon(status: string) {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'documents_required':
      case 'payment_required':
        return AlertTriangle;
      case 'processing':
        return Activity;
      default:
        return Clock;
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'documents_required':
      case 'payment_required':
        return 'text-red-600 bg-red-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  }

  function formatTimeAgo(timestamp: string) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return time.toLocaleDateString();
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
          <Activity className="h-4 w-4 text-white" />
        </div>
        Recent Activity
      </h2>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
          <p className="text-gray-500">Your activity will appear here as you use our services.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const IconComponent = activity.icon;
            return (
              <div
                key={`${activity.type}-${activity.id}-${index}`}
                className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
              >
                {/* Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(activity.status)}`}>
                  <IconComponent className="h-5 w-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {activity.title}
                    </h3>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                  
                  {/* Status badge */}
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                      {activity.status?.replace('_', ' ') || 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Action indicator */}
                <div className="flex-shrink-0">
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              </div>
            );
          })}

          {/* View all activity link */}
          <div className="pt-4 border-t border-gray-200">
            <Link
              to="/client/applications"
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Calendar className="mr-2 h-4 w-4" />
              View All Applications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;