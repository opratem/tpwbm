import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import {
  getNotificationsForUser,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount
} from '@/lib/notification-service';

/**
 * GET /api/notifications - Fetch notifications for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const includeRead = searchParams.get('includeRead') === 'true';

    const notifications = await getNotificationsForUser(
      session.user.id,
      session.user.role as 'admin' | 'member' | 'visitor',
      limit,
      includeRead
    );

    const unreadCount = await getUnreadNotificationCount(
      session.user.id,
      session.user.role as 'admin' | 'member' | 'visitor'
    );

    return NextResponse.json({
      notifications,
      unreadCount,
      total: notifications.length
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notifications - Mark notification(s) as read
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, notificationId } = body;

    if (action === 'mark_all_read') {
      const success = await markAllNotificationsAsRead(
        session.user.id,
        session.user.role as 'admin' | 'member' | 'visitor'
      );

      if (success) {
        return NextResponse.json({ message: 'All notifications marked as read' });
      } else {
        return NextResponse.json(
          { error: 'Failed to mark all notifications as read' },
          { status: 500 }
        );
      }
    }

    if (action === 'mark_read' && notificationId) {
      const success = await markNotificationAsRead(notificationId, session.user.id);

      if (success) {
        return NextResponse.json({ message: 'Notification marked as read' });
      } else {
        return NextResponse.json(
          { error: 'Failed to mark notification as read' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "mark_read" or "mark_all_read"' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}
