/**
 * Web Push Notifications using VAPID
 *
 * This module handles server-side web push notifications.
 * VAPID (Voluntary Application Server Identification) allows the server
 * to send push notifications directly to the browser.
 *
 * Required environment variables:
 * - NEXT_PUBLIC_VAPID_PUBLIC_KEY: The public key (shared with client)
 * - VAPID_PRIVATE_KEY: The private key (server-side only)
 * - VAPID_SUBJECT: mailto: or https: URL identifying the sender
 */

import webpush from 'web-push';
import { db } from '@/lib/db';
import { pushSubscriptions, notificationPreferences } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// Initialize web-push with VAPID details
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@example.com';

// Only set VAPID details if keys are configured
if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
  console.log('[WEB-PUSH] VAPID details configured');
} else {
  console.warn('[WEB-PUSH] VAPID keys not configured. Push notifications will be disabled.');
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: {
    url?: string;
    notificationId?: string;
    type?: string;
    [key: string]: unknown;
  };
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
  silent?: boolean;
}

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

/**
 * Check if web push is configured and available
 */
export function isWebPushConfigured(): boolean {
  return !!(vapidPublicKey && vapidPrivateKey);
}

/**
 * Get the public VAPID key for client-side subscription
 */
export function getVapidPublicKey(): string | null {
  return vapidPublicKey || null;
}

/**
 * Save a push subscription for a user
 */
export async function savePushSubscription(
  userId: string,
  subscription: PushSubscriptionData,
  userAgent?: string
): Promise<boolean> {
  try {
    // Check if subscription already exists (by endpoint)
    const existing = await db
      .select()
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.endpoint, subscription.endpoint))
      .limit(1);

    if (existing.length > 0) {
      // Update existing subscription
      await db
        .update(pushSubscriptions)
        .set({
          userId,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          userAgent,
          lastUsed: new Date(),
        })
        .where(eq(pushSubscriptions.endpoint, subscription.endpoint));

      console.log('[WEB-PUSH] Updated existing subscription for user:', userId);
    } else {
      // Create new subscription
      await db.insert(pushSubscriptions).values({
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userAgent,
      });

      console.log('[WEB-PUSH] Created new subscription for user:', userId);
    }

    // Update user preferences to enable push
    await db
      .insert(notificationPreferences)
      .values({
        userId,
        pushEnabled: true,
      })
      .onConflictDoUpdate({
        target: notificationPreferences.userId,
        set: {
          pushEnabled: true,
          updatedAt: new Date(),
        },
      });

    return true;
  } catch (error) {
    console.error('[WEB-PUSH] Failed to save subscription:', error);
    return false;
  }
}

/**
 * Remove a push subscription
 */
export async function removePushSubscription(
  userId: string,
  endpoint: string
): Promise<boolean> {
  try {
    await db
      .delete(pushSubscriptions)
      .where(
        and(
          eq(pushSubscriptions.userId, userId),
          eq(pushSubscriptions.endpoint, endpoint)
        )
      );

    console.log('[WEB-PUSH] Removed subscription for user:', userId);
    return true;
  } catch (error) {
    console.error('[WEB-PUSH] Failed to remove subscription:', error);
    return false;
  }
}

/**
 * Send a push notification to a specific user
 */
export async function sendPushNotificationToUser(
  userId: string,
  payload: PushNotificationPayload
): Promise<{ success: number; failed: number }> {
  if (!isWebPushConfigured()) {
    console.warn('[WEB-PUSH] Push notifications not configured');
    return { success: 0, failed: 0 };
  }

  try {
    // Check user preferences
    const preferences = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, userId))
      .limit(1);

    if (preferences.length > 0 && !preferences[0].pushEnabled) {
      console.log('[WEB-PUSH] User has disabled push notifications:', userId);
      return { success: 0, failed: 0 };
    }

    // Get all subscriptions for this user
    const subscriptions = await db
      .select()
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.userId, userId));

    if (subscriptions.length === 0) {
      console.log('[WEB-PUSH] No subscriptions found for user:', userId);
      return { success: 0, failed: 0 };
    }

    let success = 0;
    let failed = 0;

    // Send to all subscriptions
    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          JSON.stringify(payload)
        );

        // Update last used timestamp
        await db
          .update(pushSubscriptions)
          .set({ lastUsed: new Date() })
          .where(eq(pushSubscriptions.id, sub.id));

        success++;
      } catch (error: unknown) {
        const pushError = error as { statusCode?: number };
        console.error('[WEB-PUSH] Failed to send to subscription:', sub.id, error);

        // If subscription is invalid (410 Gone or 404), remove it
        if (pushError.statusCode === 410 || pushError.statusCode === 404) {
          await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, sub.id));
          console.log('[WEB-PUSH] Removed invalid subscription:', sub.id);
        }

        failed++;
      }
    }

    console.log(`[WEB-PUSH] Sent to user ${userId}: ${success} success, ${failed} failed`);
    return { success, failed };
  } catch (error) {
    console.error('[WEB-PUSH] Error sending notification to user:', error);
    return { success: 0, failed: 0 };
  }
}

