/**
 * Browser Push Notification System
 * Enables notifications even when user is not actively on the site
 * Similar to YouTube, Telegram, etc.
 */

export type NotificationPermission = 'default' | 'granted' | 'denied';

export interface BrowserNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  data?: Record<string, unknown>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

/**
 * Check if browser supports notifications
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  return Notification.permission;
}

/**
 * Request permission to show browser notifications
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    console.warn('Browser notifications are not supported');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
}

/**
 * Show a browser notification (works even when tab is not active)
 */
export function showBrowserNotification(options: BrowserNotificationOptions): Notification | null {
  if (!isNotificationSupported()) {
    console.warn('Browser notifications are not supported');
    return null;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return null;
  }

  try {
    const notification = new Notification(options.title, {
      body: options.body,
      icon: options.icon || '/favicon.ico',
      badge: options.badge || '/favicon.ico',
      tag: options.tag,
      requireInteraction: options.requireInteraction || false,
      silent: options.silent || false,
      data: options.data,
      // @ts-expect-error - actions are supported but TypeScript types might not include them
      actions: options.actions,
    });

    // Handle notification click
    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();

      // If there's a URL in the data, navigate to it
      if (options.data?.url && typeof options.data.url === 'string') {
        window.location.href = options.data.url;
      }

      notification.close();
    };

    return notification;
  } catch (error) {
    console.error('Error showing notification:', error);
    return null;
  }
}

/**
 * Check if the current tab is visible/active
 */
export function isTabVisible(): boolean {
  return document.visibilityState === 'visible';
}

/**
 * Smart notification - shows browser notification if tab is hidden,
 * or in-app toast if tab is visible
 */
export function smartNotify(
  options: BrowserNotificationOptions,
  inAppCallback?: () => void
): void {
  if (isTabVisible()) {
    // Tab is visible, use in-app notification
    if (inAppCallback) {
      inAppCallback();
    }
  } else {
    // Tab is hidden, use browser notification
    showBrowserNotification(options);
  }
}

/**
 * Store notification preference in localStorage
 */
export function setNotificationPreference(enabled: boolean): void {
  localStorage.setItem('browser-notifications-enabled', enabled ? 'true' : 'false');
}

/**
 * Get notification preference from localStorage
 */
export function getNotificationPreference(): boolean {
  const preference = localStorage.getItem('browser-notifications-enabled');
  return preference === 'true';
}

/**
 * Complete setup flow for browser notifications
 */
export async function setupBrowserNotifications(): Promise<{
  success: boolean;
  permission: NotificationPermission;
  message: string;
}> {
  if (!isNotificationSupported()) {
    return {
      success: false,
      permission: 'denied',
      message: 'Browser notifications are not supported on this device/browser.',
    };
  }

  const currentPermission = getNotificationPermission();

  if (currentPermission === 'granted') {
    setNotificationPreference(true);
    return {
      success: true,
      permission: 'granted',
      message: 'Browser notifications are already enabled.',
    };
  }

  if (currentPermission === 'denied') {
    return {
      success: false,
      permission: 'denied',
      message: 'Browser notifications are blocked. Please enable them in your browser settings.',
    };
  }

  // Request permission
  const permission = await requestNotificationPermission();

  if (permission === 'granted') {
    setNotificationPreference(true);
    // Show a test notification
    showBrowserNotification({
      title: 'Notifications Enabled! 🔔',
      body: "You'll now receive updates even when you're not on this page.",
      tag: 'setup-notification',
    });
    return {
      success: true,
      permission: 'granted',
      message: 'Browser notifications enabled successfully!',
    };
  }

  return {
    success: false,
    permission,
    message: 'Notification permission was denied.',
  };
}
