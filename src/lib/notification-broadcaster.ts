import { type Notification, createNotification, createNotificationHelpers } from './notification';

// Store reference to the broadcast function from SSE route
let broadcastFunction: ((notification: Notification) => void) | null = null;

/**
 * Set the broadcast function from the SSE route
 * This is called when the SSE route initializes
 */
export function setBroadcastFunction(fn: (notification: Notification) => void) {
  broadcastFunction = fn;
  console.log('Notification broadcaster connected to SSE route');
}

/**
 * Broadcast a notification to all connected clients
 * Falls back gracefully if broadcast function is not available
 */
export function broadcastNotification(notification: Notification) {
  if (broadcastFunction) {
    try {
      broadcastFunction(notification);
      console.log('Notification broadcasted:', notification.type, notification.title);
    } catch (error) {
      console.error('Error broadcasting notification:', error);
    }
  } else {
    console.warn('Broadcast function not available, notification not sent:', notification.title);
    // In production, you might want to queue notifications or use a different strategy
  }
}

/**
 * Convenience functions for sending specific notification types
 */
export const notificationSender = {
  /**
   * Send notification for new prayer request
   */
  newPrayerRequest: (data: { requestId: string; requestTitle: string; requesterName: string; isGuest?: boolean }) => {
    const notification = createNotificationHelpers.newPrayerRequest(data);
    broadcastNotification(notification);
    return notification;
  },

  /**
   * Send notification for new user registration
   */
  newUserRegistration: (data: { userId: string; userName: string; userEmail: string }) => {
    const notification = createNotificationHelpers.newUserRegistration(data);
    broadcastNotification(notification);
    return notification;
  },

  /**
   * Send notification for new membership request
   */
  newMembershipRequest: (data: { requestId: string; name: string; email: string }) => {
    const notification = createNotificationHelpers.newMembershipRequest(data);
    broadcastNotification(notification);
    return notification;
  },

  /**
   * Send notification for new announcement
   */
  newAnnouncement: (data: { announcementId: string; title: string; author: string }) => {
    const notification = createNotificationHelpers.newAnnouncement(data);
    broadcastNotification(notification);
    return notification;
  },

  /**
   * Send notification for new event
   */
  newEvent: (data: { eventId: string; title: string; date: string; organizer: string }) => {
    const notification = createNotificationHelpers.newEvent(data);
    broadcastNotification(notification);
    return notification;
  },

  /**
   * Send notification for user status change
   */
  userStatusChange: (data: { userId: string; userName: string; status: string; changedBy: string }) => {
    const notification = createNotificationHelpers.userStatusChange(data);
    broadcastNotification(notification);
    return notification;
  },

  /**
   * Send system alert notification
   */
  systemAlert: (data: { title: string; message: string; priority: 'low' | 'normal' | 'high' | 'urgent'; url?: string }) => {
    const notification = createNotificationHelpers.systemAlert(data);
    broadcastNotification(notification);
    return notification;
  },

  /**
   * Send a custom notification
   */
  custom: (notification: Notification) => {
    broadcastNotification(notification);
    return notification;
  }
};

/**
 * Get the current status of the broadcaster
 */
export function getBroadcasterStatus() {
  return {
    isConnected: broadcastFunction !== null,
    timestamp: new Date().toISOString()
  };
}

/**
 * Reset the broadcast function (used for cleanup)
 */
export function resetBroadcastFunction() {
  broadcastFunction = null;
  console.log('Notification broadcaster disconnected');
}
