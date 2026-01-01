/**
 * Notification Service
 *
 * This service handles saving notifications to the database and provides
 * helper functions for creating different types of notifications.
 *
 * The service works across serverless function boundaries by persisting
 * notifications in the database instead of relying on in-memory state.
 */

import { db } from '@/lib/db';
import { notifications, notificationReads, type DbNotification, type NewDbNotification } from '@/lib/db/schema';
import { eq, and, or, desc, notInArray, gte, isNull } from 'drizzle-orm';

export type NotificationType = 'announcement' | 'event' | 'prayer_request' | 'system' | 'admin';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';
export type NotificationTargetAudience = 'all' | 'members' | 'admin' | 'specific';

export interface CreateNotificationData {
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  targetAudience?: NotificationTargetAudience;
  specificUserIds?: string[];
  metadata?: Record<string, unknown>;
  actionUrl?: string;
  expiresAt?: Date;
}

/**
 * Create and persist a notification to the database
 */
export async function createNotification(data: CreateNotificationData): Promise<DbNotification | null> {
  try {
    const [notification] = await db.insert(notifications).values({
      title: data.title,
      message: data.message,
      type: data.type,
      priority: data.priority || 'medium',
      targetAudience: data.targetAudience || 'all',
      specificUserIds: data.specificUserIds || [],
      metadata: data.metadata || {},
      actionUrl: data.actionUrl,
      expiresAt: data.expiresAt,
    }).returning();

    console.log(`[NOTIFICATION] Created: ${notification.id} - ${notification.type} - ${notification.title}`);

    return notification;
  } catch (error) {
    console.error('[NOTIFICATION] Failed to create notification:', error);
    return null;
  }
}

/**
 * Get notifications for a specific user based on their role
 */
export async function getNotificationsForUser(
  userId: string,
  userRole: 'admin' | 'member' | 'visitor',
  limit = 50,
  includeRead = false
): Promise<(DbNotification & { read: boolean })[]> {
  try {
    const now = new Date();

    // Get IDs of notifications the user has read
    const readNotificationIds = await db
      .select({ notificationId: notificationReads.notificationId })
      .from(notificationReads)
      .where(eq(notificationReads.userId, userId));

    const readIds = readNotificationIds.map(r => r.notificationId);

    // Build base conditions
    const conditions = [
      // Filter out expired notifications
      or(
        isNull(notifications.expiresAt),
        gte(notifications.expiresAt, now)
      )
    ];

    // Filter by audience based on user role
    if (userRole === 'admin') {
      // Admins see all notifications (for admin or all audiences)
      conditions.push(
        or(
          eq(notifications.targetAudience, 'all'),
          eq(notifications.targetAudience, 'admin'),
          eq(notifications.targetAudience, 'members')
        )
      );
    } else if (userRole === 'member') {
      // Members see notifications targeted at members or all
      conditions.push(
        or(
          eq(notifications.targetAudience, 'all'),
          eq(notifications.targetAudience, 'members')
        )
      );
    } else {
      // Visitors only see public notifications
      conditions.push(eq(notifications.targetAudience, 'all'));
    }

    // Optionally filter out already read notifications
    if (!includeRead && readIds.length > 0) {
      conditions.push(notInArray(notifications.id, readIds));
    }

    const results = await db
      .select()
      .from(notifications)
      .where(and(...conditions))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);

    // Add read status to each notification
    return results.map(notification => ({
      ...notification,
      read: readIds.includes(notification.id)
    }));
  } catch (error) {
    console.error('[NOTIFICATION] Failed to fetch notifications:', error);
    return [];
  }
}

/**
 * Get unread notifications count for a user
 */
export async function getUnreadNotificationCount(
  userId: string,
  userRole: 'admin' | 'member' | 'visitor'
): Promise<number> {
  try {
    const unreadNotifications = await getNotificationsForUser(userId, userRole, 100, false);
    return unreadNotifications.length;
  } catch (error) {
    console.error('[NOTIFICATION] Failed to get unread count:', error);
    return 0;
  }
}

/**
 * Mark a notification as read for a specific user
 */
export async function markNotificationAsRead(
  notificationId: string,
  userId: string
): Promise<boolean> {
  try {
    // Check if already read
    const existing = await db
      .select()
      .from(notificationReads)
      .where(
        and(
          eq(notificationReads.notificationId, notificationId),
          eq(notificationReads.userId, userId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return true; // Already marked as read
    }

    await db.insert(notificationReads).values({
      notificationId,
      userId,
    });

    return true;
  } catch (error) {
    console.error('[NOTIFICATION] Failed to mark as read:', error);
    return false;
  }
}

/**
 * Mark all notifications as read for a specific user
 */
export async function markAllNotificationsAsRead(
  userId: string,
  userRole: 'admin' | 'member' | 'visitor'
): Promise<boolean> {
  try {
    const unreadNotifications = await getNotificationsForUser(userId, userRole, 100, false);

    if (unreadNotifications.length === 0) {
      return true;
    }

    // Insert read records for all unread notifications
    await db.insert(notificationReads).values(
      unreadNotifications.map(n => ({
        notificationId: n.id,
        userId,
      }))
    );

    return true;
  } catch (error) {
    console.error('[NOTIFICATION] Failed to mark all as read:', error);
    return false;
  }
}

/**
 * Delete old notifications (cleanup job)
 */
export async function cleanupOldNotifications(daysOld = 30): Promise<number> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    // For now, just log - actual deletion should be done carefully
    console.log(`[NOTIFICATION] Would cleanup notifications older than ${cutoffDate.toISOString()}`);
    return 0;
  } catch (error) {
    console.error('[NOTIFICATION] Failed to cleanup old notifications:', error);
    return 0;
  }
}

/**
 * Notification creation helpers for specific notification types
 */
export const notificationService = {
  /**
   * Create notification for new prayer request (for admins)
   */
  async newPrayerRequest(data: {
    requestId: string;
    requestTitle: string;
    requesterName: string;
    isGuest?: boolean;
  }) {
    return createNotification({
      title: 'New Prayer Request',
      message: `${data.requesterName} has submitted a prayer request: "${data.requestTitle}"`,
      type: 'prayer_request',
      priority: 'high',
      targetAudience: 'admin',
      metadata: {
        requestId: data.requestId,
        requesterName: data.requesterName,
        isGuest: data.isGuest || false,
      },
      actionUrl: '/admin/prayer-requests',
    });
  },

  /**
   * Create notification for new user registration (for admins)
   */
  async newUserRegistration(data: {
    userId: string;
    userName: string;
    userEmail: string;
  }) {
    return createNotification({
      title: 'New User Registration',
      message: `${data.userName} (${data.userEmail}) has registered as a new member`,
      type: 'admin',
      priority: 'medium',
      targetAudience: 'admin',
      metadata: {
        userId: data.userId,
        userName: data.userName,
        userEmail: data.userEmail,
      },
      actionUrl: '/admin/users',
    });
  },

  /**
   * Create notification for new membership request (for admins)
   */
  async newMembershipRequest(data: {
    requestId: string;
    name: string;
    email: string;
  }) {
    return createNotification({
      title: 'New Membership Request',
      message: `${data.name} (${data.email}) has submitted a membership request`,
      type: 'admin',
      priority: 'high',
      targetAudience: 'admin',
      metadata: {
        requestId: data.requestId,
        name: data.name,
        email: data.email,
      },
      actionUrl: '/admin/membership-requests',
    });
  },

  /**
   * Create notification for new event (for all members)
   */
  async newEvent(data: {
    eventId: string;
    title: string;
    date: string;
    organizer: string;
  }) {
    return createNotification({
      title: 'New Event',
      message: `${data.organizer} has created a new event: "${data.title}" on ${data.date}`,
      type: 'event',
      priority: 'medium',
      targetAudience: 'all',
      metadata: {
        eventId: data.eventId,
        eventDate: data.date,
        organizer: data.organizer,
      },
      actionUrl: '/events',
    });
  },

  /**
   * Create notification for new announcement (for all)
   */
  async newAnnouncement(data: {
    announcementId: string;
    title: string;
    author: string;
  }) {
    return createNotification({
      title: 'New Announcement',
      message: `${data.author} has posted: "${data.title}"`,
      type: 'announcement',
      priority: 'medium',
      targetAudience: 'all',
      metadata: {
        announcementId: data.announcementId,
        author: data.author,
      },
      actionUrl: '/announcements',
    });
  },

  /**
   * Create notification for event registration (for admins)
   */
  async newEventRegistration(data: {
    eventId: string;
    eventTitle: string;
    userName: string;
    userEmail: string;
  }) {
    return createNotification({
      title: 'New Event Registration',
      message: `${data.userName} has registered for "${data.eventTitle}"`,
      type: 'event',
      priority: 'low',
      targetAudience: 'admin',
      metadata: {
        eventId: data.eventId,
        userName: data.userName,
        userEmail: data.userEmail,
      },
      actionUrl: '/admin/events',
    });
  },

  /**
   * Create notification for user status change (for admins)
   */
  async userStatusChange(data: {
    userId: string;
    userName: string;
    status: string;
    changedBy: string;
  }) {
    return createNotification({
      title: 'User Status Changed',
      message: `${data.changedBy} has changed ${data.userName}'s status to: ${data.status}`,
      type: 'admin',
      priority: 'medium',
      targetAudience: 'admin',
      metadata: {
        userId: data.userId,
        userName: data.userName,
        status: data.status,
        changedBy: data.changedBy,
      },
      actionUrl: '/admin/users',
    });
  },

  /**
   * Create system alert notification (for admins)
   */
  async systemAlert(data: {
    title: string;
    message: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    url?: string;
  }) {
    return createNotification({
      title: data.title,
      message: data.message,
      type: 'system',
      priority: data.priority === 'normal' ? 'medium' : data.priority,
      targetAudience: 'admin',
      actionUrl: data.url,
    });
  },

  /**
   * Create a custom notification
   */
  async custom(data: CreateNotificationData) {
    return createNotification(data);
  },
};

export default notificationService;
