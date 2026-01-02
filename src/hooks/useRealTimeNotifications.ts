import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import type { Notification } from '@/lib/notification';
import { generateUUID, isEventSourceSupported } from '@/lib/utils';
import { getNotificationPermission, getNotificationPreference, showBrowserNotification } from '@/lib/browser-notification';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  lastActivity: Date | null;
}

export interface UseRealTimeNotificationsResult {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  lastActivity: Date | null;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAll: () => void;
  reconnect: () => void;
}

// Get icon for notification type
function getNotificationIcon(type: string): string {
  switch (type) {
    case 'announcement': return '📢';
    case 'event': return '📅';
    case 'prayer_request': return '🙏';
    case 'admin': return '⚙️';
    case 'system': return '🔔';
    default: return '🔔';
  }
}

export function useRealTimeNotifications(): UseRealTimeNotificationsResult {
  const { data: session, status } = useSession();
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    unreadCount: 0,
    isConnected: false,
    lastActivity: null
  });

  const eventSourceRef = useRef<EventSource | null>(null);
  const connectionIdRef = useRef<string | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxReconnectAttempts = 5;
  const reconnectAttemptsRef = useRef(0);
  const isReconnectingRef = useRef(false);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasShownErrorToastRef = useRef(false);
  const sessionErrorCountRef = useRef(0);
  const mountedRef = useRef(true);
  const httpPollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const seenNotificationIdsRef = useRef<Set<string>>(new Set());

  const disconnect = useCallback(() => {
    isReconnectingRef.current = false;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }

    if (httpPollingIntervalRef.current) {
      clearInterval(httpPollingIntervalRef.current);
      httpPollingIntervalRef.current = null;
    }

    setState(prev => ({ ...prev, isConnected: false }));
  }, []);

  /**
   * Show notification toast and browser notification
   */
  const showNotificationAlert = useCallback((notification: Notification, userRole: string) => {
    const icon = getNotificationIcon(notification.type);
    const browserNotificationsEnabled = getNotificationPreference() &&
                                        getNotificationPermission() === 'granted';

    console.log(`[NOTIFICATION] Showing alert for: ${notification.title} (priority: ${notification.priority})`);

    // Determine if this is a high-priority notification
    const isHighPriority = notification.priority === 'high' || notification.priority === 'urgent';
    const isAdminNotification = userRole === 'admin' && notification.targetAudience === 'admin';

    // Always show toast for new notifications
    const toastOptions = {
      duration: isHighPriority ? 8000 : 5000,
      description: notification.message,
    };

    if (notification.priority === 'urgent') {
      toast.error(`${icon} ${notification.title}`, toastOptions);
    } else if (notification.priority === 'high') {
      toast.warning(`${icon} ${notification.title}`, toastOptions);
    } else if (isAdminNotification) {
      toast.info(`${icon} ${notification.title}`, toastOptions);
    } else {
      toast.success(`${icon} ${notification.title}`, toastOptions);
    }

    // Show browser notification for ALL new notifications when browser notifications are enabled
    // Not just when tab is hidden - users want to know even if on another tab
    if (browserNotificationsEnabled) {
      showBrowserNotification({
        title: notification.title,
        body: notification.message,
        tag: notification.id,
        requireInteraction: notification.priority === 'urgent',
        data: {
          url: notification.actionUrl,
          notificationId: notification.id,
        },
      });
    }
  }, []);

  /**
   * HTTP polling fallback for when SSE doesn't work
   */
  const pollNotifications = useCallback(async () => {
    if (!session?.user || !mountedRef.current) return;

    try {
      const response = await fetch('/api/notifications?includeRead=true&limit=50');
      if (!response.ok) {
        console.error('[HTTP POLL] Failed to fetch notifications:', response.status);
        return;
      }

      const data = await response.json();
      const fetchedNotifications = data.notifications || [];

      // Find new notifications that we haven't seen
      const newNotifications = fetchedNotifications.filter(
        (n: Notification) => !seenNotificationIdsRef.current.has(n.id)
      );

      if (newNotifications.length > 0) {
        console.log(`[HTTP POLL] Found ${newNotifications.length} new notifications`);

        // Add new notification IDs to seen set
        for (const n of newNotifications) {
          seenNotificationIdsRef.current.add(n.id);
        }

        setState(prev => {
          const existingIds = new Set(prev.notifications.map(n => n.id));
          const trulyNew = newNotifications.filter((n: Notification) => !existingIds.has(n.id));

          if (trulyNew.length === 0) return prev;

          // Show alerts for truly new unread notifications
          for (const notification of trulyNew) {
            if (!notification.read) {
              showNotificationAlert(notification, session.user.role);
            }
          }

          return {
            ...prev,
            notifications: [...trulyNew, ...prev.notifications],
            unreadCount: prev.unreadCount + trulyNew.filter((n: Notification) => !n.read).length,
            lastActivity: new Date()
          };
        });
      }
    } catch (error) {
      console.error('[HTTP POLL] Error polling notifications:', error);
    }
  }, [session, showNotificationAlert]);

  /**
   * Start HTTP polling as fallback
   */
  const startHttpPolling = useCallback(() => {
    if (httpPollingIntervalRef.current) {
      clearInterval(httpPollingIntervalRef.current);
    }

    console.log('[HTTP POLL] Starting HTTP polling fallback (every 5 seconds)');

    // Poll immediately
    pollNotifications();

    // Then poll every 5 seconds
    httpPollingIntervalRef.current = setInterval(() => {
      if (mountedRef.current) {
        pollNotifications();
      }
    }, 5000);
  }, [pollNotifications]);

  const connect = useCallback(() => {
    // Check if component is still mounted
    if (!mountedRef.current) {
      return;
    }

    // Check if SSE is supported
    if (!isEventSourceSupported()) {
      console.warn('EventSource not supported, using HTTP polling fallback');
      startHttpPolling();
      return;
    }

    if (!session?.user || status !== 'authenticated') {
      console.log('Not authenticated, skipping SSE connection');
      sessionErrorCountRef.current++;

      // If we've had multiple session errors, likely an auth config issue
      if (sessionErrorCountRef.current > 5 && !hasShownErrorToastRef.current) {
        console.error('Multiple authentication failures detected. Check NEXTAUTH_URL configuration.');
        hasShownErrorToastRef.current = true;
      }
      return;
    }

    // Reset session error counter on successful authentication
    sessionErrorCountRef.current = 0;

    // Clear any existing timeout
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }

    // Prevent multiple simultaneous connection attempts
    if (isReconnectingRef.current || eventSourceRef.current) {
      console.log('Connection already exists or in progress');
      return;
    }

    isReconnectingRef.current = true;

    // Clear any pending reconnection
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    try {
      // Generate connection ID if not exists
      if (!connectionIdRef.current) {
        connectionIdRef.current = generateUUID();
      }

      console.log('[SSE] Attempting connection...');
      const eventSource = new EventSource(
        `/api/notifications/stream?connectionId=${connectionIdRef.current}`,
        {
          withCredentials: true
        }
      );

      // Longer timeout to account for server auto-close at 290s
      const connectionTimeout = 295000; // 295 seconds (just under 5 minutes)
      connectionTimeoutRef.current = setTimeout(() => {
        console.log('[SSE] Connection timeout - server will auto-close, preparing for reconnect');
        // Don't close manually, let server close and trigger reconnect
      }, connectionTimeout);

      eventSource.onopen = () => {
        console.log('[SSE] Connection established');
        setState(prev => ({ ...prev, isConnected: true, lastActivity: new Date() }));
        reconnectAttemptsRef.current = 0;
        isReconnectingRef.current = false;

        // Stop HTTP polling if SSE is connected
        if (httpPollingIntervalRef.current) {
          clearInterval(httpPollingIntervalRef.current);
          httpPollingIntervalRef.current = null;
          console.log('[SSE] Stopped HTTP polling fallback');
        }

        // Clear connection timeout since we're connected
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
          connectionTimeoutRef.current = null;
        }
      };

      eventSource.onmessage = (event) => {
        try {
          if (!event.data || event.data.trim() === '') {
            console.warn('[SSE] Received empty message');
            return;
          }

          const data = JSON.parse(event.data);

          setState(prev => ({ ...prev, lastActivity: new Date() }));

          switch (data.type) {
            case 'connected':
              console.log('[SSE] Connection confirmed:', data.payload);
              break;

            case 'notification': {
              const newNotification = data.payload as Notification;
              console.log('[SSE] New notification received:', newNotification.id, newNotification.title);

              // Add to seen set
              seenNotificationIdsRef.current.add(newNotification.id);

              setState(prev => {
                const exists = prev.notifications.some(n => n.id === newNotification.id);
                if (exists) {
                  console.log('[SSE] Notification already exists, skipping');
                  return prev;
                }

                const updatedNotifications = [newNotification, ...prev.notifications];

                return {
                  ...prev,
                  notifications: updatedNotifications,
                  unreadCount: prev.unreadCount + (newNotification.read ? 0 : 1)
                };
              });

              // Show toast and browser notification for new notifications
              // Only show if not already read
              if (!newNotification.read) {
                showNotificationAlert(newNotification, session.user.role);
              }
              break;
            }

            case 'initial_notifications': {
              const initialNotifications = data.payload as Notification[];
              console.log('[SSE] Initial notifications loaded:', initialNotifications.length);

              // Add all to seen set
              for (const n of initialNotifications) {
                seenNotificationIdsRef.current.add(n.id);
              }

              setState(prev => ({
                ...prev,
                notifications: initialNotifications,
                unreadCount: initialNotifications.filter(n => !n.read).length
              }));
              break;
            }

            case 'heartbeat':
              // Update last activity timestamp
              setState(prev => ({ ...prev, lastActivity: new Date() }));
              break;

            default:
              console.log('[SSE] Unknown message type:', data.type);
          }
        } catch (error) {
          console.error('[SSE] Error parsing message:', error, 'Raw data:', event.data);
        }
      };

      eventSource.onerror = (error) => {
        console.error('[SSE] Connection error:', error);
        setState(prev => ({ ...prev, isConnected: false }));
        isReconnectingRef.current = false;

        // Clear connection timeout
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
          connectionTimeoutRef.current = null;
        }

        // Close the failed connection
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }

        // Start HTTP polling as fallback
        if (mountedRef.current && !httpPollingIntervalRef.current) {
          console.log('[SSE] SSE failed, starting HTTP polling fallback');
          startHttpPolling();
        }

        // Only attempt reconnection if authenticated and haven't exceeded max attempts
        if (!mountedRef.current) {
          console.log('[SSE] Component unmounted, skipping reconnection');
          return;
        }

        if (session?.user && status === 'authenticated' && reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(5000 * 2 ** reconnectAttemptsRef.current, 60000); // Exponential backoff, max 60s
          reconnectAttemptsRef.current++;

          console.log(`[SSE] Will reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);

          reconnectTimeoutRef.current = setTimeout(() => {
            if (session?.user && status === 'authenticated' && mountedRef.current) {
              connect();
            }
          }, delay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          console.error('[SSE] Max reconnection attempts reached, using HTTP polling only');
          // HTTP polling is already running as fallback
        }
      };

      eventSourceRef.current = eventSource;
    } catch (error) {
      console.error('[SSE] Failed to establish connection:', error);
      setState(prev => ({ ...prev, isConnected: false }));
      isReconnectingRef.current = false;

      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }

      // Start HTTP polling as fallback
      if (mountedRef.current && !httpPollingIntervalRef.current) {
        startHttpPolling();
      }
    }
  }, [session, status, showNotificationAlert, startHttpPolling]);

  // Mark notification as read - now calls the API
  const markAsRead = useCallback(async (notificationId: string) => {
    // Optimistically update local state
    setState(prev => {
      const notification = prev.notifications.find(n => n.id === notificationId);
      if (!notification || notification.read) return prev;

      const updatedNotifications = prev.notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      );

      return {
        ...prev,
        notifications: updatedNotifications,
        unreadCount: Math.max(0, prev.unreadCount - 1)
      };
    });

    // Call API to persist the read status
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_read', notificationId }),
      });
    } catch (error) {
      console.error('[NOTIFICATION] Failed to mark as read:', error);
      // Don't revert optimistic update - the local state is still useful
    }
  }, []);

  // Mark all notifications as read - now calls the API
  const markAllAsRead = useCallback(async () => {
    // Optimistically update local state
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0
    }));

    // Call API to persist
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_all_read' }),
      });
    } catch (error) {
      console.error('[NOTIFICATION] Failed to mark all as read:', error);
    }
  }, []);

  const removeNotification = useCallback((notificationId: string) => {
    setState(prev => {
      const notification = prev.notifications.find(n => n.id === notificationId);
      const wasUnread = notification && !notification.read;
      const updatedNotifications = prev.notifications.filter(n => n.id !== notificationId);

      return {
        ...prev,
        notifications: updatedNotifications,
        unreadCount: wasUnread ? Math.max(0, prev.unreadCount - 1) : prev.unreadCount
      };
    });
  }, []);

  const clearAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      notifications: [],
      unreadCount: 0
    }));
  }, []);

  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    isReconnectingRef.current = false;
    hasShownErrorToastRef.current = false;
    disconnect();
    setTimeout(connect, 1000);
  }, [connect, disconnect]);

  // Single effect to manage connection lifecycle
  useEffect(() => {
    mountedRef.current = true;

    if (status === 'authenticated' && session?.user) {
      // Small delay to ensure session is fully established
      const initTimeout = setTimeout(() => {
        if (mountedRef.current) {
          connect();
        }
      }, 500);

      return () => {
        clearTimeout(initTimeout);
        mountedRef.current = false;
        disconnect();
      };
    }

    if (status === 'unauthenticated') {
      disconnect();
    }

    return () => {
      mountedRef.current = false;
      disconnect();
    };
  }, [session?.user, status, connect, disconnect]);

  return {
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    isConnected: state.isConnected,
    lastActivity: state.lastActivity,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    reconnect
  };
}

