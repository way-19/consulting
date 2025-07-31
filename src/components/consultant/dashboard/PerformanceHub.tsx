import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Clock,
  Award,
  Target
} from 'lucide-react';

interface PerformanceHubProps {
  consultantId: string;
}

const PerformanceHub: React.FC<PerformanceHubProps> = ({ consultantId }) => {
  const [metrics, setMetrics] = useState({
    monthlyRevenue: 0,
    activeClients: 0,
    successRate: 94.2,
    avgResponseTime: '2.3 hours'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Get monthly revenue from commission ledger
        const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const { data: revenueData } = await supabase
          .from('consultant_commission_ledger')
          .select('consultant_commission')
          .eq('consultant_id', consultantId)
          .gte('created_at', thisMonthStart.toISOString());

        const monthlyRevenue = revenueData?.reduce((sum, item) => 
          sum + parseFloat(item.consultant_commission || 0), 0) || 0;

        // Get active clients count
        const { data: clientsData, count: activeClients } = await supabase
          .from('legacy_order_integrations')
          .select('*', { count: 'exact' })
          .eq('consultant_id', consultantId)
          .in('status', ['assigned', 'in_progress']);

        setMetrics({
          monthlyRevenue,
          activeClients: activeClients || 0,
          successRate: 94.2, // Calculate from actual data
          avgResponseTime: '2.3 hours' // Calculate from message response times
        });
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [consultantId]);

  const metricCards = [
    {
      name: 'Monthly Revenue',
      value: `$${metrics.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      name: 'Active Clients',
      value: metrics.activeClients.toString(),
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      name: 'Success Rate',
      value: `${metrics.successRate}%`,
      icon: Award,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      name: 'Avg Response Time',
      value: metrics.avgResponseTime,
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center mr-3">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          Performance Overview
        </h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
       
      {/* Metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <div
            key={metric.name}
            className={`${metric.bgColor} rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center">
              <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <metric.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional insights */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-200">
          <h3 className="text-lg font-bold text-primary-900 mb-2">
            🎯 This Month's Goal
          </h3>
          <p className="text-primary-700">
            You're 78% towards your monthly revenue target of $5,000
          </p>
          <div className="mt-3 w-full bg-primary-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full" style={{ width: '78%' }}></div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <h3 className="text-lg font-bold text-green-900 mb-2">
            📈 Growth Trend
          </h3>
          <p className="text-green-700">
            +23% increase in revenue compared to last month
          </p>
          <div className="mt-3 flex items-center text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">Excellent progress!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceHub;