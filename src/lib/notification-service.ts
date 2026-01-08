/**
 * Notification Service
 *
 * This service handles saving notifications to the database and provides
 * helper functions for creating different types of notifications.
 *
 * The service works across serverless function boundaries by persisting
 * notifications in the database instead of relying on in-memory state.
 *
 * It also integrates with Web Push for sending push notifications to
 * subscribed devices.
 */

import { db } from '@/lib/db';
import { notifications, notificationReads, type DbNotification, type NewDbNotification } from '@/lib/db/schema';
import { eq, and, or, desc, notInArray, gte, isNull, sql } from 'drizzle-orm';
import {
  sendPushToAudience,
  sendPushToUsers,
  isWebPushConfigured,
  type PushPayload,
} from '@/lib/web-push-service';

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
  sendPush?: boolean; // Whether to also send as push notification
}

/**
 * Create and persist a notification to the database
 * Optionally sends a push notification to subscribed devices
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

    // Send push notification if enabled and configured
    const shouldSendPush = data.sendPush !== false; // Default to true
    if (shouldSendPush && isWebPushConfigured()) {
      await sendPushNotificationForDbNotification(notification, data);
    }

    return notification;
  } catch (error) {
    console.error('[NOTIFICATION] Failed to create notification:', error);
    return null;
  }
}

/**
 * Send push notification for a database notification
 */
