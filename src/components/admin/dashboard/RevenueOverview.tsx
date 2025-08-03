import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { 
  DollarSign, 
  TrendingUp, 
  BarChart3,
  RefreshCw
} from 'lucide-react';

const RevenueOverview: React.FC = () => {
  const [revenueData, setRevenueData] = useState({
    legacyOrders: 0,
    platformServices: 0,
    customServices: 0,
    consultantShare: 65
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRevenueData();
  }, []);

  const loadRevenueData = async () => {
    try {
      const { data: revenueData } = await supabase
        .from('revenue_analytics')
        .select('*')
        .order('month', { ascending: false })
        .limit(1)
        .single();

      if (revenueData) {
        setRevenueData({
          legacyOrders: parseFloat(revenueData.total_revenue || 0),
          platformServices: parseFloat(revenueData.platform_commission || 0),
          customServices: parseFloat(revenueData.consultant_commission || 0),
          consultantShare: 65
        });
      }
    } catch (error) {
      console.error('Error loading revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
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
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
          Gelir Analitikleri
        </h2>
        <button
          onClick={loadRevenueData}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">${revenueData.legacyOrders.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Legacy Siparişler</p>
          <p className="text-xs text-green-600 mt-1">+15% bu ay</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">${revenueData.platformServices.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Platform Hizmetleri</p>
          <p className="text-xs text-green-600 mt-1">+28% bu ay</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">${revenueData.customServices.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Özel Hizmetler</p>
          <p className="text-xs text-green-600 mt-1">+42% bu ay</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{revenueData.consultantShare}%</p>
          <p className="text-sm text-gray-600">Danışman Payı</p>
          <p className="text-xs text-gray-600 mt-1">Standart oran</p>
        </div>
      </div>
    </div>
  );
};

export default RevenueOverview;