import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, MessageSquare, FileText, DollarSign, AlertTriangle, Eye, Trash2, MarkAsReadIcon, BellRing } from 'lucide-react';
import { useAuth } from '@consulting19/shared';
import { supabase } from '@consulting19/shared/lib/supabase';

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

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onBadgeUpdate: (count: number) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose, onBadgeUpdate }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchNotifications();
      setupRealtimeSubscription();
    }
  }, [isOpen, user]);

  useEffect(() => {
    // Update badge count
    const unreadCount = notifications.filter(n => !n.read_at).length;
    onBadgeUpdate(unreadCount);
  }, [notifications, onBadgeUpdate]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          actor_profile:user_profiles(full_name)
        `)
        .eq('recipient_profile_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      setNotifications(data || []);
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_profile_id=eq.${user?.id}`
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId);

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read_at: new Date().toISOString() }
            : notif
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('recipient_profile_id', user?.id)
        .is('read_at', null);

      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read_at: new Date().toISOString() }))
      );
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message_received':
      case 'new_message':
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case 'document_uploaded':
      case 'document_approved':
      case 'mailbox_document_received':
        return <FileText className="w-5 h-5 text-green-600" />;
      case 'payment_received':
      case 'invoice_created':
      case 'mail_forwarding_paid':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'task_assigned':
      case 'task_completed':
        return <CheckCircle className="w-5 h-5 text-purple-600" />;
      case 'service_ordered':
      case 'custom_service_request':
        return <BellRing className="w-5 h-5 text-orange-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationText = (notification: Notification) => {
    const { type, payload } = notification;
    const actorName = notification.actor_profile?.full_name || 'System';

    switch (type) {
      case 'message_received':
        return `${actorName} sent you a message`;
      case 'document_uploaded':
        return `Document "${payload.document_name}" was uploaded`;
      case 'mailbox_document_received':
        return `New document "${payload.document_name}" in your mailbox`;
      case 'task_assigned':
        return `New task assigned: ${payload.task_title}`;
      case 'payment_received':
        return `Payment of $${payload.amount} received`;
      case 'service_ordered':
        return `Service ordered: ${payload.service_title}`;
      case 'custom_service_request':
        return `Custom service request: ${payload.service_title}`;
      case 'mail_forwarding_paid':
        return `Mail forwarding payment ($${payload.amount}) processed`;
      default:
        return `New notification from ${actorName}`;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'message_received':
        return 'bg-blue-50 border-blue-200';
      case 'document_uploaded':
      case 'mailbox_document_received':
        return 'bg-green-50 border-green-200';
      case 'payment_received':
      case 'mail_forwarding_paid':
        return 'bg-emerald-50 border-emerald-200';
      case 'task_assigned':
        return 'bg-purple-50 border-purple-200';
      case 'service_ordered':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const timeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.read_at).length;
  const todayNotifications = notifications.filter(n => {
    const today = new Date();
    const notifDate = new Date(n.created_at);
    return notifDate.toDateString() === today.toDateString();
  });

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-600">Stay updated on your progress</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {unreadCount > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">
                {unreadCount} new notification{unreadCount > 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Mark all read
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse flex space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {/* Today's Notifications */}
            {todayNotifications.length > 0 && (
              <div>
                <div className="px-6 py-3 bg-gray-50">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Today</h4>
                </div>
                {todayNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                    getNotificationIcon={getNotificationIcon}
                    getNotificationText={getNotificationText}
                    getNotificationColor={getNotificationColor}
                    timeAgo={timeAgo}
                  />
                ))}
              </div>
            )}

            {/* Earlier Notifications */}
            {notifications.filter(n => !todayNotifications.includes(n)).length > 0 && (
              <div>
                <div className="px-6 py-3 bg-gray-50">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Earlier</h4>
                </div>
                {notifications.filter(n => !todayNotifications.includes(n)).slice(0, 10).map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                    getNotificationIcon={getNotificationIcon}
                    getNotificationText={getNotificationText}
                    getNotificationColor={getNotificationColor}
                    timeAgo={timeAgo}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-600 text-sm">
              You'll receive updates about projects, messages, and payments here
            </p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {notifications.length > 0 && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Showing {Math.min(notifications.length, 20)} of {notifications.length}
            </span>
            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Notification Item Component
const NotificationItem: React.FC<{
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  getNotificationIcon: (type: string) => JSX.Element;
  getNotificationText: (notification: Notification) => string;
  getNotificationColor: (type: string) => string;
  timeAgo: (timestamp: string) => string;
}> = ({
  notification,
  onMarkAsRead,
  onDelete,
  getNotificationIcon,
  getNotificationText,
  getNotificationColor,
  timeAgo
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div 
      className={`group relative p-4 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 ${
        !notification.read_at 
          ? `${getNotificationColor(notification.type)} bg-blue-50/30` 
          : 'border-transparent'
      }`}
      onClick={() => !notification.read_at && onMarkAsRead(notification.id)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            !notification.read_at ? 'bg-white shadow-sm' : 'bg-gray-100'
          }`}>
            {getNotificationIcon(notification.type)}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                !notification.read_at ? 'text-gray-900' : 'text-gray-600'
              }`}>
                {getNotificationText(notification)}
              </p>
              
              {notification.payload?.description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {notification.payload.description}
                </p>
              )}
              
              <div className="flex items-center space-x-3 mt-2">
                <span className="text-xs text-gray-500">
                  {timeAgo(notification.created_at)}
                </span>
                {!notification.read_at && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-xs font-medium text-blue-600">New</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex items-center space-x-1 opacity-100 transition-opacity">
                {!notification.read_at && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsRead(notification.id);
                    }}
                    className="w-6 h-6 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors"
                    title="Mark as read"
                  >
                    <Eye className="w-3 h-3 text-blue-600" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(notification.id);
                  }}
                  className="w-6 h-6 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors"
                  title="Delete notification"
                >
                  <Trash2 className="w-3 h-3 text-red-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;