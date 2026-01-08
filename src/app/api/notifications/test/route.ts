import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, hasAdminAccess } from "@/lib/auth";
import { notificationService } from '@/lib/notification-service';
import { getActiveConnectionCount } from '@/app/api/notifications/stream/route';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !hasAdminAccess(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: 'Notification system status',
      activeConnections: getActiveConnectionCount(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error checking notification status:', error);
    return NextResponse.json(
      { error: 'Failed to check notification status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !hasAdminAccess(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type = 'system_alert', ...data } = body;

    let notification;
    switch (type) {
      case 'prayer_request':
        notification = await notificationService.newPrayerRequest({
          requestId: data.requestId || 'test-123',
          requestTitle: data.title || 'Test Prayer Request',
          requesterName: data.requester || 'Test User'
        });
        break;

      case 'announcement':
        notification = await notificationService.newAnnouncement({
          announcementId: data.announcementId || 'test-456',
          title: data.title || 'Test Announcement',
          author: data.author || session.user.name || 'Admin'
        });
        break;

      case 'event':
        notification = await notificationService.newEvent({
          eventId: data.eventId || 'test-789',
          title: data.title || 'Test Event',
          date: data.date || new Date().toLocaleDateString(),
          organizer: data.organizer || session.user.name || 'Admin'
        });
        break;

      case 'membership_request':
        notification = await notificationService.newMembershipRequest({
          requestId: data.requestId || 'test-member-123',
          name: data.name || 'Test User',
          email: data.email || 'test@example.com'
        });
        break;

      case 'system_alert':
      default:
        notification = await notificationService.systemAlert({
          title: data.title || 'Test System Alert',
          message: data.message || 'This is a test notification from the admin panel.',
          priority: data.priority || 'normal',
          url: data.url
        });
        break;
    }

    if (!notification) {
      return NextResponse.json(
        { error: 'Failed to create notification' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Test notification created successfully',
      notification: {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        priority: notification.priority
      }
    });

  } catch (error) {
    console.error('Error sending test notification:', error);
    return NextResponse.json(
      { error: 'Failed to send test notification' },
      { status: 500 }
    );
  }
}
