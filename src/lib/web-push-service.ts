/**
 * Web Push Service
 *
 * Handles VAPID-based Web Push notifications that work even when the browser is closed.
 * This provides true push notifications similar to YouTube, Telegram, etc.
 */

import webpush from 'web-push';
import { db } from '@/lib/db';
import { pushSubscriptions, notificationPreferences } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import type { NotificationType } from '@/lib/notification-service';

// VAPID keys configuration
// Generate keys with: npx web-push generate-vapid-keys
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@tpwbmglobal.org';

// Configure web-push with VAPID keys
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    VAPID_SUBJECT,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

export interface PushPayload {
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
 * Check if Web Push is properly configured
 */
export function isWebPushConfigured(): boolean {
  return Boolean(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY);
}

/**
 * Get the public VAPID key for client-side subscription
 */
export function getPublicVapidKey(): string {
  return VAPID_PUBLIC_KEY;
}

/**
 * Save a push subscription for a user
 */
export async function savePushSubscription(
  userId: string,
  subscription: PushSubscriptionData,
  userAgent?: string,
  deviceName?: string
): Promise<{ success: boolean; subscriptionId?: string; error?: string }> {
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
          deviceName,
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(pushSubscriptions.id, existing[0].id));

      return { success: true, subscriptionId: existing[0].id };
    }

    // Create new subscription
    const [newSubscription] = await db
      .insert(pushSubscriptions)
      .values({
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userAgent,
        deviceName,
      })
      .returning();

    console.log(`[WEB-PUSH] New subscription saved for user ${userId}`);
    return { success: true, subscriptionId: newSubscription.id };
  } catch (error) {
    console.error('[WEB-PUSH] Failed to save subscription:', error);
    return { success: false, error: 'Failed to save subscription' };
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

    console.log(`[WEB-PUSH] Subscription removed for user ${userId}`);
    return true;
  } catch (error) {
    console.error('[WEB-PUSH] Failed to remove subscription:', error);
    return false;
  }
}

/**
 * Get all active subscriptions for a user
 */
export async function getUserSubscriptions(userId: string) {
  try {
    return await db
      .select()
      .from(pushSubscriptions)
      .where(
        and(
          eq(pushSubscriptions.userId, userId),
          eq(pushSubscriptions.isActive, true)
        )
      );
  } catch (error) {
    console.error('[WEB-PUSH] Failed to get user subscriptions:', error);
    return [];
  }
}

/**
 * Send push notification to a specific subscription
 */
async function sendToSubscription(
  subscription: { endpoint: string; p256dh: string; auth: string; id: string },
  payload: PushPayload
): Promise<{ success: boolean; expired?: boolean }> {
  if (!isWebPushConfigured()) {
    console.warn('[WEB-PUSH] VAPID keys not configured');
    return { success: false };
  }

  try {
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth,
      },
    };

    await webpush.sendNotification(
      pushSubscription,
      JSON.stringify(payload),
      {
        TTL: 60 * 60 * 24, // 24 hours
        urgency: payload.requireInteraction ? 'high' : 'normal',
      }
    );

    // Update last used timestamp
    await db
      .update(pushSubscriptions)
      .set({ lastUsed: new Date() })
      .where(eq(pushSubscriptions.id, subscription.id));

    return { success: true };
  } catch (error) {
    const webPushError = error as { statusCode?: number };

    // Handle expired/invalid subscriptions
    if (webPushError.statusCode === 404 || webPushError.statusCode === 410) {
      console.log(`[WEB-PUSH] Subscription expired, marking inactive: ${subscription.id}`);
      await db
        .update(pushSubscriptions)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(pushSubscriptions.id, subscription.id));
      return { success: false, expired: true };
    }

    console.error('[WEB-PUSH] Failed to send notification:', error);
    return { success: false };
  }
}

/**
 * Send push notification to a specific user (all their devices)
 */
