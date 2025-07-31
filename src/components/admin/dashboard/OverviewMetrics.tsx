import React from 'react';
import { 
  DollarSign, 
  Users, 
  FileText, 
  Shield,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

interface OverviewMetricsProps {
  data: any;
}

const OverviewMetrics: React.FC<OverviewMetricsProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-xl p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      name: 'Monthly Platform Revenue',
      value: `$${data.monthly_platform_revenue?.toLocaleString() || '0'}`,
      change: '+12%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      name: 'Active Consultants',
      value: data.active_consultants || '0',
      change: '+2',
      changeType: 'increase',
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      name: 'Legacy Orders (30d)',
      value: data.monthly_legacy_orders || '0',
      change: '+8%',
      changeType: 'increase',
      icon: FileText,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      name: 'AI High-Risk Interactions',
      value: data.high_risk_ai_interactions || '0',
      change: data.high_risk_ai_interactions > 0 ? 'ALERT' : 'Safe',
      changeType: data.high_risk_ai_interactions > 0 ? 'decrease' : 'neutral',
      icon: data.high_risk_ai_interactions > 0 ? AlertTriangle : Shield,
      color: data.high_risk_ai_interactions > 0 ? 'red' : 'green',
      bgColor: data.high_risk_ai_interactions > 0 ? 'bg-red-50' : 'bg-green-50',
      iconColor: data.high_risk_ai_interactions > 0 ? 'text-red-600' : 'text-green-600'
    },
    {
      name: 'Total Clients',
      value: data.total_clients || '0',
      change: '+15%',
      changeType: 'increase',
      icon: Users,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    },
    {
      name: 'Pending Payments',
      value: data.pending_payment_requests || '0',
      change: data.pending_payment_requests > 10 ? 'High' : 'Normal',
      changeType: data.pending_payment_requests > 10 ? 'decrease' : 'neutral',
      icon: DollarSign,
      color: data.pending_payment_requests > 10 ? 'yellow' : 'green',
      bgColor: data.pending_payment_requests > 10 ? 'bg-yellow-50' : 'bg-green-50',
      iconColor: data.pending_payment_requests > 10 ? 'text-yellow-600' : 'text-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <div 
          key={metric.name} 
          className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center">
            <div className={`flex-shrink-0 ${metric.bgColor} rounded-xl p-3 shadow-lg`}>
              <metric.icon className={`h-6 w-6 ${metric.iconColor}`} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {metric.name}
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </div>
                  {metric.change && (
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      metric.changeType === 'increase' ? 'text-green-600' :
                      metric.changeType === 'decrease' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {metric.changeType === 'increase' && (
                        <TrendingUp className="self-center flex-shrink-0 h-4 w-4 mr-1" />
                      )}
                      {metric.change}
                    </div>
                  )}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewMetrics;