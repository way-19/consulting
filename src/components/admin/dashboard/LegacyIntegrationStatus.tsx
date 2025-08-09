import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { 
  Package, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  DollarSign,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

const LegacyIntegrationStatus: React.FC = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalCommission: 0,
    avgProcessingTime: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLegacyStats();
  }, []);

  const loadLegacyStats = async () => {
    try {
      const { data: ordersData } = await supabase
        .from('legacy_order_integrations')
        .select('*');

      const orders = ordersData || [];
      const completed = orders.filter(o => o.integration_status === 'completed');
      const pending = orders.filter(o => o.integration_status === 'pending');
      const totalCommission = orders.reduce((sum, order) => 
        sum + parseFloat(order.consultant_commission || 0), 0
      );

      setStats({
        totalOrders: orders.length,
        completedOrders: completed.length,
        pendingOrders: pending.length,
        totalCommission,
        avgProcessingTime: 3.2 // Mock data
      });
    } catch (error) {
      console.error('Error loading legacy stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Package className="h-5 w-5 mr-2 text-orange-600" />
          Legacy Entegrasyon Durumu
        </h2>
        <button
          onClick={loadLegacyStats}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Entegrasyon Durumu</p>
              <p className="text-sm text-green-700">Tüm sistemler çalışıyor</p>
            </div>
          </div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            <p className="text-sm text-gray-600">Toplam Sipariş</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
            <p className="text-sm text-gray-600">Tamamlanan</p>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-900">Toplam Komisyon</p>
              <p className="text-2xl font-bold text-blue-900">${stats.totalCommission.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        {stats.pendingOrders > 0 && (
          <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-900">Bekleyen Siparişler</p>
                <p className="text-sm text-yellow-700">{stats.pendingOrders} sipariş işlem bekliyor</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegacyIntegrationStatus;