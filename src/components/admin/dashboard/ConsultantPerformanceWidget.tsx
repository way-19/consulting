import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { 
  Users, 
  TrendingUp, 
  Star, 
  DollarSign,
  Award
} from 'lucide-react';

const ConsultantPerformanceWidget: React.FC = () => {
  const [consultants, setConsultants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopConsultants = async () => {
      try {
        const { data } = await supabase
          .from('consultant_performance_analytics')
          .select('*')
          .order('total_earnings', { ascending: false })
          .limit(5);

        setConsultants(data || []);
      } catch (error) {
        console.error('Error loading consultant performance:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTopConsultants();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Award className="h-6 w-6 text-yellow-500 mr-2" />
          Top Performers
        </h2>
        <span className="text-sm text-gray-500">This Month</span>
      </div>

      <div className="space-y-4">
        {consultants.map((consultant, index) => (
          <div 
            key={consultant.id} 
            className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index === 0 ? 'bg-yellow-100 text-yellow-600' :
                  index === 1 ? 'bg-gray-100 text-gray-600' :
                  index === 2 ? 'bg-orange-100 text-orange-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <span className="text-lg font-bold">#{index + 1}</span>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-3">{consultant.flag_emoji}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {consultant.first_name} {consultant.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">{consultant.country_name}</p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center text-green-600 font-bold">
                <DollarSign className="h-4 w-4 mr-1" />
                ${consultant.total_earnings?.toLocaleString() || '0'}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Star className="h-3 w-3 mr-1 text-yellow-500" />
                {consultant.avg_satisfaction?.toFixed(1) || '0.0'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {consultants.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No consultant performance data available</p>
        </div>
      )}
    </div>
  );
};

export default ConsultantPerformanceWidget;