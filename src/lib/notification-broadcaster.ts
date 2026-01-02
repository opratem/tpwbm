/**
 * Notification Broadcaster
 *
 * This module provides a unified interface for sending notifications.
 * It combines database persistence (for reliability) with real-time SSE broadcasting (for speed).
 *
 * Key design decisions:
 * 1. Database is the source of truth - notifications are always persisted first
 * 2. SSE broadcast is optional enhancement for real-time delivery
 * 3. SSE polling (in stream/route.ts) serves as fallback for serverless function isolation
 */

import { notificationService } from './notification-service';
import type { Notification } from './notification';

// Store reference to the broadcast function from SSE route
// Note: This only works within the same serverless function instance
// For cross-instance communication, the SSE polling mechanism in stream/route.ts handles it
let broadcastFunction: ((notification: Notification) => void) | null = null;

/**
 * Set the broadcast function from the SSE route
 * This is called when the SSE route initializes
 */
export function setBroadcastFunction(fn: (notification: Notification) => void) {
  broadcastFunction = fn;
  console.log('[BROADCASTER] SSE broadcast function connected');
}

/**
 * Try to broadcast via SSE if available (same-instance only)
 * This is a best-effort enhancement, not guaranteed to work across serverless instances
 */
function trySSEBroadcast(notification: Notification) {
  if (broadcastFunction) {
    try {
      broadcastFunction(notification);
      console.log('[BROADCASTER] SSE broadcast sent:', notification.type, notification.title);
    } catch (error) {
      console.warn('[BROADCASTER] SSE broadcast failed (non-critical):', error);
    }
  } else {
    console.log('[BROADCASTER] No SSE connection in this instance - notification will be delivered via polling');
  }
}

/**
 * Send a notification - persists to database and attempts SSE broadcast
 * The SSE stream route polls the database every 10 seconds as a fallback
 */
export const notificationSender = {
  /**
   * Send notification for new prayer request (for admins)
   */
  async newPrayerRequest(data: { requestId: string; requestTitle: string; requesterName: string; isGuest?: boolean }) {
    const dbNotification = await notificationService.newPrayerRequest(data);

    if (dbNotification) {
      // Try SSE broadcast as enhancement
      trySSEBroadcast({
        id: dbNotification.id,
        title: dbNotification.title,
        message: dbNotification.message,
        type: dbNotification.type as Notification['type'],
        priority: dbNotification.priority as Notification['priority'],
        targetAudience: dbNotification.targetAudience as Notification['targetAudience'],
        read: false,
        createdAt: dbNotification.createdAt,
        expiresAt: dbNotification.expiresAt || undefined,
        metadata: dbNotification.metadata as Notification['metadata'],
        actionUrl: dbNotification.actionUrl || undefined,
      });
    }

    return dbNotification;
  },

  /**
   * Send notification for new user registration (for admins)
   */
  async newUserRegistration(data: { userId: string; userName: string; userEmail: string }) {
    const dbNotification = await notificationService.newUserRegistration(data);

    if (dbNotification) {
      trySSEBroadcast({
        id: dbNotification.id,
        title: dbNotification.title,
        message: dbNotification.message,
        type: dbNotification.type as Notification['type'],
        priority: dbNotification.priority as Notification['priority'],
        targetAudience: dbNotification.targetAudience as Notification['targetAudience'],
        read: false,
        createdAt: dbNotification.createdAt,
        expiresAt: dbNotification.expiresAt || undefined,
        metadata: dbNotification.metadata as Notification['metadata'],
        actionUrl: dbNotification.actionUrl || undefined,
      });
    }

    return dbNotification;
  },

  /**
   * Send notification for new membership request (for admins)
   */
  async newMembershipRequest(data: { requestId: string; name: string; email: string }) {
    const dbNotification = await notificationService.newMembershipRequest(data);

    if (dbNotification) {
      trySSEBroadcast({
        id: dbNotification.id,
        title: dbNotification.title,
        message: dbNotification.message,
        type: dbNotification.type as Notification['type'],
        priority: dbNotification.priority as Notification['priority'],
        targetAudience: dbNotification.targetAudience as Notification['targetAudience'],
        read: false,
        createdAt: dbNotification.createdAt,
        expiresAt: dbNotification.expiresAt || undefined,
        metadata: dbNotification.metadata as Notification['metadata'],
        actionUrl: dbNotification.actionUrl || undefined,
      });
    }

    return dbNotification;
  },

  /**
   * Send notification for new announcement (for all members)
   */
  async newAnnouncement(data: { announcementId: string; title: string; author: string }) {
    const dbNotification = await notificationService.newAnnouncement(data);

    if (dbNotification) {
      trySSEBroadcast({
        id: dbNotification.id,
        title: dbNotification.title,
        message: dbNotification.message,
        type: dbNotification.type as Notification['type'],
        priority: dbNotification.priority as Notification['priority'],
        targetAudience: dbNotification.targetAudience as Notification['targetAudience'],
        read: false,
        createdAt: dbNotification.createdAt,
        expiresAt: dbNotification.expiresAt || undefined,
        metadata: dbNotification.metadata as Notification['metadata'],
        actionUrl: dbNotification.actionUrl || undefined,
      });
    }

    return dbNotification;
  },

  /**
   * Send notification for new event (for all members)
   */
  async newEvent(data: { eventId: string; title: string; date: string; organizer: string }) {
    const dbNotification = await notificationService.newEvent(data);

    if (dbNotification) {
      trySSEBroadcast({
        id: dbNotification.id,
        title: dbNotification.title,
        message: dbNotification.message,
        type: dbNotification.type as Notification['type'],
        priority: dbNotification.priority as Notification['priority'],
        targetAudience: dbNotification.targetAudience as Notification['targetAudience'],
        read: false,
        createdAt: dbNotification.createdAt,
        expiresAt: dbNotification.expiresAt || undefined,
        metadata: dbNotification.metadata as Notification['metadata'],
        actionUrl: dbNotification.actionUrl || undefined,
      });
    }

    return dbNotification;
  },

  /**
   * Send notification for user status change (for admins)
   */
  async userStatusChange(data: { userId: string; userName: string; status: string; changedBy: string }) {
    const dbNotification = await notificationService.userStatusChange(data);

    if (dbNotification) {
      trySSEBroadcast({
        id: dbNotification.id,
        title: dbNotification.title,
        message: dbNotification.message,
        type: dbNotification.type as Notification['type'],
        priority: dbNotification.priority as Notification['priority'],
        targetAudience: dbNotification.targetAudience as Notification['targetAudience'],
        read: false,
        createdAt: dbNotification.createdAt,
        expiresAt: dbNotification.expiresAt || undefined,
        metadata: dbNotification.metadata as Notification['metadata'],
        actionUrl: dbNotification.actionUrl || undefined,
      });
    }

    return dbNotification;
  },

  /**
   * Send system alert notification (for admins)
   */
  async systemAlert(data: { title: string; message: string; priority: 'low' | 'normal' | 'high' | 'urgent'; url?: string }) {
    const dbNotification = await notificationService.systemAlert(data);

    if (dbNotification) {
      trySSEBroadcast({
        id: dbNotification.id,
        title: dbNotification.title,
        message: dbNotification.message,
        type: dbNotification.type as Notification['type'],
        priority: dbNotification.priority as Notification['priority'],
        targetAudience: dbNotification.targetAudience as Notification['targetAudience'],
        read: false,
        createdAt: dbNotification.createdAt,
        expiresAt: dbNotification.expiresAt || undefined,
        metadata: dbNotification.metadata as Notification['metadata'],
        actionUrl: dbNotification.actionUrl || undefined,
      });
    }

    return dbNotification;
  },
};

/**
 * Get the current status of the broadcaster
 */
export function getBroadcasterStatus() {
  return {
    hasSSEConnection: broadcastFunction !== null,
    timestamp: new Date().toISOString(),
    note: broadcastFunction
      ? 'SSE broadcast available in this instance'
      : 'SSE broadcast not available - using database polling fallback'
  };
}

/**
 * Reset the broadcast function (used for cleanup)
 */
export function resetBroadcastFunction() {
  broadcastFunction = null;
  console.log('[BROADCASTER] SSE broadcast function disconnected');
}
