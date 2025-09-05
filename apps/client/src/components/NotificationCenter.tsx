import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  MessageSquare, 
  FileText, 
  DollarSign,
  CreditCard,
  Truck,
  BellRing,
  Calendar,
  User
} from 'lucide-react';
import { useAuth, supabase } from '@consulting19/shared';

interface Notification {
  id: string;
  type: string;
  payload: any;
  read_at: string | null;
  created_at: string;
  actor_profile: {
    full_name: string;
    role: string;
  } | null;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onBadgeUpdate: (count: number) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  isOpen, 
  onClose, 
  onBadgeUpdate 
}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      fetchNotifications();
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (user) {
      // Count unread notifications for badge
      const unreadCount = notifications.filter(n => !n.read_at).length;
      onBadgeUpdate(unreadCount);
    }
  }, [notifications, onBadgeUpdate, user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      const { data: notificationsData, error } = await supabase
        .from('notifications')
        .select(`
          *,
          actor_profile:user_profiles!notifications_actor_profile_id_fkey(full_name, role)
        `)
        .eq('recipient_profile_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      setNotifications(notificationsData || []);
    } catch (err) {
      console.error('Unexpected error fetching notifications:', err);
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

      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'document_uploaded':
      case 'document_approved':
      case 'document_rejected':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'task_assigned':
      case 'task_completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'message_received':
        return <MessageSquare className="w-5 h-5 text-purple-600" />;
      case 'payment_reminder':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'payment_overdue':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'payment_received':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'invoice_created':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'service_ordered':
      case 'custom_service_request':
        return <BellRing className="w-5 h-5 text-orange-600" />;
      case 'mail_forwarding_paid':
        return <Truck className="w-5 h-5 text-green-600" />;
      case 'meeting_scheduled':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationTitle = (notification: Notification) => {
    const { type, payload } = notification;
    const actorName = notification.actor_profile?.full_name || 'System';

    switch (type) {
      case 'document_uploaded':
        return `Document uploaded: ${payload.document_name}`;
      case 'task_assigned':
        return `New task assigned: ${payload.task_title}`;
      case 'message_received':
        return `New message from ${actorName}`;
      case 'service_ordered':
        return `Service ordered: ${payload.service_title}`;
      case 'custom_service_request':
        return `Custom service request: ${payload.service_title}`;
      case 'mail_forwarding_paid':
        return `Mail forwarding payment ($${payload.amount}) processed`;
      case 'invoice_created':
        return `New invoice: ${payload.service_title} ($${payload.amount})`;
      case 'payment_reminder':
        return `Payment reminder: ${payload.service_title} due in ${payload.days_until_due} days`;
      case 'payment_overdue':
        return `OVERDUE: ${payload.service_title} (${payload.days_overdue} days overdue)`;
      case 'payment_received':
        return `Payment received: $${payload.amount} for ${payload.service_title}`;
      case 'meeting_scheduled':
        return `Meeting scheduled: ${payload.meeting_title}`;
      default:
        return `New notification from ${actorName}`;
    }
  };

  const getNotificationBorder = (type: string) => {
    switch (type) {
      case 'document_uploaded':
      case 'document_approved':
        return 'bg-blue-50 border-blue-200';
      case 'task_assigned':
      case 'task_completed':
        return 'bg-green-50 border-green-200';
      case 'payment_reminder':
        return 'bg-yellow-50 border-yellow-200';
      case 'payment_overdue':
        return 'bg-red-50 border-red-200';
      case 'payment_received':
        return 'bg-green-50 border-green-200';
      case 'invoice_created':
        return 'bg-blue-50 border-blue-200';
      case 'service_ordered':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleNotificationAction = async (notification: Notification) => {
    try {
      const { type, payload } = notification;
      
      // Mark as read first
      if (!notification.read_at) {
        await markAsRead(notification.id);
      }
      
      // Handle different notification actions
      switch (type) {
        case 'invoice_created':
        case 'payment_reminder':
        case 'payment_overdue':
          // Redirect to billing page for payment
          window.location.href = '/billing';
          break;
        case 'service_ordered':
        case 'custom_service_request':
          // Redirect to services or dashboard
          window.location.href = '/services';
          break;
        case 'mail_forwarding_paid':
          // Redirect to mailbox
          window.location.href = '/mailbox';
          break;
        case 'payment_received':
          // Show success, redirect to billing history
          window.location.href = '/billing';
          break;
        case 'task_assigned':
          // Redirect to tasks
          window.location.href = '/tasks';
          break;
        case 'message_received':
          // Redirect to messages
          window.location.href = '/messages';
          break;
        case 'meeting_scheduled':
          // Redirect to calendar
          window.location.href = '/calendar';
          break;
        default:
          // Default action - close notification center
          onClose();
          break;
      }
    } catch (error) {
      console.error('Error handling notification action:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-gray-600 text-sm">Loading notifications...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationAction(notification)}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.read_at ? 'bg-blue-50' : ''
                } ${getNotificationBorder(notification.type)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm text-gray-900 ${
                      !notification.read_at ? 'font-semibold' : 'font-medium'
                    }`}>
                      {getNotificationTitle(notification)}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-xs text-gray-500">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </p>
                      {!notification.read_at && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No notifications</p>
            <p className="text-gray-500 text-sm">You're all caught up!</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 text-center">
          <button
            onClick={async () => {
              // Mark all as read
              const unreadIds = notifications.filter(n => !n.read_at).map(n => n.id);
              if (unreadIds.length > 0) {
                await supabase
                  .from('notifications')
                  .update({ read_at: new Date().toISOString() })
                  .in('id', unreadIds);
                
                setNotifications(prev =>
                  prev.map(notif => ({
                    ...notif,
                    read_at: notif.read_at || new Date().toISOString()
                  }))
                );
              }
            }}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;