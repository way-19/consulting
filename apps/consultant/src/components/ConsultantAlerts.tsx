import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  FileText, 
  DollarSign, 
  Clock, 
  User,
  X,
  Eye,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@consulting19/shared/src/lib/supabase';

interface Alert {
  id: string;
  alert_type: 'document_uploaded' | 'payment_overdue' | 'payment_reminder';
  message: string;
  client_id: string;
  alert_source_id: string;
  is_resolved: boolean;
  created_at: string;
  client: {
    id: string;
    company_name?: string;
    profile: {
      full_name: string;
    };
  };
}

interface ConsultantAlertsProps {
  consultantId?: string;
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
        .select(`
          *,
          client:clients!consultant_alerts_client_id_fkey(
            id,
            company_name,
            profile:user_profiles!clients_profile_id_fkey(full_name)
          )
        `)
        .eq('consultant_id', consultantId)
        .eq('is_resolved', false)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching alerts:', error);
        return;
      }

      let allAlerts = alertsData || [];

      // Also fetch from localStorage backup
      try {
        const pendingAlerts = JSON.parse(localStorage.getItem('pending_alerts') || '[]');
        const consultantPendingAlerts = pendingAlerts.filter((alert: any) => 
          alert.consultant_id === consultantId && !alert.is_resolved
        );
        
        if (consultantPendingAlerts.length > 0) {
          console.log(`📦 Found ${consultantPendingAlerts.length} pending alerts in localStorage`);
          
          // Add localStorage alerts with indicator
          const formattedPendingAlerts = consultantPendingAlerts.map((alert: any) => ({
            ...alert,
            isFromLocalStorage: true,
            client: {
              id: alert.client_id,
              company_name: 'Pending Client',
              profile: { full_name: 'Client' }
            }
          }));
          
          allAlerts = [...formattedPendingAlerts, ...allAlerts];
        }
      } catch (err) {
        console.error('Error reading localStorage alerts:', err);
      }

      setAlerts(allAlerts);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (alertId: string, alertType: string, clientId: string) => {
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

      // Navigate to appropriate page based on alert type
      if (alertType === 'document_uploaded') {
        // Redirect to documents page for the client
        window.location.href = `/documents?client=${clientId}`;
      } else if (alertType === 'payment_overdue' || alertType === 'payment_reminder') {
        // Redirect to client financial page
        window.location.href = `/clients/${clientId}?tab=financial`;
      }

      // Remove from local state
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      
    } catch (err) {
      console.error('Error resolving alert:', err);
      alert('Failed to resolve alert');
    } finally {
      setResolving(null);
    }
  };

  const dismissAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('consultant_alerts')
        .update({ 
          is_resolved: true,
          resolved_at: new Date().toISOString()
        })
        .eq('id', alertId);

      if (error) {
        throw error;
      }

      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    } catch (err) {
      console.error('Error dismissing alert:', err);
      alert('Failed to dismiss alert');
    }
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'document_uploaded':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'payment_overdue':
        return <DollarSign className="w-5 h-5 text-red-600" />;
      case 'payment_reminder':
        return <Clock className="w-5 h-5 text-orange-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getAlertColor = (alertType: string) => {
    switch (alertType) {
      case 'document_uploaded':
        return 'border-l-blue-500 bg-blue-50';
      case 'payment_overdue':
        return 'border-l-red-500 bg-red-50';
      case 'payment_reminder':
        return 'border-l-orange-500 bg-orange-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatAlertType = (alertType: string) => {
    switch (alertType) {
      case 'document_uploaded':
        return 'New Document';
      case 'payment_overdue':
        return 'Overdue Payment';
      case 'payment_reminder':
        return 'Payment Reminder';
      default:
        return 'Alert';
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse border-l-4 border-gray-300 bg-gray-100 rounded-lg p-4">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
        <p className="text-gray-600">No pending alerts. Great work!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {alerts.map((alert) => (
        <div key={alert.id} className={`border-l-4 ${getAlertColor(alert.alert_type)} rounded-lg p-4 transition-all hover:shadow-md`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className="mt-0.5">
                {getAlertIcon(alert.alert_type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    {formatAlertType(alert.alert_type)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(alert.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {alert.message}
                </p>
                <div className="flex items-center space-x-1 text-xs text-gray-600">
                  <User className="w-3 h-3" />
                  <span>{alert.client.profile.full_name}</span>
                  {alert.client.company_name && (
                    <>
                      <span>•</span>
                      <span>{alert.client.company_name}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => resolveAlert(alert.id, alert.alert_type, alert.client_id)}
                disabled={resolving === alert.id}
                className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                title="View & Resolve"
              >
                {resolving === alert.id ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                    Resolving...
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </>
                )}
              </button>
              <button
                onClick={() => dismissAlert(alert.id)}
                className="text-gray-400 hover:text-gray-600"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConsultantAlerts;