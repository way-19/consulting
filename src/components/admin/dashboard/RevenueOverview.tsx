import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  PieChart,
  BarChart3
} from 'lucide-react';

const RevenueOverview: React.FC = () => {
  const [revenueData, setRevenueData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRevenueData = async () => {
      try {
        // Get current month revenue analytics
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
        
        const { data } = await supabase
          .from('revenue_analytics')
          .select('*')
          .gte('month', `${currentMonth}-01`)
          .order('month', { ascending: false });

        // Process revenue by source
        const revenueBySource = data?.reduce((acc, item) => {
          if (!acc[item.revenue_source]) {
            acc[item.revenue_source] = {
              total_revenue: 0,
              platform_commission: 0,
              consultant_commission: 0,
              transaction_count: 0
            };
          }
          acc[item.revenue_source].total_revenue += parseFloat(item.total_revenue || 0);
          acc[item.revenue_source].platform_commission += parseFloat(item.platform_commission || 0);
          acc[item.revenue_source].consultant_commission += parseFloat(item.consultant_commission || 0);
          acc[item.revenue_source].transaction_count += item.transaction_count || 0;
          return acc;
        }, {});

        setRevenueData(revenueBySource);
      } catch (error) {
        console.error('Error loading revenue data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRevenueData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const revenueSourceConfig = {
    legacy_order: {
      name: 'Legacy Orders',
      icon: BarChart3,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    custom_service: {
      name: 'Custom Services',
      icon: PieChart,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    platform_application: {
      name: 'Platform Applications',
      icon: TrendingUp,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  };

  const totalRevenue = Object.values(revenueData || {}).reduce(
    (sum: number, source: any) => sum + parseFloat(source.total_revenue || 0), 0
  );

  const totalPlatformCommission = Object.values(revenueData || {}).reduce(
    (sum: number, source: any) => sum + parseFloat(source.platform_commission || 0), 0
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <DollarSign className="h-6 w-6 text-green-500 mr-2" />
          Revenue Overview
        </h2>
        <span className="text-sm text-gray-500">Current Month</span>
      </div>

      {/* Total revenue summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Total Revenue</p>
              <p className="text-2xl font-bold text-green-900">${totalRevenue.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Platform Commission</p>
              <p className="text-2xl font-bold text-blue-900">${totalPlatformCommission.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Revenue by source */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Revenue by Source</h3>
        {Object.entries(revenueData || {}).map(([source, data]: [string, any]) => {
          const config = revenueSourceConfig[source] || {
            name: source,
            icon: BarChart3,
            color: 'gray',
            bgColor: 'bg-gray-50',
            textColor: 'text-gray-600'
          };

          return (
            <div key={source} className={`${config.bgColor} rounded-xl p-4 border border-gray-200`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <config.icon className={`h-6 w-6 ${config.textColor} mr-3`} />
                  <div>
                    <h4 className="font-semibold text-gray-900">{config.name}</h4>
                    <p className="text-sm text-gray-600">{data.transaction_count} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    ${parseFloat(data.total_revenue || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Platform: ${parseFloat(data.platform_commission || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {Object.keys(revenueData || {}).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No revenue data available for current month</p>
        </div>
      )}
    </div>
  );
};

export default RevenueOverview;