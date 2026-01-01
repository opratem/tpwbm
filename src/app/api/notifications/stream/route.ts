import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { getNotificationsForUser } from '@/lib/notification-service';
import { generateUUID } from '@/lib/utils';

// Configure runtime for edge or nodejs
export const runtime = 'nodejs';
// Configure max duration - 55 seconds for most platforms to prevent timeout
// On Vercel Pro this can be up to 300, but we'll be conservative
export const maxDuration = 300;
export const dynamic = 'force-dynamic';

// Active SSE connections for real-time broadcasting
// Note: In serverless, this is per-instance and won't persist across cold starts
const activeConnections = new Map<string, {
  controller: ReadableStreamDefaultController;
  userId: string;
  userRole: 'admin' | 'member' | 'visitor';
  lastNotificationId?: string;
}>();

/**
 * Broadcast a notification to all relevant active connections
 * This function is exported so other parts of the app can call it
 */
export function broadcastToConnections(notification: {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  targetAudience: string;
  specificUserIds?: string[];
  metadata?: Record<string, unknown>;
  actionUrl?: string | null;
  createdAt: Date;
}) {
  console.log(`[SSE] Broadcasting notification to ${activeConnections.size} connections:`, notification.title);

  const deadConnections: string[] = [];

  for (const [connectionId, connection] of activeConnections) {
    try {
      // Check if notification is relevant for this connection
      let shouldSend = false;

      if (notification.targetAudience === 'all') {
        shouldSend = true;
      } else if (notification.targetAudience === 'admin' && connection.userRole === 'admin') {
        shouldSend = true;
      } else if (notification.targetAudience === 'members' && (connection.userRole === 'admin' || connection.userRole === 'member')) {
        shouldSend = true;
      } else if (notification.targetAudience === 'specific' && notification.specificUserIds?.includes(connection.userId)) {
        shouldSend = true;
      }

      if (shouldSend) {
        const message = `data: ${JSON.stringify({
          type: 'notification',
          payload: {
            id: notification.id,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            priority: notification.priority,
            targetAudience: notification.targetAudience,
            metadata: notification.metadata,
            actionUrl: notification.actionUrl,
            read: false,
            createdAt: notification.createdAt,
          }
        })}\n\n`;

        try {
          connection.controller.enqueue(new TextEncoder().encode(message));
          console.log(`[SSE] Notification sent to connection: ${connectionId}`);
        } catch (error) {
          console.error(`[SSE] Failed to send to connection ${connectionId}:`, error);
          deadConnections.push(connectionId);
        }
      }
    } catch (error) {
      console.error(`[SSE] Error processing connection ${connectionId}:`, error);
      deadConnections.push(connectionId);
    }
  }

  // Clean up dead connections
  for (const connectionId of deadConnections) {
    console.log(`[SSE] Removing dead connection: ${connectionId}`);
    activeConnections.delete(connectionId);
  }

  if (deadConnections.length > 0) {
    console.log(`[SSE] Cleaned up ${deadConnections.length} dead connections. Active: ${activeConnections.size}`);
  }
}

/**
 * Get the count of active SSE connections
 */
