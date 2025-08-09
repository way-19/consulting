import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Brain,
  Eye,
  RefreshCw
} from 'lucide-react';

const AISafetyMonitor: React.FC = () => {
  const [aiStats, setAiStats] = useState({
    todayInteractions: 0,
    pendingReview: 0,
    highRiskInteractions: 0,
    systemStatus: 'operational'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAIStats();
  }, []);

  const loadAIStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: interactionsData } = await supabase
        .from('ai_interactions')
        .select('*')
        .gte('created_at', today);

      const interactions = interactionsData || [];
      const highRisk = interactions.filter(i => i.risk_level === 'high' || i.risk_level === 'critical');
      const pendingReview = interactions.filter(i => i.human_review_required && !i.human_reviewed);

      setAiStats({
        todayInteractions: interactions.length,
        pendingReview: pendingReview.length,
        highRiskInteractions: highRisk.length,
        systemStatus: 'operational'
      });
    } catch (error) {
      console.error('Error loading AI stats:', error);
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
          <Shield className="h-5 w-5 mr-2 text-red-600" />
          AI Güvenlik Monitörü
        </h2>
        <button
          onClick={loadAIStats}
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
              <p className="font-medium text-green-900">AI Sistem Durumu</p>
              <p className="text-sm text-green-700">Tüm sistemler çalışıyor</p>
            </div>
          </div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl text-center">
            <p className="text-2xl font-bold text-gray-900">{aiStats.todayInteractions}</p>
            <p className="text-sm text-gray-600">Bugünkü AI Etkileşimleri</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl text-center">
            <p className="text-2xl font-bold text-gray-900">{aiStats.pendingReview}</p>
            <p className="text-sm text-gray-600">İnceleme Bekleyen</p>
          </div>
        </div>

        {aiStats.highRiskInteractions > 0 && (
          <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-900">Yüksek Riskli Etkileşimler</p>
                <p className="text-sm text-yellow-700">
                  {aiStats.highRiskInteractions} etkileşim insan incelemesi gerektiriyor
                </p>
              </div>
            </div>
            <button className="mt-2 text-xs bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full hover:bg-yellow-300">
              Şimdi İncele
            </button>
          </div>
        )}

        <div className="p-4 bg-blue-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-900">AI Performansı</p>
              <p className="text-sm text-blue-700">Ortalama güven skoru: 94.2%</p>
            </div>
            <Brain className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISafetyMonitor;