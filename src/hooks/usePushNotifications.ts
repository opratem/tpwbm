'use client';

import { useState, useEffect, useCallback } from 'react';

export interface PushSubscriptionState {
  isSupported: boolean;
  isSubscribed: boolean;
  isLoading: boolean;
  error: string | null;
  permission: NotificationPermission | 'unsupported';
  vapidPublicKey: string | null;
}

export interface UsePushNotificationsReturn extends PushSubscriptionState {
  subscribe: (deviceName?: string) => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  checkSubscription: () => Promise<void>;
}

/**
 * Convert a base64 string to Uint8Array for VAPID key
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * Hook for managing push notification subscriptions
 */
export function usePushNotifications(): UsePushNotificationsReturn {
  const [state, setState] = useState<PushSubscriptionState>({
    isSupported: false,
    isSubscribed: false,
    isLoading: true,
    error: null,
    permission: 'unsupported',
    vapidPublicKey: null,
  });

  // Check if push notifications are supported
  const checkSupport = useCallback(() => {
    const isSupported =
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window;

    const permission: NotificationPermission | 'unsupported' = isSupported
      ? Notification.permission
      : 'unsupported';

    return { isSupported, permission };
  }, []);

  // Register service worker
  const registerServiceWorker = useCallback(async (): Promise<ServiceWorkerRegistration | null> => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('[PUSH] Service worker registered:', registration.scope);

      // Wait for the service worker to be ready
      await navigator.serviceWorker.ready;

      return registration;
    } catch (error) {
      console.error('[PUSH] Service worker registration failed:', error);
      return null;
    }
  }, []);

  // Check current subscription status
  const checkSubscription = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const { isSupported, permission } = checkSupport();

      if (!isSupported) {
        setState({
          isSupported: false,
          isSubscribed: false,
          isLoading: false,
          error: null,
          permission: 'unsupported',
          vapidPublicKey: null,
        });
        return;
      }

      // Get VAPID key and subscription info from server
      const response = await fetch('/api/push-subscriptions');
      const data = await response.json();

      if (!data.isConfigured) {
        setState({
          isSupported,
          isSubscribed: false,
          isLoading: false,
          error: 'Push notifications are not configured on the server',
          permission,
          vapidPublicKey: null,
        });
        return;
      }

      // Check if there's an active subscription
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      setState({
        isSupported,
        isSubscribed: !!subscription,
        isLoading: false,
        error: null,
        permission,
        vapidPublicKey: data.vapidPublicKey,
      });
    } catch (error) {
      console.error('[PUSH] Error checking subscription:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to check subscription status',
      }));
    }
  }, [checkSupport]);

  // Subscribe to push notifications
  const subscribe = useCallback(async (deviceName?: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();

      if (permission !== 'granted') {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          permission,
          error: 'Notification permission denied',
        }));
        return false;
      }

      // Get VAPID public key
      const configResponse = await fetch('/api/push-subscriptions');
      const configData = await configResponse.json();

      if (!configData.vapidPublicKey) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Push notifications are not configured',
        }));
        return false;
      }

      // Register service worker
      const registration = await registerServiceWorker();
      if (!registration) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Failed to register service worker',
        }));
        return false;
      }

      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(configData.vapidPublicKey),
      });

      // Send subscription to server
      const subscriptionJson = subscription.toJSON();
      const response = await fetch('/api/push-subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscriptionJson.keys?.p256dh,
              auth: subscriptionJson.keys?.auth,
            },
          },
          deviceName: deviceName || getDeviceName(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save subscription');
      }

      setState((prev) => ({
        ...prev,
        isSubscribed: true,
        isLoading: false,
        permission: 'granted',
        error: null,
      }));

      console.log('[PUSH] Successfully subscribed');
      return true;
    } catch (error) {
      console.error('[PUSH] Subscription failed:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Subscription failed',
      }));
      return false;
    }
  }, [registerServiceWorker]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Unsubscribe from push manager
        await subscription.unsubscribe();

        // Remove from server
        await fetch('/api/push-subscriptions', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
      }

      setState((prev) => ({
        ...prev,
        isSubscribed: false,
        isLoading: false,
        error: null,
      }));

      console.log('[PUSH] Successfully unsubscribed');
      return true;
    } catch (error) {
      console.error('[PUSH] Unsubscribe failed:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unsubscribe failed',
      }));
      return false;
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  return {
    ...state,
    subscribe,
    unsubscribe,
    checkSubscription,
  };
}

/**
 * Get a human-readable device name
 */
function getDeviceName(): string {
  const ua = navigator.userAgent;

  if (/iPhone/.test(ua)) return 'iPhone';
  if (/iPad/.test(ua)) return 'iPad';
  if (/Android/.test(ua)) {
    if (/Mobile/.test(ua)) return 'Android Phone';
    return 'Android Tablet';
  }
  if (/Windows/.test(ua)) return 'Windows PC';
  if (/Mac/.test(ua)) return 'Mac';
  if (/Linux/.test(ua)) return 'Linux PC';

  return 'Unknown Device';
}

export default usePushNotifications;
