import { generateUUID } from './utils';

// Define specific metadata types for different notification types
export interface AnnouncementMetadata {
  announcementId?: string;
  category?: string;
  priority?: string;
  author?: string;
}

export interface EventMetadata {
  eventId?: string;
  eventDate?: string;
  location?: string;
  registrationRequired?: boolean;
  capacity?: number;
}

export interface PrayerRequestMetadata {
  requestId?: string;
  category?: string;
  isUrgent?: boolean;
  requesterName?: string;
  isAnonymous?: boolean;
}

export interface SystemMetadata {
  action?: string;
  component?: string;
  userId?: string;
  details?: Record<string, string | number | boolean>;
}

export interface AdminMetadata {
  adminAction?: string;
  targetUserId?: string;
  targetResource?: string;
  changes?: Record<string, unknown>;
}

// Union type for all possible metadata
export type NotificationMetadata =
    | AnnouncementMetadata
    | EventMetadata
    | PrayerRequestMetadata
    | SystemMetadata
    | AdminMetadata;

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'announcement' | 'event' | 'prayer_request' | 'system' | 'admin';
  priority: NotificationPriority;
  targetAudience: 'all' | 'members' | 'admin' | 'specific';
  specificUsers?: string[];
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
  metadata?: NotificationMetadata;
}

export interface NotificationPreferences {
  announcements: boolean;
  events: boolean;
  prayerRequests: boolean;
  systemNotifications: boolean;
  emailNotifications: boolean;
}

/**
 * Create a new notification
 */
export function createNotification(data: {
  title: string;
  message: string;
  type: Notification['type'];
  priority?: Notification['priority'];
  targetAudience?: Notification['targetAudience'];
  specificUsers?: string[];
  expiresAt?: Date;
  metadata?: NotificationMetadata;
}): Notification {
  return {
    id: generateUUID(),
    title: data.title,
    message: data.message,
    type: data.type,
    priority: data.priority || 'medium',
    targetAudience: data.targetAudience || 'all',
    specificUsers: data.specificUsers,
    read: false,
    createdAt: new Date(),
    expiresAt: data.expiresAt,
    metadata: data.metadata
  };
}

/**
 * Filter notifications based on user role and preferences
 */
export function filterNotificationsForUser(
    notifications: Notification[],
    userId: string,
    userRole: 'admin' | 'member' | 'visitor',
    preferences?: NotificationPreferences
): Notification[] {
  const now = new Date();

  return notifications.filter(notification => {
    // Filter out expired notifications
    if (notification.expiresAt && notification.expiresAt < now) {
      return false;
    }

    // Check target audience
    switch (notification.targetAudience) {
      case 'admin':
        if (userRole !== 'admin') return false;
        break;
      case 'members':
        if (userRole === 'visitor') return false;
        break;
      case 'specific':
        if (!notification.specificUsers?.includes(userId)) return false;
        break;
      default:
        // Show to everyone (includes 'all' case)
        break;
    }

    // Apply user preferences if provided
    if (preferences && userRole !== 'admin') {
      switch (notification.type) {
        case 'announcement':
          if (!preferences.announcements) return false;
          break;
        case 'event':
          if (!preferences.events) return false;
          break;
        case 'prayer_request':
          if (!preferences.prayerRequests) return false;
          break;
        case 'system':
          if (!preferences.systemNotifications) return false;
          break;
      }
    }

    return true;
  });
}

/**
 * Sort notifications by priority and creation date
 */