/**
 * Send a push notification to multiple users
 */
export async function sendPushNotificationToUsers(
  userIds: string[],
  payload: PushNotificationPayload
): Promise<{ success: number; failed: number }> {
  let totalSuccess = 0;
  let totalFailed = 0;

  for (const userId of userIds) {
    const result = await sendPushNotificationToUser(userId, payload);
    totalSuccess += result.success;
    totalFailed += result.failed;
  }

  return { success: totalSuccess, failed: totalFailed };
}

/**
 * Send a push notification to all users with a specific role
 * Note: This requires joining with users table based on role
 */
export async function sendPushNotificationToRole(
  role: 'admin' | 'member' | 'all',
  payload: PushNotificationPayload,
  notificationType?: string
): Promise<{ success: number; failed: number }> {
  if (!isWebPushConfigured()) {
    console.warn('[WEB-PUSH] Push notifications not configured');
    return { success: 0, failed: 0 };
  }

  try {
    // Get all subscriptions with user preferences
    const subscriptionsQuery = db
      .select({
        subscription: pushSubscriptions,
        preferences: notificationPreferences,
      })
      .from(pushSubscriptions)
      .leftJoin(
        notificationPreferences,
        eq(pushSubscriptions.userId, notificationPreferences.userId)
      );

    const results = await subscriptionsQuery;

    let success = 0;
    let failed = 0;

    for (const { subscription, preferences } of results) {
      // Check if user has enabled push notifications
      if (preferences && !preferences.pushEnabled) {
        continue;
      }

      // Check notification type preferences
      if (preferences && notificationType) {
        switch (notificationType) {
          case 'announcement':
            if (!preferences.pushAnnouncements) continue;
            break;
          case 'event':
            if (!preferences.pushEvents) continue;
            break;
          case 'prayer_request':
            if (!preferences.pushPrayerRequests) continue;
            break;
          case 'system':
          case 'admin':
            if (!preferences.pushSystemAlerts) continue;
            break;
        }
      }

      // Check quiet hours
      if (preferences?.quietHoursEnabled && preferences.quietHoursStart && preferences.quietHoursEnd) {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        if (currentTime >= preferences.quietHoursStart && currentTime <= preferences.quietHoursEnd) {
          console.log('[WEB-PUSH] Skipping due to quiet hours:', subscription.userId);
          continue;
        }
      }

      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          JSON.stringify(payload)
        );

        // Update last used timestamp
        await db
          .update(pushSubscriptions)
          .set({ lastUsed: new Date() })
          .where(eq(pushSubscriptions.id, subscription.id));

        success++;
      } catch (error: unknown) {
        const pushError = error as { statusCode?: number };
        console.error('[WEB-PUSH] Failed to send to subscription:', subscription.id, error);

        if (pushError.statusCode === 410 || pushError.statusCode === 404) {
          await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, subscription.id));
          console.log('[WEB-PUSH] Removed invalid subscription:', subscription.id);
        }

        failed++;
      }
    }

    console.log(`[WEB-PUSH] Broadcast complete: ${success} success, ${failed} failed`);
    return { success, failed };
  } catch (error) {
    console.error('[WEB-PUSH] Error broadcasting notification:', error);
    return { success: 0, failed: 0 };
  }
}

/**
 * Get push subscription count for a user
 */
export async function getUserPushSubscriptionCount(userId: string): Promise<number> {
  try {
    const result = await db
      .select()
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.userId, userId));

    return result.length;
  } catch (error) {
    console.error('[WEB-PUSH] Error getting subscription count:', error);
    return 0;
  }
}

export default {
  isWebPushConfigured,
  getVapidPublicKey,
  savePushSubscription,
  removePushSubscription,
  sendPushNotificationToUser,
  sendPushNotificationToUsers,
  sendPushNotificationToRole,
  getUserPushSubscriptionCount,
};
