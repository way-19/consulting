import React, { useState, useEffect } from 'react';
import { supabase } from '@consulting19/shared/src/lib/supabase';
import { AlertCircle, CheckCircle, Clock, User, FileText } from 'lucide-react';

interface Alert {
  id: string;
  consultant_id: string;
  alert_source_id: string;
  alert_type: string;
  is_resolved: boolean;
  resolved_at?: string;
  created_at: string;
}

interface ConsultantAlertsProps {
  consultantId: string;
}

const ConsultantAlerts: React.FC<ConsultantAlertsProps> = ({ consultantId }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState<string | null>(null);

  useEffect(() => {
    if (consultantId) {
      fetchAlerts();
    }
  }, [consultantId]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      
      const { data: alertsData, error } = await supabase
        .from('consultant_alerts')
        .select('*')
        .eq('consultant_id', consultantId)
        .eq('is_resolved', false)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }

      setAlerts(alertsData || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (alertId: string, alertType: string) => {
    try {
      setResolving(alertId);
      
      // Mark alert as resolved
      const { error: resolveError } = await supabase
        .from('consultant_alerts')
        .update({ 
          is_resolved: true,
          resolved_at: new Date().toISOString()
        })
        .eq('id', alertId);

      if (resolveError) {
        throw resolveError;
      }

      // Refresh alerts list
      await fetchAlerts();
      
    } catch (error) {
      console.error('Error resolving alert:', error);
    } finally {
      setResolving(null);
    }
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'document_uploaded':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'payment_overdue':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'payment_reminder':
        return <Clock className="w-5 h-5 text-orange-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getAlertTitle = (alertType: string) => {
    switch (alertType) {
      case 'document_uploaded':
        return 'New Document Uploaded';
      case 'payment_overdue':
        return 'Payment Overdue';
      case 'payment_reminder':
        return 'Payment Reminder';
      default:
        return 'Alert';
    }
  };

  const getAlertMessage = (alert: Alert) => {
    const timeAgo = new Date(alert.created_at).toLocaleDateString();
    
    switch (alert.alert_type) {
      case 'document_uploaded':
        return `Client uploaded a new document - ${timeAgo}`;
      case 'payment_overdue':
        return `Payment is overdue - ${timeAgo}`;
      case 'payment_reminder':
        return `Payment reminder sent - ${timeAgo}`;
      default:
        return `Alert created - ${timeAgo}`;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-300 rounded"></div>
            <div className="h-12 bg-gray-300 rounded"></div>
            <div className="h-12 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Alerts</h3>
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <p className="text-gray-500">No pending alerts</p>
          <p className="text-sm text-gray-400 mt-1">All caught up!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">Recent Alerts</h3>
      </div>
      
      <div className="divide-y">
        {alerts.map((alert) => (
          <div key={alert.id} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getAlertIcon(alert.alert_type)}
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {getAlertTitle(alert.alert_type)}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {getAlertMessage(alert)}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => resolveAlert(alert.id, alert.alert_type)}
                disabled={resolving === alert.id}
                className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {resolving === alert.id ? 'Resolving...' : 'Mark as Read'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsultantAlerts;