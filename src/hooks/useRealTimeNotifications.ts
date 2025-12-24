import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import type { Notification } from '@/lib/notification';
import { generateUUID, isEventSourceSupported } from '@/lib/utils';

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
  const maxReconnectAttempts = 3; // Reduced from 5 to prevent spam
  const reconnectAttemptsRef = useRef(0);
  const isReconnectingRef = useRef(false);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasShownErrorToastRef = useRef(false); // Prevent error toast spam
  const sessionErrorCountRef = useRef(0); // Track session errors to detect authentication issues

  const connect = useCallback(() => {
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
    if (isReconnectingRef.current) {
      console.log('Connection attempt already in progress');
      return;
    }

    isReconnectingRef.current = true;

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

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
          withCredentials: false // Set explicitly for clarity
        }
      );

      // Set a timeout for connection establishment (longer for production)
      // Production environments may have slower cold starts
      const connectionTimeout = 50000; // 50 seconds
      connectionTimeoutRef.current = setTimeout(() => {
        if (!state.isConnected) {
          console.warn('SSE connection timeout - closing and will retry');
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
          }
          isReconnectingRef.current = false;
        }
      }, connectionTimeout);

      eventSource.onopen = () => {
        console.log('SSE connection established');
        setState(prev => ({ ...prev, isConnected: true, lastActivity: new Date() }));
        reconnectAttemptsRef.current = 0; // Reset reconnect attempts on successful connection
        isReconnectingRef.current = false;

        // Clear connection timeout since we're connected
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
          connectionTimeoutRef.current = null;
        }
      };

      eventSource.onmessage = (event) => {
        try {
          // Validate that event.data exists and is not empty
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

              // Show toast notification for high priority or admin notifications
              if (newNotification.priority === 'high' || newNotification.priority === 'urgent') {
                toast.warning(newNotification.title, {
                  description: newNotification.message,
                  duration: 6000,
                });
              } else if (session.user.role === 'admin' && newNotification.targetAudience === 'admin') {
                toast.info(newNotification.title, {
                  description: newNotification.message,
                  duration: 4000,
                });
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

        // Only attempt reconnection if we haven't exceeded max attempts
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * 2 ** reconnectAttemptsRef.current, 15000); // Max 15s delay
          reconnectAttemptsRef.current++;

          console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current})`);

          reconnectTimeoutRef.current = setTimeout(() => {
            if (session?.user && status === 'authenticated') {
              connect();
            }
          }, delay);
        } else {
          console.error('Max reconnection attempts reached');
          // Don't show error toast in development to reduce noise
          if (process.env.NODE_ENV === 'production') {
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

      // Clear connection timeout
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
    }
  }, [session, status, state.isConnected]);

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

  const markAsRead = useCallback((notificationId: string) => {
    setState(prev => {
      const updatedNotifications = prev.notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      );

      const unreadCount = updatedNotifications.filter(n => !n.read).length;

      return {
        ...prev,
        notifications: updatedNotifications,
        unreadCount
      };
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0
    }));
  }, []);

  const removeNotification = useCallback((notificationId: string) => {
    setState(prev => {
      const updatedNotifications = prev.notifications.filter(n => n.id !== notificationId);
      const unreadCount = updatedNotifications.filter(n => !n.read).length;

      return {
        ...prev,
        notifications: updatedNotifications,
        unreadCount
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
    reconnectAttemptsRef.current = 0; // Reset attempts
    isReconnectingRef.current = false;
    disconnect();
    setTimeout(connect, 1000); // Small delay before reconnecting
  }, [connect, disconnect]);

  // Effect to establish connection with better lifecycle management
  useEffect(() => {
    let shouldConnect = false;

    if (status === 'authenticated' && session?.user && isEventSourceSupported()) {
      shouldConnect = true;
      connect();
    } else if (status === 'unauthenticated') {
      disconnect();
    }

    return () => {
      if (shouldConnect) {
        disconnect();
      }
    };
  }, [connect, disconnect, session?.user, status]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

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
