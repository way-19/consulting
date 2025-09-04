import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { supabase } from '@consulting19/supabase';
import { useAuth } from '@consulting19/shared';
import { useI18n } from '../hooks/useI18n';

interface Notification {
  id: string;
  type: string;
  payload: any;
  read_at: string | null;
  created_at: string;
  actor_profile: {
    full_name: string;
  } | null;
}

const NotificationBell = () => {
  const { user } = useAuth();
  const { t, formatRelativeTime } = useI18n();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    fetchNotifications();
    
    // Subscribe to realtime notifications
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `recipient_profile_id=eq.${user.id}`
      }, (payload) => {
        setNotifications(prev => [payload.new as Notification, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          actor_profile:user_profiles!notifications_actor_profile_id_fkey(full_name)
        `)
        .eq('recipient_profile_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching notifications:', error);
      } else {
        setNotifications(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (!error) {
        setNotifications(prev =>
          prev.map(n => n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n)
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const unreadIds = notifications.filter(n => !n.read_at).map(n => n.id);
      
      if (unreadIds.length === 0) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .in('id', unreadIds);

      if (!error) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
        );
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read_at).length;

  const getNotificationMessage = (notification: Notification) => {
    const { type, payload } = notification;
    const actorName = notification.actor_profile?.full_name || 'Someone';

    switch (type) {
      case 'document_requested':
        return `${actorName} requested a document: ${payload.document_name}`;
      case 'document_uploaded':
        return `${actorName} uploaded a document: ${payload.document_name}`;
      case 'document_approved':
        return `Your document "${payload.document_name}" was approved`;
      case 'document_rejected':
        return `Your document "${payload.document_name}" was rejected`;
      case 'task_assigned':
        return `${actorName} assigned you a task: ${payload.task_title}`;
      case 'task_completed':
        return `Task completed: ${payload.task_title}`;
      case 'project_updated':
        return `${actorName} updated project: ${payload.project_name}`;
      case 'service_ordered':
        return `New service order: ${payload.service_name}`;
      case 'invoice_due':
        return `Invoice due: ${payload.invoice_number}`;
      case 'booking_confirmed':
        return `${actorName} confirmed your booking`;
      case 'onboarding_completed':
        return `${actorName} completed onboarding`;
      default:
        return `New notification from ${actorName}`;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-96 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{t('notifications.title')}</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800 mt-1"
                >
                  {t('notifications.markAllAsRead')}
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  {t('common.loading')}
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {t('notifications.noNotifications')}
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      !notification.read_at ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        !notification.read_at ? 'bg-blue-500' : 'bg-gray-300'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 leading-relaxed">
                          {getNotificationMessage(notification)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatRelativeTime(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;