import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { notificationService } from '@/lib/notification-service';

/**
 * POST /api/notifications/send - Send notifications (admin only)
 *
 * Supports various notification types:
 * - sermon: New sermon/audio upload notification
 * - announcement: Custom announcement notification
 * - system: System-wide notification
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

    // Only admins can send notifications
    if (session.user.role !== 'admin' && session.user.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: type and data' },
        { status: 400 }
      );
    }

    let notification = null;

    switch (type) {
      case 'sermon':
        // Validate sermon data
        if (!data.title || !data.speaker || !data.mediaType) {
          return NextResponse.json(
            { error: 'Sermon notification requires: title, speaker, mediaType (video/audio)' },
            { status: 400 }
          );
        }
        notification = await notificationService.newSermon({
          sermonId: data.sermonId || data.title.toLowerCase().replace(/\s+/g, '-'),
          title: data.title,
          speaker: data.speaker,
          type: data.mediaType as 'video' | 'audio',
        });
        break;

      case 'announcement':
        // Validate announcement data
        if (!data.title || !data.message) {
          return NextResponse.json(
            { error: 'Announcement notification requires: title, message' },
            { status: 400 }
          );
        }
        notification = await notificationService.newAnnouncement({
          announcementId: data.announcementId || Date.now().toString(),
          title: data.title,
          author: session.user.name || 'Admin',
        });
        break;

      case 'system':
        // Validate system alert data
        if (!data.title || !data.message) {
          return NextResponse.json(
            { error: 'System notification requires: title, message' },
            { status: 400 }
          );
        }
        notification = await notificationService.systemAlert({
          title: data.title,
          message: data.message,
          priority: data.priority || 'normal',
          url: data.url,
        });
        break;

      case 'custom':
        // Custom notification with full control
        if (!data.title || !data.message) {
          return NextResponse.json(
            { error: 'Custom notification requires: title, message' },
            { status: 400 }
          );
        }
        notification = await notificationService.custom({
          title: data.title,
          message: data.message,
          type: data.notificationType || 'system',
          priority: data.priority || 'medium',
          targetAudience: data.targetAudience || 'all',
          actionUrl: data.actionUrl,
          metadata: data.metadata,
        });
        break;

      default:
        return NextResponse.json(
          { error: `Unknown notification type: ${type}. Supported types: sermon, announcement, system, custom` },
          { status: 400 }
        );
    }

    if (!notification) {
      return NextResponse.json(
        { error: 'Failed to create notification' },
        { status: 500 }
      );
    }

    console.log(`[NOTIFICATION-SEND] ${type} notification sent by ${session.user.email}: ${notification.id}`);

    return NextResponse.json({
      success: true,
      message: 'Notification sent successfully',
      notification: {
        id: notification.id,
        title: notification.title,
        type: notification.type,
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

/**
 * GET /api/notifications/send - Get available notification types
 */
export async function GET() {
  return NextResponse.json({
    types: [
      {
        type: 'sermon',
        description: 'Notify members about new sermon/audio uploads',
        requiredFields: ['title', 'speaker', 'mediaType'],
        example: {
          type: 'sermon',
          data: {
            title: 'Sunday Service - Walking in Faith',
            speaker: 'Pastor John',
            mediaType: 'video', // or 'audio'
            sermonId: 'optional-custom-id',
          },
        },
      },
      {
        type: 'announcement',
        description: 'Send a general announcement notification',
        requiredFields: ['title', 'message'],
        example: {
          type: 'announcement',
          data: {
            title: 'Important Update',
            message: 'Church service times have changed',
            announcementId: 'optional-id',
          },
        },
      },
      {
        type: 'system',
        description: 'Send a system alert (admin only audience)',
        requiredFields: ['title', 'message'],
        example: {
          type: 'system',
          data: {
            title: 'System Maintenance',
            message: 'The website will be down for maintenance',
            priority: 'high', // low, normal, high, urgent
            url: '/admin/dashboard',
          },
        },
      },
      {
        type: 'custom',
        description: 'Send a fully customized notification',
        requiredFields: ['title', 'message'],
        example: {
          type: 'custom',
          data: {
            title: 'Custom Notification',
            message: 'This is a custom message',
            notificationType: 'event', // announcement, event, prayer_request, system, admin
            priority: 'medium',
            targetAudience: 'members', // all, members, admin, specific
            actionUrl: '/events',
            metadata: { customField: 'value' },
          },
        },
      },
    ],
  });
}
