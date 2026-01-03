import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { notificationPreferences, type NotificationPreference } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export type NotificationPreferencesInput = {
  // Email preferences
  emailEnabled?: boolean;
  emailAnnouncements?: boolean;
  emailEvents?: boolean;
  emailPrayerRequests?: boolean;
  emailSystemAlerts?: boolean;

  // Push preferences
  pushEnabled?: boolean;
  pushAnnouncements?: boolean;
  pushEvents?: boolean;
  pushPrayerRequests?: boolean;
  pushSystemAlerts?: boolean;

  // In-app preferences
  inAppEnabled?: boolean;
  inAppAnnouncements?: boolean;
  inAppEvents?: boolean;
  inAppPrayerRequests?: boolean;
  inAppSystemAlerts?: boolean;

  // Frequency settings
  digestFrequency?: 'instant' | 'daily' | 'weekly';
  quietHoursEnabled?: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
};

/**
 * GET /api/notification-preferences - Get user's notification preferences
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const [prefs] = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, session.user.id))
      .limit(1);

    // Return default preferences if none exist
    if (!prefs) {
      const defaultPrefs: Omit<NotificationPreference, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: session.user.id,
        emailEnabled: true,
        emailAnnouncements: true,
        emailEvents: true,
        emailPrayerRequests: true,
        emailSystemAlerts: true,
        pushEnabled: true,
        pushAnnouncements: true,
        pushEvents: true,
        pushPrayerRequests: true,
        pushSystemAlerts: true,
        inAppEnabled: true,
        inAppAnnouncements: true,
        inAppEvents: true,
        inAppPrayerRequests: true,
        inAppSystemAlerts: true,
        digestFrequency: 'instant',
        quietHoursEnabled: false,
        quietHoursStart: null,
        quietHoursEnd: null,
      };

      return NextResponse.json({
        preferences: defaultPrefs,
        isDefault: true,
      });
    }

    return NextResponse.json({
      preferences: prefs,
      isDefault: false,
    });
  } catch (error) {
    console.error('Error getting notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to get notification preferences' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/notification-preferences - Update user's notification preferences
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body: NotificationPreferencesInput = await request.json();

    // Validate quiet hours format if provided
    if (body.quietHoursStart && !/^\d{2}:\d{2}$/.test(body.quietHoursStart)) {
      return NextResponse.json(
        { error: 'Invalid quiet hours start format. Use HH:MM' },
        { status: 400 }
      );
    }
    if (body.quietHoursEnd && !/^\d{2}:\d{2}$/.test(body.quietHoursEnd)) {
      return NextResponse.json(
        { error: 'Invalid quiet hours end format. Use HH:MM' },
        { status: 400 }
      );
    }

    // Check if preferences exist
    const [existing] = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, session.user.id))
      .limit(1);

    let preferences;

    if (existing) {
      // Update existing preferences
      const [updated] = await db
        .update(notificationPreferences)
        .set({
          ...body,
          updatedAt: new Date(),
        })
        .where(eq(notificationPreferences.userId, session.user.id))
        .returning();

      preferences = updated;
    } else {
      // Create new preferences
      const [created] = await db
        .insert(notificationPreferences)
        .values({
          userId: session.user.id,
          ...body,
        })
        .returning();

      preferences = created;
    }

    console.log(`[PREFS-API] Updated notification preferences for user ${session.user.email}`);

    return NextResponse.json({
      success: true,
      preferences,
      message: 'Notification preferences updated successfully',
    });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update notification preferences' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notification-preferences - Create initial preferences (same as PUT but explicit)
 */
export async function POST(request: NextRequest) {
  return PUT(request);
}
