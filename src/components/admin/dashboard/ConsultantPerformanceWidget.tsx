import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { 
  Users, 
  Star, 
  TrendingUp,
  DollarSign,
  RefreshCw
} from 'lucide-react';

const ConsultantPerformanceWidget: React.FC = () => {
  const [topConsultants, setTopConsultants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopConsultants();
  }, []);

  const loadTopConsultants = async () => {
    try {
      const { data: consultantsData } = await supabase
        .from('consultant_performance_analytics')
        .select('*')
        .order('total_earnings', { ascending: false })
        .limit(5);

      setTopConsultants(consultantsData || []);
    } catch (error) {
      console.error('Error loading top consultants:', error);
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
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
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
          <Users className="h-5 w-5 mr-2 text-purple-600" />
          En İyi Danışmanlar
        </h2>
        <button
          onClick={loadTopConsultants}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        {topConsultants.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Danışman performans verisi yükleniyor...</p>
          </div>
        ) : (
          topConsultants.map((consultant, index) => (
            <div key={consultant.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-600">#{index + 1}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{consultant.flag_emoji}</span>
                  <div>
                    <p className="font-medium text-gray-900">
                      {consultant.first_name} {consultant.last_name}
                    </p>
                    <p className="text-sm text-gray-600">{consultant.country_name}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-semibold text-gray-900">
                    {consultant.performance_rating || '4.8'}
                  </span>
                </div>
                <p className="text-sm text-green-600 font-medium">
                  ${(consultant.total_earnings || 0).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConsultantPerformanceWidget;