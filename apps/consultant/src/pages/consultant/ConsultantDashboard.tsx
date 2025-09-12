import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { AlertTriangle, CheckCircle, Clock, X } from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface Alert {
  alert_source_id: string;
  alert_type: string;
  is_resolved: boolean;
  notes?: string;
  payload: {
    client_name?: string;
    amount?: number;
    currency?: string;
    invoice_id?: string;
    document_type?: string;
    document_name?: string;
    due_date?: string;
    task_title?: string;
  };
  notification_id?: string;
}

const ConsultantDashboard = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchConsultantAlerts();
    }
  }, [user]);

  const fetchConsultantAlerts = async () => {
    try {
      setLoading(true);
      const { data: alertsData, error } = await supabase
        .from('consultant_alerts')
        .select(`
          alert_source_id,
          alert_type,
          is_resolved,
          notes,
          notification:notifications!alert_source_id(id, payload, read_at)
        `)
        .eq('consultant_id', user?.id)
        .eq('is_resolved', false);

      if (error) {
        console.error('Error fetching consultant alerts:', error);
        return;
      }

      const formattedAlerts: Alert[] = (alertsData || []).map(alert => ({
        alert_source_id: alert.alert_source_id,
        alert_type: alert.alert_type,
        is_resolved: alert.is_resolved,
        notes: alert.notes,
        payload: alert.notification?.payload || {},
        notification_id: alert.notification?.id
      }));

      setAlerts(formattedAlerts);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAlertAsResolved = async (alertId: string, notificationId?: string) => {
    try {
      const { error } = await supabase
        .from('consultant_alerts')
        .update({ is_resolved: true, resolved_at: new Date().toISOString() })
        .eq('alert_source_id', alertId);

      if (error) {
        console.error('Error resolving alert:', error);
        return;
      }

      if (notificationId) {
        const { error: notificationUpdateError } = await supabase
          .from('notifications')
          .update({ read_at: new Date().toISOString() })
          .eq('id', notificationId);

        if (notificationUpdateError) {
          console.error('Error marking notification as read:', notificationUpdateError);
        }
      }
      
      fetchConsultantAlerts();
    } catch (err) {
      console.error('Error resolving alert:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-gray-600">Loading alerts...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Consultant Dashboard</title>
      </Helmet>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Consultant Dashboard</h1>
        <p className="text-gray-600">Welcome to your dashboard!</p>

        {/* Consultant Alerts Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Pending Alerts</h2>
          {alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-900">
                      {alert.alert_type === 'payment_overdue' && alert.payload.client_name && alert.payload.amount ?
                        `Overdue Payment from ${alert.payload.client_name}: $${alert.payload.amount} ${alert.payload.currency}` :
                      alert.alert_type === 'document_due' && alert.payload.client_name && alert.payload.document_type ?
                        `Overdue Document from ${alert.payload.client_name}: ${alert.payload.document_type}` :
                      alert.alert_type === 'document_uploaded' && alert.payload.client_name && alert.payload.document_name ?
                        `New Document Uploaded by ${alert.payload.client_name}: ${alert.payload.document_name}` :
                      alert.alert_type.replace('_', ' ')} Alert
                    </p>
                    {alert.payload.due_date && (
                      <p className="text-xs text-yellow-800 mt-1">Due Date: {new Date(alert.payload.due_date).toLocaleDateString()}</p>
                    )}
                  </div>
                  <button
                    onClick={() => markAlertAsResolved(alert.alert_source_id, alert.notification_id)}
                    className="ml-4 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-1 inline" />
                    Reviewed
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="text-gray-600">No pending alerts. You're all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConsultantDashboard;