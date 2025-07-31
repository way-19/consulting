import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { AlertTriangle, X, CheckCircle, Clock } from 'lucide-react';

const RealTimeAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const { data } = await supabase
          .from('ai_monitoring_alerts')
          .select('*')
          .is('acknowledged_at', null)
          .order('created_at', { ascending: false })
          .limit(5);

        setAlerts(data || []);
      } catch (error) {
        console.error('Error loading alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();

    // Set up real-time monitoring
    const subscription = supabase
      .channel('admin_alerts')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'ai_monitoring_alerts'
      }, (payload) => {
        setAlerts(current => [payload.new, ...current.slice(0, 4)]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const acknowledgeAlert = async (alertId: string) => {
    try {
      await supabase
        .from('ai_monitoring_alerts')
        .update({ 
          acknowledged_at: new Date().toISOString(),
          acknowledged_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', alertId);

      setAlerts(alerts.filter(alert => alert.id !== alertId));
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 border-red-500 text-red-800';
      case 'high':
        return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      default:
        return 'bg-blue-100 border-blue-500 text-blue-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return AlertTriangle;
      case 'medium':
        return Clock;
      default:
        return CheckCircle;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
        <div className="flex items-center">
          <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
          <div>
            <h3 className="text-lg font-medium text-green-900">All Systems Operational</h3>
            <p className="text-sm text-green-700">No active alerts or issues detected</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
          Real-Time System Alerts
        </h2>
        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
          {alerts.length} Active
        </span>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => {
          const SeverityIcon = getSeverityIcon(alert.severity);
          return (
            <div
              key={alert.id}
              className={`border-l-4 rounded-xl p-4 ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <SeverityIcon className="h-5 w-5 mr-3 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">
                      {alert.alert_type.replace('_', ' ').toUpperCase()}
                    </h4>
                    <p className="text-sm mt-1">{alert.message}</p>
                    <p className="text-xs mt-2 opacity-75">
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="ml-4 p-1 hover:bg-white/50 rounded-lg transition-colors"
                  title="Acknowledge Alert"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RealTimeAlerts;