export function getActiveConnectionCount(): number {
  return activeConnections.size;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const connectionId = searchParams.get('connectionId') || generateUUID();

    console.log(`[SSE] New connection request: ${connectionId} for user: ${session.user.id} (${session.user.role})`);

    // Create a readable stream for SSE
    const stream = new ReadableStream({
      async start(controller) {
        let heartbeatInterval: NodeJS.Timeout | null = null;
        let pollingInterval: NodeJS.Timeout | null = null;
        let isConnectionClosed = false;
        let autoCloseTimeout: NodeJS.Timeout | null = null;
        let lastSeenNotificationTime = new Date();

        const cleanupConnection = () => {
          if (isConnectionClosed) return;
          isConnectionClosed = true;

          if (heartbeatInterval) {
            clearInterval(heartbeatInterval);
            heartbeatInterval = null;
          }

          if (pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
          }

          if (autoCloseTimeout) {
            clearTimeout(autoCloseTimeout);
            autoCloseTimeout = null;
          }

          activeConnections.delete(connectionId);
          console.log(`[SSE] Connection closed: ${connectionId}, active: ${activeConnections.size}`);

          try {
            controller.close();
          } catch (error) {
            // Connection already closed
          }
        };

        const sendMessage = (data: unknown): boolean => {
          if (isConnectionClosed) return false;

          try {
            if (!data || typeof data !== 'object') {
              console.warn(`[SSE] Invalid data for message:`, data);
              return false;
            }

            const message = `data: ${JSON.stringify(data)}\n\n`;
            controller.enqueue(new TextEncoder().encode(message));
            return true;
          } catch (error) {
            console.error(`[SSE] Error sending message to ${connectionId}:`, error);
            cleanupConnection();
            return false;
          }
        };

        try {
          // Store connection for broadcasting
          activeConnections.set(connectionId, {
            controller,
            userId: session.user.id,
            userRole: session.user.role as 'admin' | 'member' | 'visitor'
          });

          console.log(`[SSE] Connection established: ${connectionId}, active: ${activeConnections.size}`);

          // Auto-close before timeout (290 seconds)
          autoCloseTimeout = setTimeout(() => {
            console.log(`[SSE] Auto-closing connection ${connectionId} to prevent timeout`);
            cleanupConnection();
          }, 290000);

          // Send connection established message
          if (!sendMessage({
            type: 'connected',
            payload: { connectionId, userId: session.user.id }
          })) return;

          // Fetch initial notifications from database
          try {
            const initialNotifications = await getNotificationsForUser(
              session.user.id,
              session.user.role as 'admin' | 'member' | 'visitor',
              20,
              true // Include read notifications
            );

            if (initialNotifications.length > 0) {
              sendMessage({
                type: 'initial_notifications',
                payload: initialNotifications.map(n => ({
                  id: n.id,
                  title: n.title,
                  message: n.message,
                  type: n.type,
                  priority: n.priority,
                  targetAudience: n.targetAudience,
                  metadata: n.metadata,
                  actionUrl: n.actionUrl,
                  read: n.read,
                  createdAt: n.createdAt,
                }))
              });

              // Track the latest notification time
              const latestTime = initialNotifications[0]?.createdAt;
              if (latestTime) {
                lastSeenNotificationTime = new Date(latestTime);
              }
            }
          } catch (error) {
            console.error(`[SSE] Error fetching initial notifications:`, error);
            // Continue even if we can't fetch initial notifications
          }

          // Poll for new notifications every 10 seconds
          // This ensures we catch notifications even if the broadcast didn't reach this instance
          pollingInterval = setInterval(async () => {
            if (isConnectionClosed) return;

            try {
              const newNotifications = await getNotificationsForUser(
                session.user.id,
                session.user.role as 'admin' | 'member' | 'visitor',
                10,
                false // Only unread
              );

              // Filter to only truly new notifications
              const trulyNew = newNotifications.filter(n =>
                new Date(n.createdAt) > lastSeenNotificationTime
              );

              for (const notification of trulyNew) {
                sendMessage({
                  type: 'notification',
                  payload: {
                    id: notification.id,
                    title: notification.title,
                    message: notification.message,
                    type: notification.type,
                    priority: notification.priority,
                    targetAudience: notification.targetAudience,
                    metadata: notification.metadata,
                    actionUrl: notification.actionUrl,
                    read: false,
                    createdAt: notification.createdAt,
                  }
                });

                // Update last seen time
                if (new Date(notification.createdAt) > lastSeenNotificationTime) {
                  lastSeenNotificationTime = new Date(notification.createdAt);
                }
              }
            } catch (error) {
              console.error(`[SSE] Error polling for notifications:`, error);
              // Don't close connection on polling error
            }
          }, 5000); // Poll every 5 seconds for faster notification delivery

          // Send heartbeat every 30 seconds
          heartbeatInterval = setInterval(() => {
            if (!sendMessage({
              type: 'heartbeat',
              payload: { timestamp: Date.now() }
            })) {
              cleanupConnection();
            }
          }, 30000);

          // Initial heartbeat
          sendMessage({
            type: 'heartbeat',
            payload: { timestamp: Date.now() }
          });

        } catch (error) {
          console.error(`[SSE] Error setting up connection ${connectionId}:`, error);
          cleanupConnection();
        }

        // Cleanup on connection close
        request.signal.addEventListener('abort', cleanupConnection);

        return cleanupConnection;
      },

      cancel() {
        console.log(`[SSE] Stream cancelled for connection: ${connectionId}`);
        activeConnections.delete(connectionId);
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Cache-Control',
        'X-Accel-Buffering': 'no', // Disable Nginx buffering
      },
    });
  } catch (error) {
    console.error('[SSE] Connection error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Health check / status endpoint
export async function POST(request: NextRequest) {
  const activeConnectionCount = activeConnections.size;

  return NextResponse.json({
    status: 'ok',
    activeConnections: activeConnectionCount,
    timestamp: new Date().toISOString()
  });
}