export function sortNotificationsByPriority(notifications: Notification[]): Notification[] {
  const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };

  return [...notifications].sort((a, b) => {
    // First sort by priority
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // Then sort by creation date (newest first)
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}

/**
 * Mark notification as read
 */
export function markNotificationAsRead(notification: Notification): Notification {
  return {
    ...notification,
    read: true
  };
}

/**
 * Check if notification is urgent
 */
export function isUrgentNotification(notification: Notification): boolean {
  return notification.priority === 'urgent';
}

/**
 * Get notification color based on priority
 */
export function getNotificationColor(priority: Notification['priority']): string {
  switch (priority) {
    case 'urgent':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'high':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'medium':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

/**
 * Default notification preferences
 */
export const defaultNotificationPreferences: NotificationPreferences = {
  announcements: true,
  events: true,
  prayerRequests: true,
  systemNotifications: true,
  emailNotifications: false
};

/**
 * Specific notification creators for different types
 */
export const createNotificationHelpers = {
  newPrayerRequest: (data: { requestId: string; requestTitle: string; requesterName: string; isGuest?: boolean }) => {
    return createNotification({
      title: 'New Prayer Request',
      message: `${data.requesterName} has submitted a prayer request: "${data.requestTitle}"`,
      type: 'prayer_request',
      priority: 'high',
      targetAudience: 'admin',
      metadata: {
        requestId: data.requestId,
        requesterName: data.requesterName,
        isAnonymous: data.isGuest || false
      } as PrayerRequestMetadata
    });
  },

  newUserRegistration: (data: { userId: string; userName: string; userEmail: string }) => {
    return createNotification({
      title: 'New User Registration',
      message: `${data.userName} (${data.userEmail}) has registered as a new member`,
      type: 'admin',
      priority: 'medium',
      targetAudience: 'admin',
      metadata: {
        adminAction: 'user_registration',
        targetUserId: data.userId
      } as AdminMetadata
    });
  },

  newMembershipRequest: (data: { requestId: string; name: string; email: string }) => {
    return createNotification({
      title: 'New Membership Request',
      message: `${data.name} (${data.email}) has submitted a membership request`,
      type: 'admin',
      priority: 'high',
      targetAudience: 'admin',
      metadata: {
        adminAction: 'membership_request',
        targetResource: data.requestId
      } as AdminMetadata
    });
  },

  newEventRegistration: (data: { eventId: string; eventTitle: string; userName: string; userEmail: string }) => {
    return createNotification({
      title: 'New Event Registration',
      message: `${data.userName} has registered for "${data.eventTitle}"`,
      type: 'event',
      priority: 'medium',
      targetAudience: 'admin',
      metadata: {
        eventId: data.eventId
      } as EventMetadata
    });
  },

  newAnnouncement: (data: { announcementId: string; title: string; author: string }) => {
    return createNotification({
      title: 'New Announcement',
      message: `${data.author} has posted: "${data.title}"`,
      type: 'announcement',
      priority: 'medium',
      targetAudience: 'all',
      metadata: {
        announcementId: data.announcementId,
        author: data.author
      } as AnnouncementMetadata
    });
  },

  newEvent: (data: { eventId: string; title: string; date: string; organizer: string }) => {
    return createNotification({
      title: 'New Event',
      message: `${data.organizer} has created a new event: "${data.title}" on ${data.date}`,
      type: 'event',
      priority: 'medium',
      targetAudience: 'all',
      metadata: {
        eventId: data.eventId,
        eventDate: data.date
      } as EventMetadata
    });
  },

  userStatusChange: (data: { userId: string; userName: string; status: string; changedBy: string }) => {
    return createNotification({
      title: 'User Status Changed',
      message: `${data.changedBy} has changed ${data.userName}'s status to: ${data.status}`,
      type: 'admin',
      priority: 'medium',
      targetAudience: 'admin',
      metadata: {
        adminAction: 'user_status_change',
        targetUserId: data.userId,
        changes: { status: data.status }
      } as AdminMetadata
    });
  },

  systemAlert: (data: { title: string; message: string; priority: 'low' | 'normal' | 'high' | 'urgent'; url?: string }) => {
    return createNotification({
      title: data.title,
      message: data.message,
      type: 'system',
      priority: data.priority === 'normal' ? 'medium' : data.priority,
      targetAudience: 'admin',
      metadata: {
        action: 'system_alert',
        details: data.url ? { url: data.url } : {}
      } as SystemMetadata
    });
  }
};