export async function sendPushToUser(
  userId: string,
  payload: PushPayload,
  notificationType?: NotificationType
): Promise<{ sent: number; failed: number }> {
  const subscriptions = await getUserSubscriptions(userId);

  if (subscriptions.length === 0) {
    return { sent: 0, failed: 0 };
  }

  // Check user's notification preferences
  if (notificationType) {
    const [prefs] = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, userId))
      .limit(1);

    if (prefs) {
      // Check if push is enabled globally
      if (!prefs.pushEnabled) {
        console.log(`[WEB-PUSH] Push disabled for user ${userId}`);
        return { sent: 0, failed: 0 };
      }

      // Check specific notification type preferences
      const typeEnabled = {
        announcement: prefs.pushAnnouncements,
        event: prefs.pushEvents,
        prayer_request: prefs.pushPrayerRequests,
        system: prefs.pushSystemAlerts,
        admin: prefs.pushSystemAlerts,
      };

      if (!typeEnabled[notificationType]) {
        console.log(`[WEB-PUSH] ${notificationType} notifications disabled for user ${userId}`);
        return { sent: 0, failed: 0 };
      }

      // Check quiet hours
      if (prefs.quietHoursEnabled && prefs.quietHoursStart && prefs.quietHoursEnd) {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        if (isInQuietHours(currentTime, prefs.quietHoursStart, prefs.quietHoursEnd)) {
          console.log(`[WEB-PUSH] Quiet hours active for user ${userId}`);
          return { sent: 0, failed: 0 };
        }
      }
    }
  }

  let sent = 0;
  let failed = 0;

  // Send to all subscriptions in parallel
  const results = await Promise.all(
    subscriptions.map((sub) => sendToSubscription(sub, payload))
  );

  for (const result of results) {
    if (result.success) {
      sent++;
    } else {
      failed++;
    }
  }

  console.log(`[WEB-PUSH] Sent to user ${userId}: ${sent} succeeded, ${failed} failed`);
  return { sent, failed };
}

/**
 * Send push notification to multiple users
 */
export async function sendPushToUsers(
  userIds: string[],
  payload: PushPayload,
  notificationType?: NotificationType
): Promise<{ totalSent: number; totalFailed: number }> {
  let totalSent = 0;
  let totalFailed = 0;

  // Process in batches to avoid overwhelming the system
  const batchSize = 10;
  for (let i = 0; i < userIds.length; i += batchSize) {
    const batch = userIds.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map((userId) => sendPushToUser(userId, payload, notificationType))
    );

    for (const result of results) {
      totalSent += result.sent;
      totalFailed += result.failed;
    }
  }

  return { totalSent, totalFailed };
}

/**
 * Send push notification to all subscribers of a specific audience
 */
export async function sendPushToAudience(
  targetAudience: 'all' | 'members' | 'admin',
  payload: PushPayload,
  notificationType?: NotificationType
): Promise<{ totalSent: number; totalFailed: number }> {
  try {
    // Get all active subscriptions
    const allSubscriptions = await db
      .select({
        userId: pushSubscriptions.userId,
      })
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.isActive, true));

    // Get unique user IDs
    const uniqueUserIds = [...new Set(allSubscriptions.map((s) => s.userId))];

    if (uniqueUserIds.length === 0) {
      return { totalSent: 0, totalFailed: 0 };
    }

    // TODO: Filter by user role based on targetAudience
    // For now, send to all subscribers

    return await sendPushToUsers(uniqueUserIds, payload, notificationType);
  } catch (error) {
    console.error('[WEB-PUSH] Failed to send to audience:', error);
    return { totalSent: 0, totalFailed: 0 };
  }
}

/**
 * Helper to check if current time is within quiet hours
 */
function isInQuietHours(currentTime: string, start: string, end: string): boolean {
  // Handle cases where quiet hours span midnight
  if (start < end) {
    // Normal case: e.g., 22:00 to 07:00
    return currentTime >= start && currentTime < end;
  }
  // Spans midnight: e.g., 22:00 to 07:00 the next day
  return currentTime >= start || currentTime < end;
}

/**
 * Cleanup expired subscriptions (call periodically)
 */
export async function cleanupExpiredSubscriptions(): Promise<number> {
  try {
    // Mark subscriptions as inactive if they haven't been used in 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // For now, just log - actual cleanup should be done carefully
    console.log('[WEB-PUSH] Cleanup check completed');
    return 0;
  } catch (error) {
    console.error('[WEB-PUSH] Cleanup failed:', error);
    return 0;
  }
}
