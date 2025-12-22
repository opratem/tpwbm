import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { filterNotificationsForUser, sortNotificationsByPriority, type Notification } from '@/lib/notification';
import { setBroadcastFunction } from '@/lib/notification-broadcaster';
import { generateUUID } from '@/lib/utils';

// Configure runtime for edge or nodejs
export const runtime = 'nodejs';
// Configure max duration - 55 seconds for most platforms to prevent timeout
// On Vercel Pro this can be up to 300, but we'll be conservative
export const maxDuration = 55;
export const dynamic = 'force-dynamic';

// Global notification store (in production, use Redis or a proper pub/sub system)
const notificationStore = new Map<string, Notification[]>();
const activeConnections = new Map<string, {
  controller: ReadableStreamDefaultController;
  userId: string;
  userRole: 'admin' | 'member' | 'visitor';
}>();

// Broadcast notification to all relevant connections
function broadcastNotification(notification: Notification) {
  console.log('Broadcasting notification:', notification.type, notification.title, `to ${activeConnections.size} connections`);

  // Add to store
  const currentNotifications = notificationStore.get('global') || [];
  currentNotifications.unshift(notification);

  // Keep only last 100 notifications
  if (currentNotifications.length > 100) {
    currentNotifications.splice(100);
  }

  notificationStore.set('global', currentNotifications);

  // Track failed connections for cleanup
  const deadConnections: string[] = [];

  // Send to relevant active connections
  for (const [connectionId, connection] of activeConnections) {
    try {
      const userNotifications = filterNotificationsForUser(
          [notification],
          connection.userId,
          connection.userRole
      );

      if (userNotifications.length > 0) {
        const message = `data: ${JSON.stringify({
          type: 'notification',
          payload: userNotifications[0]
        })}\n\n`;

        try {
          connection.controller.enqueue(new TextEncoder().encode(message));
          console.log(`Notification sent to connection: ${connectionId}`);
        } catch (error) {
          console.error(`Failed to send notification to connection ${connectionId}:`, error);
          deadConnections.push(connectionId);
        }
      }
    } catch (error) {
      console.error('Error sending notification to connection:', connectionId, error);
      deadConnections.push(connectionId);
    }
  }

  // Clean up dead connections
  deadConnections.forEach(connectionId => {
    console.log(`Removing dead connection: ${connectionId}`);
    activeConnections.delete(connectionId);
  });

  if (deadConnections.length > 0) {
    console.log(`Cleaned up ${deadConnections.length} dead connections. Active connections: ${activeConnections.size}`);
  }
}

// Connect the broadcast function to the notification broadcaster
setBroadcastFunction(broadcastNotification);

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const connectionId = searchParams.get('connectionId') || generateUUID();

    console.log(`New SSE connection request: ${connectionId} for user: ${session.user.id}`);

    // Create a readable stream for SSE
    const stream = new ReadableStream({
      start(controller) {
        let heartbeatInterval: NodeJS.Timeout | null = null;
        let isConnectionClosed = false;
        let autoCloseTimeout: NodeJS.Timeout | null = null;

        const cleanupConnection = () => {
          if (isConnectionClosed) return;
          isConnectionClosed = true;

          if (heartbeatInterval) {
            clearInterval(heartbeatInterval);
            heartbeatInterval = null;
          }

          if (autoCloseTimeout) {
            clearTimeout(autoCloseTimeout);
            autoCloseTimeout = null;
          }

          activeConnections.delete(connectionId);
          console.log(`Connection closed: ${connectionId}, active connections: ${activeConnections.size}`);

          try {
            controller.close();
          } catch (error) {
            // Connection already closed
          }
        };

        const sendMessage = (data: any) => {
          if (isConnectionClosed) return false;

          try {
            // Validate data before sending
            if (!data || typeof data !== 'object') {
              console.warn(`Invalid data for SSE message:`, data);
              return false;
            }

            const message = `data: ${JSON.stringify(data)}\n\n`;
            controller.enqueue(new TextEncoder().encode(message));
            return true;
          } catch (error) {
            console.error(`Error sending message to connection ${connectionId}:`, error);
            cleanupConnection();
            return false;
          }
        };

        try {
          // Store connection
          activeConnections.set(connectionId, {
            controller,
            userId: session.user.id,
            userRole: session.user.role as 'admin' | 'member' | 'visitor'
          });

          console.log(`Connection established: ${connectionId}, active connections: ${activeConnections.size}`);

          // Auto-close connection before maxDuration to prevent timeout
          // Close at 50 seconds (5 seconds before the 55 second limit)
          autoCloseTimeout = setTimeout(() => {
            console.log(`Auto-closing connection ${connectionId} to prevent timeout`);
            cleanupConnection();
          }, 50000);

          // Send connection established message
          if (!sendMessage({
            type: 'connected',
            payload: { connectionId, userId: session.user.id }
          })) return;

          // Send existing notifications
          const allNotifications = notificationStore.get('global') || [];
          const userNotifications = filterNotificationsForUser(
              allNotifications,
              session.user.id,
              session.user.role as 'admin' | 'member' | 'visitor'
          );

          const sortedNotifications = sortNotificationsByPriority(userNotifications);

          if (sortedNotifications.length > 0) {
            sendMessage({
              type: 'initial_notifications',
              payload: sortedNotifications.slice(0, 20) // Send last 20 notifications
            });
          }

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
          console.error(`Error setting up connection ${connectionId}:`, error);
          cleanupConnection();
        }

        // Cleanup on connection close
        request.signal.addEventListener('abort', cleanupConnection);

        // Additional cleanup for stream cancellation
        return cleanupConnection;
      },

      cancel() {
        console.log(`Stream cancelled for connection: ${connectionId}`);
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
    console.error('SSE connection error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Health check endpoint
export async function POST(request: NextRequest) {
  const activeConnectionCount = activeConnections.size;
  const notificationCount = notificationStore.get('global')?.length || 0;

  return NextResponse.json({
    status: 'ok',
    activeConnections: activeConnectionCount,
    totalNotifications: notificationCount,
    timestamp: new Date().toISOString()
  });
}