async function sendPushNotificationForDbNotification(
  notification: DbNotification,
  data: CreateNotificationData
): Promise<void> {
  try {
    const pushPayload: PushPayload = {
      title: notification.title,
      body: notification.message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: `notification-${notification.id}`,
      data: {
        url: notification.actionUrl || '/',
        notificationId: notification.id,
        type: notification.type,
      },
      requireInteraction: notification.priority === 'high' || notification.priority === 'urgent',
      actions: [
        { action: 'view', title: 'View' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    };

    if (data.targetAudience === 'specific' && data.specificUserIds?.length) {
      // Send to specific users
      const result = await sendPushToUsers(
        data.specificUserIds,
        pushPayload,
        notification.type as NotificationType
      );
      console.log(`[NOTIFICATION] Push sent to specific users: ${result.totalSent} sent, ${result.totalFailed} failed`);
    } else {
      // Send to audience (only if not 'specific')
      const audience = data.targetAudience === 'specific' ? 'all' : (data.targetAudience || 'all');
      const result = await sendPushToAudience(
        audience as 'all' | 'members' | 'admin',
        pushPayload,
        notification.type as NotificationType
      );
      console.log(`[NOTIFICATION] Push sent to ${audience}: ${result.totalSent} sent, ${result.totalFailed} failed`);
    }
  } catch (error) {
    console.error('[NOTIFICATION] Failed to send push notification:', error);
    // Don't throw - push failure shouldn't prevent the notification from being created
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
    // Also include notifications specifically targeted to this user
    const specificUserCondition = and(
      eq(notifications.targetAudience, 'specific'),
      sql`${notifications.specificUserIds}::jsonb @> ${JSON.stringify([userId])}::jsonb`
    );

    if (userRole === 'admin') {
      // Admins see all notifications (for admin or all audiences) + their specific notifications
      conditions.push(
        or(
          eq(notifications.targetAudience, 'all'),
          eq(notifications.targetAudience, 'admin'),
          eq(notifications.targetAudience, 'members'),
          specificUserCondition
        )
      );
    } else if (userRole === 'member') {
      // Members see notifications targeted at members or all + their specific notifications
      conditions.push(
        or(
          eq(notifications.targetAudience, 'all'),
          eq(notifications.targetAudience, 'members'),
          specificUserCondition
        )
      );
    } else {
      // Visitors only see public notifications + their specific notifications (if they have a userId)
      conditions.push(
        or(
          eq(notifications.targetAudience, 'all'),
          specificUserCondition
        )
      );
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
   * Create notification for new blog post (for all members)
   */
  async newBlogPost(data: {
    postId: string;
    title: string;
    author: string;
    category: string;
  }) {
    return createNotification({
      title: 'New Blog Post',
      message: `${data.author} published a new article: "${data.title}"`,
      type: 'announcement',
      priority: 'medium',
      targetAudience: 'all',
      metadata: {
        postId: data.postId,
        author: data.author,
        category: data.category,
      },
      actionUrl: `/blog/${data.postId}`,
    });
  },

  /**
   * Create notification for new sermon/audio upload (for all members)
   */
  async newSermon(data: {
    sermonId: string;
    title: string;
    speaker: string;
    type: 'video' | 'audio';
  }) {
    return createNotification({
      title: data.type === 'video' ? 'New Video Sermon' : 'New Audio Message',
      message: `A new ${data.type === 'video' ? 'video sermon' : 'audio message'} "${data.title}" by ${data.speaker} is now available`,
      type: 'announcement',
      priority: 'medium',
      targetAudience: 'all',
      metadata: {
        sermonId: data.sermonId,
        speaker: data.speaker,
        type: data.type,
      },
      actionUrl: data.type === 'video' ? '/sermons' : '/audio-messages',
    });
  },

  /**
   * Create notification for membership request approval/rejection (for the user)
   */
  async membershipRequestProcessed(data: {
    requestId: string;
    userId: string;
    userName: string;
    status: 'approved' | 'rejected';
    processedBy: string;
  }) {
    return createNotification({
      title: data.status === 'approved' ? 'Membership Approved!' : 'Membership Request Update',
      message: data.status === 'approved'
        ? `Welcome to the church, ${data.userName}! Your membership has been approved.`
        : `Your membership request has been reviewed. Please contact the church for more information.`,
      type: 'system',
      priority: data.status === 'approved' ? 'high' : 'medium',
      targetAudience: 'specific',
      specificUserIds: [data.userId],
      metadata: {
        requestId: data.requestId,
        status: data.status,
        processedBy: data.processedBy,
      },
      actionUrl: '/members/dashboard',
    });
  },

  /**
   * Create notification for prayer request status update (for the requester)
   */
  async prayerRequestStatusUpdate(data: {
    requestId: string;
    userId: string;
    requestTitle: string;
    status: 'approved' | 'answered' | 'archived';
  }) {
    const messages = {
      approved: `Your prayer request "${data.requestTitle}" has been approved and is now visible to the church.`,
      answered: `Praise God! Your prayer request "${data.requestTitle}" has been marked as answered.`,
      archived: `Your prayer request "${data.requestTitle}" has been archived.`,
    };

    return createNotification({
      title: data.status === 'answered' ? 'Prayer Answered!' : 'Prayer Request Update',
      message: messages[data.status],
      type: 'prayer_request',
      priority: data.status === 'answered' ? 'high' : 'medium',
      targetAudience: 'specific',
      specificUserIds: [data.userId],
      metadata: {
        requestId: data.requestId,
        status: data.status,
      },
      actionUrl: '/members/prayer',
    });
  },

  /**
   * Create a custom notification
   */
  async custom(data: CreateNotificationData) {
    return createNotification(data);
  },

  /**
   * Create notification for new blog comment (for post author and admins)
   */
  async newBlogComment(data: {
    postId: string;
    postSlug: string;
    postTitle: string;
    authorId: string;
    authorName: string;
    commenterName: string;
    commentPreview: string;
    isReply?: boolean;
  }) {
    // Notify the blog post author
    const authorNotification = createNotification({
      title: data.isReply ? 'New Reply on Your Blog Post' : 'New Comment on Your Blog Post',
      message: `${data.commenterName} ${data.isReply ? 'replied to a comment on' : 'commented on'} "${data.postTitle}": "${data.commentPreview.substring(0, 100)}${data.commentPreview.length > 100 ? '...' : ''}"`,
      type: 'announcement',
      priority: 'medium',
      targetAudience: 'specific',
      specificUserIds: [data.authorId],
      metadata: {
        postId: data.postId,
        postSlug: data.postSlug,
        postTitle: data.postTitle,
        commenterName: data.commenterName,
        isReply: data.isReply || false,
      },
      actionUrl: `/blog/${data.postSlug}#comments`,
      sendPush: true,
    });

    // Also notify all admins
    const adminNotification = createNotification({
      title: 'New Blog Comment',
      message: `${data.commenterName} commented on "${data.postTitle}": "${data.commentPreview.substring(0, 80)}${data.commentPreview.length > 80 ? '...' : ''}"`,
      type: 'admin',
      priority: 'low',
      targetAudience: 'admin',
      metadata: {
        postId: data.postId,
        postSlug: data.postSlug,
        postTitle: data.postTitle,
        commenterName: data.commenterName,
        isReply: data.isReply || false,
      },
      actionUrl: `/blog/${data.postSlug}#comments`,
      sendPush: true,
    });

    // Return the author notification (or admin if author is admin)
    const result = await authorNotification;
    await adminNotification;
    return result;
  },

  /**
   * Create notification for event reminder (for all members or specific registrants)
   */
  async eventReminder(data: {
    eventId: string;
    title: string;
    date: string;
    time?: string;
    location?: string;
    reminderType: '24h' | '1h' | 'day_of' | 'custom';
    registeredUserIds?: string[];
  }) {
    const timeInfo = data.time ? ` at ${data.time}` : '';
    const reminderMessages = {
      '24h': `Reminder: "${data.title}" is happening tomorrow${timeInfo}`,
      '1h': `Reminder: "${data.title}" starts in 1 hour${timeInfo}`,
      'day_of': `Reminder: "${data.title}" is happening today${timeInfo}`,
      'custom': `Reminder: "${data.title}" on ${data.date}${timeInfo}`,
    };

    const priorityMap = {
      '24h': 'medium' as const,
      '1h': 'high' as const,
      'day_of': 'high' as const,
      'custom': 'medium' as const,
    };

    return createNotification({
      title: 'Event Reminder',
      message: reminderMessages[data.reminderType],
      type: 'event',
      priority: priorityMap[data.reminderType],
      targetAudience: data.registeredUserIds?.length ? 'specific' : 'all',
      specificUserIds: data.registeredUserIds,
      metadata: {
        eventId: data.eventId,
        eventDate: data.date,
        location: data.location,
        reminderType: data.reminderType,
      },
      actionUrl: '/events',
      sendPush: true,
    });
  },

  /**
   * Create notification for upcoming event (general awareness, not registration specific)
   */
  async upcomingEventAlert(data: {
    eventId: string;
    title: string;
    date: string;
    daysUntil: number;
  }) {
    return createNotification({
      title: 'Upcoming Event',
      message: `Don't miss "${data.title}" happening in ${data.daysUntil} day${data.daysUntil > 1 ? 's' : ''} on ${data.date}`,
      type: 'event',
      priority: 'medium',
      targetAudience: 'all',
      metadata: {
        eventId: data.eventId,
        eventDate: data.date,
        daysUntil: data.daysUntil,
      },
      actionUrl: '/events',
      sendPush: true,
    });
  },
};

export default notificationService;
