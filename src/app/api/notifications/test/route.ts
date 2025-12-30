import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { notificationSender, getBroadcasterStatus } from '@/lib/notification-broadcaster';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const status = getBroadcasterStatus();
    return NextResponse.json({
      message: 'Notification system status',
      ...status
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

    if (!session || session.user.role !== 'admin') {
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
        notification = notificationSender.newPrayerRequest({
          requestId: data.requestId || 'test-123',
          requestTitle: data.title || 'Test Prayer Request',
          requesterName: data.requester || 'Test User'
        });
        break;

      case 'announcement':
        notification = notificationSender.newAnnouncement({
          announcementId: data.announcementId || 'test-456',
          title: data.title || 'Test Announcement',
          author: data.author || session.user.name || 'Admin'
        });
        break;

      case 'system_alert':
      default:
        notification = notificationSender.systemAlert({
          title: data.title || 'Test System Alert',
          message: data.message || 'This is a test notification from the admin panel.',
          priority: data.priority || 'normal',
          url: data.url
        });
        break;
    }

    return NextResponse.json({
      message: 'Test notification sent successfully',
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
