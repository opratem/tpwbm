import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { createNotification } from '@/lib/notification-service';

/**
 * POST /api/notifications/send - Create and send a notification (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only admins can send notifications
    if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, message, type, priority, targetAudience } = body;

    // Validate required fields
    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes = ['announcement', 'event', 'prayer_request', 'system', 'admin'];
    if (type && !validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid notification type' },
        { status: 400 }
      );
    }

    // Validate priority
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (priority && !validPriorities.includes(priority)) {
      return NextResponse.json(
        { error: 'Invalid priority' },
        { status: 400 }
      );
    }

    // Validate target audience
    const validAudiences = ['all', 'members', 'admin', 'specific'];
    if (targetAudience && !validAudiences.includes(targetAudience)) {
      return NextResponse.json(
        { error: 'Invalid target audience' },
        { status: 400 }
      );
    }

    // Create the notification
    const notification = await createNotification({
      title,
      message,
      type: type || 'announcement',
      priority: priority || 'medium',
      targetAudience: targetAudience || 'all',
      metadata: {
        sentBy: session.user.name || session.user.email,
        sentById: session.user.id,
      },
    });

    if (!notification) {
      return NextResponse.json(
        { error: 'Failed to create notification' },
        { status: 500 }
      );
    }

    console.log(`[NOTIFICATION] Admin ${session.user.email} sent notification: ${title}`);

    return NextResponse.json({
      success: true,
      message: 'Notification sent successfully',
      notification: {
        id: notification.id,
        title: notification.title,
        targetAudience: notification.targetAudience,
      },
    });

  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
