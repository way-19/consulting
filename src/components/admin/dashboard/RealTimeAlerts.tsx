import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MessageSquare,
  Shield,
  X,
  Eye
} from 'lucide-react';

const RealTimeAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const { data: alertsData } = await supabase
        .from('ai_monitoring_alerts')
        .select('*')
        .is('acknowledged_at', null)
        .order('created_at', { ascending: false })
        .limit(5);

      setAlerts(alertsData || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('ai_monitoring_alerts')
        .update({ 
          acknowledged_at: new Date().toISOString(),
          acknowledged_by: 'admin-user-id' // In real app, get from auth
        })
        .eq('id', alertId);

      if (error) throw error;
      loadAlerts();
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      case 'low': return CheckCircle;
      default: return MessageSquare;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
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
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
          Gerçek Zamanlı Uyarılar
        </h2>
        <button
          onClick={loadAlerts}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-gray-600">Bekleyen uyarı bulunmuyor.</p>
            <p className="text-sm text-gray-500 mt-2">Tüm sistemler normal çalışıyor.</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const SeverityIcon = getSeverityIcon(alert.severity);
            
            return (
              <div
                key={alert.id}
                className={`border rounded-xl p-4 ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <SeverityIcon className="h-5 w-5 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {alert.alert_type}
                      </h3>
                      <p className="text-sm text-gray-700 mb-2">
                        {alert.message}
                      </p>
                      <div className="text-xs text-gray-500">
                        {new Date(alert.created_at).toLocaleString('tr-TR')}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RealTimeAlerts;