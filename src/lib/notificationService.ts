import { supabase } from './supabase';

export interface NotificationData {
  title: string;
  message: string;
  type?: 'success' | 'warning' | 'error' | 'info' | 'reminder' | 'welcome' | 'payment' | 'document' | 'message';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  action_url?: string;
  metadata?: Record<string, any>;
  expires_at?: string;
}

export class NotificationService {
  static async createNotification(userId: string, notification: NotificationData) {
    try {
      const { error } = await supabase
        .from('user_notifications')
        .insert({
          user_id: userId,
          title: notification.title,
          message: notification.message,
          type: notification.type || 'info',
          priority: notification.priority || 'normal',
          action_url: notification.action_url,
          metadata: notification.metadata || {},
          expires_at: notification.expires_at
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error creating notification:', error);
      return false;
    }
  }

  static async createBulkNotifications(userIds: string[], notification: NotificationData) {
    try {
      const notifications = userIds.map(userId => ({
        user_id: userId,
        title: notification.title,
        message: notification.message,
        type: notification.type || 'info',
        priority: notification.priority || 'normal',
        action_url: notification.action_url,
        metadata: notification.metadata || {},
        expires_at: notification.expires_at
      }));

      const { error } = await supabase
        .from('user_notifications')
        .insert(notifications);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error creating bulk notifications:', error);
      return false;
    }
  }

  static async markAsRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from('user_notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  static async deleteNotification(notificationId: string) {
    try {
      const { error } = await supabase
        .from('user_notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('user_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  // Predefined notification templates
  static async sendWelcomeNotification(userId: string) {
    return this.createNotification(userId, {
      title: 'CONSULTING19\'a Hoş Geldiniz! 🎉',
      message: 'Platformumuza hoş geldiniz! Başvuru sürecinizi takip edebilir, danışmanlarınızla iletişim kurabilir ve tüm hizmetlerimizden faydalanabilirsiniz.',
      type: 'welcome',
      priority: 'normal'
    });
  }

  static async sendPaymentReminder(userId: string, amount: number, dueDate: string) {
    return this.createNotification(userId, {
      title: 'Ödeme Hatırlatması 💳',
      message: `${amount} USD tutarındaki ödemenizin son tarihi ${new Date(dueDate).toLocaleDateString('tr-TR')}. Lütfen ödemenizi zamanında yapın.`,
      type: 'payment',
      priority: 'high',
      action_url: '/client#payments'
    });
  }

  static async sendDocumentRequest(userId: string, documentType: string) {
    return this.createNotification(userId, {
      title: 'Belge Talebi 📄',
      message: `${documentType} belgenizi yüklemeniz gerekiyor. Sürecinizi hızlandırmak için lütfen en kısa sürede yükleyin.`,
      type: 'document',
      priority: 'high',
      action_url: '/client#documents'
    });
  }

  static async sendApplicationUpdate(userId: string, status: string, country: string) {
    return this.createNotification(userId, {
      title: 'Başvuru Durumu Güncellendi ✅',
      message: `${country} başvurunuzun durumu "${status}" olarak güncellendi. Detaylar için başvurularınızı kontrol edin.`,
      type: 'success',
      priority: 'normal',
      action_url: '/client#applications'
    });
  }

  static async sendMessageNotification(userId: string, senderName: string) {
    return this.createNotification(userId, {
      title: 'Yeni Mesaj 💬',
      message: `${senderName} size yeni bir mesaj gönderdi. Mesajınızı görüntülemek için tıklayın.`,
      type: 'message',
      priority: 'normal',
      action_url: '/client/messages'
    });
  }
}

export default NotificationService;