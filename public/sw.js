/**
 * Service Worker for Push Notifications
 *
 * This service worker handles:
 * 1. Receiving push notifications from the server
 * 2. Displaying notifications to the user
 * 3. Handling notification clicks
 * 4. Background sync (optional)
 */

// Cache name for offline support
const CACHE_NAME = 'tpwbm-cache-v1';

// Default notification icon
const DEFAULT_ICON = '/favicon.ico';
const DEFAULT_BADGE = '/favicon.ico';

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('[SW] Service Worker installing...');

  // Skip waiting to activate immediately
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/favicon.ico',
      ]);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received:', event);

  let payload = {
    title: 'New Notification',
    body: 'You have a new notification',
    icon: DEFAULT_ICON,
    badge: DEFAULT_BADGE,
    data: {},
  };

  if (event.data) {
    try {
      const data = event.data.json();
      payload = {
        title: data.title || payload.title,
        body: data.body || payload.body,
        icon: data.icon || DEFAULT_ICON,
        badge: data.badge || DEFAULT_BADGE,
        tag: data.tag || undefined,
        data: data.data || {},
        actions: data.actions || [],
        requireInteraction: data.requireInteraction || false,
        silent: data.silent || false,
      };
    } catch (e) {
      console.error('[SW] Error parsing push data:', e);
      // Try as text
      payload.body = event.data.text();
    }
  }

  const options = {
    body: payload.body,
    icon: payload.icon,
    badge: payload.badge,
    tag: payload.tag,
    data: payload.data,
    actions: payload.actions,
    requireInteraction: payload.requireInteraction,
    silent: payload.silent,
    vibrate: [100, 50, 100], // Vibration pattern for mobile
    renotify: true, // Vibrate again if same tag
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});

// Notification click event - handle user interaction
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification.tag);

  // Close the notification
  event.notification.close();

  // Get the action clicked (if any)
  const action = event.action;
  const data = event.notification.data || {};

  let targetUrl = '/';

  // Handle different actions
  if (action === 'view') {
    targetUrl = data.url || '/';
  } else if (action === 'dismiss') {
    // Just close, don't navigate
    return;
  } else {
    // Default click - go to the URL in data or homepage
    targetUrl = data.url || '/members/notification';
  }

  // Focus on existing window or open new one
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Try to focus an existing window
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus();
            client.navigate(targetUrl);
            return;
          }
        }

        // No existing window, open new one
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});

// Notification close event - track dismissed notifications
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification dismissed:', event.notification.tag);

  // Optionally track dismissed notifications
  // Could send to analytics or update read status
});

// Background sync event (optional - for offline support)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'sync-notifications') {
    event.waitUntil(
      // Sync any pending notification reads
      syncPendingReads()
    );
  }
});

// Helper function to sync pending notification reads
async function syncPendingReads() {
  try {
    // Get pending reads from IndexedDB or localStorage
    // This is for offline support
    console.log('[SW] Syncing pending notification reads...');
  } catch (error) {
    console.error('[SW] Error syncing pending reads:', error);
  }
}

// Message event - receive messages from the main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Periodic background sync (for supported browsers)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-notifications') {
    event.waitUntil(
      checkForNewNotifications()
    );
  }
});

// Helper function to check for new notifications
async function checkForNewNotifications() {
  try {
    console.log('[SW] Checking for new notifications...');
    // Could fetch from API and show notifications
  } catch (error) {
    console.error('[SW] Error checking notifications:', error);
  }
}
