import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { 
  Package, 
  DollarSign, 
  Calendar, 
  User,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';

interface LegacyOrderManagerProps {
  consultantId: string;
}

const LegacyOrderManager: React.FC<LegacyOrderManagerProps> = ({ consultantId }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadLegacyOrders();
  }, [consultantId]);

  const loadLegacyOrders = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('consultant-clients', {
        body: { consultantId, countryId: 1 },
      });
      if (error) throw error;
      // Mock legacy orders for now
      const mockOrders = ((data as any)?.data || []).map((client: any, index: number) => ({
        id: `order-${index}`,
        legacy_payment_id: 1000 + index,
        source_country_slug: 'georgia',
        integration_status: index === 0 ? 'completed' : 'pending',
        consultant_commission: '250.00',
        assignment_date: new Date().toISOString()
      }));
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error loading legacy orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Tamamlandı';
      case 'in_progress': return 'Devam Ediyor';
      case 'pending': return 'Bekliyor';
      default: return status;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.integration_status === filter;
    const matchesSearch = searchTerm === '' || 
      order.legacy_payment_id.toString().includes(searchTerm) ||
      order.source_country_slug?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const totalCommission = orders.reduce((sum, order) => 
    sum + parseFloat(order.consultant_commission || 0), 0
  );

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Package className="h-6 w-6 mr-3 text-orange-600" />
          Legacy Sipariş Yönetimi
        </h2>
        <button
          onClick={loadLegacyOrders}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-orange-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-900">{orders.length}</div>
          <div className="text-sm text-orange-700">Toplam Sipariş</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-900">
            {orders.filter(o => o.integration_status === 'completed').length}
          </div>
          <div className="text-sm text-green-700">Tamamlanan</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-900">${totalCommission.toFixed(2)}</div>
          <div className="text-sm text-blue-700">Toplam Komisyon</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Sipariş ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white"
          >
            <option value="all">Tüm Siparişler</option>
            <option value="pending">Bekleyen</option>
            <option value="in_progress">Devam Eden</option>
            <option value="completed">Tamamlanan</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Bu kriterlere uygun sipariş bulunamadı.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-xl p-4 hover:border-orange-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Package className="h-6 w-6 text-orange-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">
                        Sipariş #{order.legacy_payment_id}
                      </h3>
                      <span className="text-sm text-gray-500">
                        • {order.source_country_slug}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">
                        Atanma: {order.assignment_date ? new Date(order.assignment_date).toLocaleDateString('tr-TR') : 'Bekliyor'}
                      </span>
                      {order.commission_calculated && (
                        <span className="text-sm text-green-600 font-medium">
                          Komisyon: ${order.consultant_commission}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.integration_status)}`}>
                    {getStatusLabel(order.integration_status)}
                  </span>
                  <div className="mt-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LegacyOrderManager;