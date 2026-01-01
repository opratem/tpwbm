import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import type { Notification } from '@/lib/notification';
import { generateUUID, isEventSourceSupported } from '@/lib/utils';
import { smartNotify, getNotificationPermission, getNotificationPreference } from '@/lib/browser-notification';

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
  const maxReconnectAttempts = 3;
  const reconnectAttemptsRef = useRef(0);
  const isReconnectingRef = useRef(false);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasShownErrorToastRef = useRef(false);
  const sessionErrorCountRef = useRef(0);
  const mountedRef = useRef(true);

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

    setState(prev => ({ ...prev, isConnected: false }));
  }, []);

  const connect = useCallback(() => {
    // Check if component is still mounted
    if (!mountedRef.current) {
      return;
    }

    // Check if SSE is supported
    if (!isEventSourceSupported()) {
      console.warn('EventSource not supported in this environment');
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

      console.log('Attempting SSE connection...');
      const eventSource = new EventSource(
        `/api/notifications/stream?connectionId=${connectionIdRef.current}`,
        {
          withCredentials: true
        }
      );

      // Longer timeout to account for server auto-close at 290s
      const connectionTimeout = 295000; // 295 seconds (just under 5 minutes)
      connectionTimeoutRef.current = setTimeout(() => {
        console.log('SSE connection timeout - server will auto-close, preparing for reconnect');
        // Don't close manually, let server close and trigger reconnect
      }, connectionTimeout);

      eventSource.onopen = () => {
        console.log('SSE connection established');
        setState(prev => ({ ...prev, isConnected: true, lastActivity: new Date() }));
        reconnectAttemptsRef.current = 0;
        isReconnectingRef.current = false;

        // Clear connection timeout since we're connected
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
          connectionTimeoutRef.current = null;
        }
      };

      eventSource.onmessage = (event) => {
        try {
          if (!event.data || event.data.trim() === '') {
            console.warn('Received empty SSE message');
            return;
          }

          const data = JSON.parse(event.data);

          setState(prev => ({ ...prev, lastActivity: new Date() }));

          switch (data.type) {
            case 'connected':
              console.log('SSE connection confirmed:', data.payload);
              break;

            case 'notification': {
              const newNotification = data.payload as Notification;
              console.log('New notification received:', newNotification);

              setState(prev => {
                const exists = prev.notifications.some(n => n.id === newNotification.id);
                if (exists) return prev;

                const updatedNotifications = [newNotification, ...prev.notifications];

                return {
                  ...prev,
                  notifications: updatedNotifications,
                  unreadCount: prev.unreadCount + (newNotification.read ? 0 : 1)
                };
              });

              // Show browser/toast notification based on priority and user preference
              const browserNotificationsEnabled = getNotificationPreference() &&
                                                  getNotificationPermission() === 'granted';

              if (newNotification.priority === 'high' || newNotification.priority === 'urgent') {
                if (browserNotificationsEnabled) {
                  // Use smart notification (browser if tab hidden, toast if visible)
                  smartNotify(
                    {
                      title: newNotification.title,
                      body: newNotification.message,
                      tag: newNotification.id,
                      requireInteraction: newNotification.priority === 'urgent',
                      data: {
                        url: newNotification.actionUrl,
                        notificationId: newNotification.id,
                      },
                    },
                    () => {
                      // In-app toast fallback
                      toast.warning(newNotification.title, {
                        description: newNotification.message,
                        duration: 6000,
                      });
                    }
                  );
                } else {
                  toast.warning(newNotification.title, {
                    description: newNotification.message,
                    duration: 6000,
                  });
                }
              } else if (session.user.role === 'admin' && newNotification.targetAudience === 'admin') {
                if (browserNotificationsEnabled) {
                  smartNotify(
                    {
                      title: newNotification.title,
                      body: newNotification.message,
                      tag: newNotification.id,
                      data: {
                        url: newNotification.actionUrl,
                        notificationId: newNotification.id,
                      },
                    },
                    () => {
                      toast.info(newNotification.title, {
                        description: newNotification.message,
                        duration: 4000,
                      });
                    }
                  );
                } else {
                  toast.info(newNotification.title, {
                    description: newNotification.message,
                    duration: 4000,
                  });
                }
              }
              break;
            }

            case 'initial_notifications': {
              const initialNotifications = data.payload as Notification[];
              console.log('Initial notifications loaded:', initialNotifications.length);

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
              console.log('Unknown SSE message type:', data.type);
          }
        } catch (error) {
          console.error('Error parsing SSE message:', error, 'Raw data:', event.data);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
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

        // Only attempt reconnection if authenticated and haven't exceeded max attempts
        if (!mountedRef.current) {
          console.log('Component unmounted, skipping reconnection');
          return;
        }

        if (session?.user && status === 'authenticated' && reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(3000 * 2 ** reconnectAttemptsRef.current, 30000); // Exponential backoff, max 30s
          reconnectAttemptsRef.current++;

          console.log(`Will reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);

          reconnectTimeoutRef.current = setTimeout(() => {
            if (session?.user && status === 'authenticated' && mountedRef.current) {
              connect();
            }
          }, delay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          console.error('Max reconnection attempts reached');
          if (process.env.NODE_ENV === 'production' && !hasShownErrorToastRef.current) {
            hasShownErrorToastRef.current = true;
            toast.error('Lost connection to real-time notifications', {
              description: 'Please refresh the page to reconnect',
              duration: 10000,
            });
          }
        }
      };

      eventSourceRef.current = eventSource;
    } catch (error) {
      console.error('Failed to establish SSE connection:', error);
      setState(prev => ({ ...prev, isConnected: false }));
      isReconnectingRef.current = false;

      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
    }
  }, [session, status]);

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
      console.error('Failed to mark notification as read:', error);
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
      console.error('Failed to mark all notifications as read:', error);
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

    if (status === 'authenticated' && session?.user && isEventSourceSupported()) {
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
