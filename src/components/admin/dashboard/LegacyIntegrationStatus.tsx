import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock,
  Database,
  Users,
  DollarSign,
  RefreshCw
} from 'lucide-react';

const LegacyIntegrationStatus: React.FC = () => {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/admin/legacy-health-check');
        const data = await response.json();
        setHealthData(data);
      } catch (error) {
        console.error('Error checking health:', error);
        setHealthData({
          status: 'error',
          overallHealth: 'critical',
          health: {
            databaseConnection: false,
            recentOrderSync: false,
            consultantAssignment: false,
            commissionCalculation: false,
            lastSyncTime: null
          }
        });
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleForceSync = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/admin/force-legacy-sync', {
        method: 'POST'
      });
      
      if (response.ok) {
        // Refresh health data after sync
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error('Error forcing sync:', error);
    } finally {
      setSyncing(false);
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? CheckCircle : XCircle;
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-600' : 'text-red-600';
  };

  const getOverallStatusColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'bg-green-100 border-green-500 text-green-800';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'critical':
        return 'bg-red-100 border-red-500 text-red-800';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

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

  const healthChecks = [
    {
      name: 'Database Connection',
      status: healthData?.health?.databaseConnection,
      icon: Database,
      description: 'Connection to legacy database'
    },
    {
      name: 'Recent Order Sync',
      status: healthData?.health?.recentOrderSync,
      icon: RefreshCw,
      description: 'Orders synced in last 24 hours'
    },
    {
      name: 'Consultant Assignment',
      status: healthData?.health?.consultantAssignment,
      icon: Users,
      description: 'Automatic consultant assignment'
    },
    {
      name: 'Commission Calculation',
      status: healthData?.health?.commissionCalculation,
      icon: DollarSign,
      description: 'Commission calculation system'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Legacy Integration Status</h2>
        <button
          onClick={handleForceSync}
          disabled={syncing}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Force Sync'}
        </button>
      </div>

      {/* Overall health status */}
      <div className={`border-l-4 rounded-xl p-4 mb-6 ${getOverallStatusColor(healthData?.overallHealth)}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {healthData?.overallHealth === 'healthy' ? (
              <CheckCircle className="h-6 w-6" />
            ) : healthData?.overallHealth === 'warning' ? (
              <AlertTriangle className="h-6 w-6" />
            ) : (
              <XCircle className="h-6 w-6" />
            )}
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium">
              System Status: {healthData?.overallHealth?.toUpperCase()}
            </h3>
            {healthData?.health?.lastSyncTime && (
              <p className="text-sm mt-1">
                Last sync: {new Date(healthData.health.lastSyncTime).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Individual health checks */}
      <div className="space-y-4">
        {healthChecks.map((check) => {
          const StatusIcon = getStatusIcon(check.status);
          return (
            <div key={check.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center">
                <check.icon className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">{check.name}</h4>
                  <p className="text-sm text-gray-500">{check.description}</p>
                </div>
              </div>
              <StatusIcon className={`h-6 w-6 ${getStatusColor(check.status)}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LegacyIntegrationStatus;