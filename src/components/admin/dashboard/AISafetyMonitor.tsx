import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { 
  Shield, 
  AlertTriangle, 
  Brain, 
  Eye,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const AISafetyMonitor: React.FC = () => {
  const [safetyData, setSafetyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSafetyData = async () => {
      try {
        // Get recent AI interactions with risk analysis
        const { data: interactions } = await supabase
          .from('ai_interactions')
          .select('risk_level, confidence_score, human_review_required, legal_review_required, emergency_stopped')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

        // Process safety metrics
        const metrics = {
          totalInteractions: interactions?.length || 0,
          highRisk: interactions?.filter(i => i.risk_level === 'high').length || 0,
          mediumRisk: interactions?.filter(i => i.risk_level === 'medium').length || 0,
          lowRisk: interactions?.filter(i => i.risk_level === 'low').length || 0,
          humanReviewRequired: interactions?.filter(i => i.human_review_required).length || 0,
          legalReviewRequired: interactions?.filter(i => i.legal_review_required).length || 0,
          emergencyStopped: interactions?.filter(i => i.emergency_stopped).length || 0,
          avgConfidence: interactions?.reduce((sum, i) => sum + (i.confidence_score || 0), 0) / (interactions?.length || 1)
        };

        setSafetyData(metrics);
      } catch (error) {
        console.error('Error loading safety data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSafetyData();
    const interval = setInterval(loadSafetyData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const safetyMetrics = [
    {
      name: 'Total Interactions (24h)',
      value: safetyData?.totalInteractions || 0,
      icon: Brain,
      color: 'blue'
    },
    {
      name: 'High Risk Interactions',
      value: safetyData?.highRisk || 0,
      icon: AlertTriangle,
      color: safetyData?.highRisk > 0 ? 'red' : 'green',
      alert: safetyData?.highRisk > 5
    },
    {
      name: 'Human Review Required',
      value: safetyData?.humanReviewRequired || 0,
      icon: Eye,
      color: 'yellow'
    },
    {
      name: 'Average Confidence',
      value: `${(safetyData?.avgConfidence * 100 || 0).toFixed(1)}%`,
      icon: safetyData?.avgConfidence > 0.8 ? TrendingUp : TrendingDown,
      color: safetyData?.avgConfidence > 0.8 ? 'green' : 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      red: 'bg-red-50 text-red-600',
      yellow: 'bg-yellow-50 text-yellow-600',
      orange: 'bg-orange-50 text-orange-600'
    };
    return colorMap[color] || 'bg-gray-50 text-gray-600';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Shield className="h-6 w-6 text-green-500 mr-2" />
          AI Safety Monitor
        </h2>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
          <span className="text-sm text-gray-500">Live Monitoring</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {safetyMetrics.map((metric) => (
          <div 
            key={metric.name} 
            className={`p-4 rounded-xl ${getColorClasses(metric.color)} ${
              metric.alert ? 'ring-2 ring-red-500 ring-opacity-50' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-75">{metric.name}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
              </div>
              <metric.icon className="h-8 w-8 opacity-75" />
            </div>
            {metric.alert && (
              <div className="mt-2 text-xs font-medium text-red-600">
                ⚠️ Requires Attention
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Emergency controls */}
      {safetyData?.emergencyStopped > 0 && (
        <div className="mt-6 bg-red-100 border border-red-500 rounded-xl p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800 font-medium">
              {safetyData.emergencyStopped} AI interactions have been emergency stopped
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISafetyMonitor;