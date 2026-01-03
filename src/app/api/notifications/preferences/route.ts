/**
 * API Route: Notification Preferences
 * GET/PUT /api/notifications/preferences
 *
 * Manages user notification preferences.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { notificationPreferences } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Default preferences matching schema
const defaultPreferences = {
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

// GET - Get user's notification preferences
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const preferences = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, session.user.id))
      .limit(1);

    if (preferences.length === 0) {
      // Return defaults if no preferences saved
      return NextResponse.json({
        preferences: {
          ...defaultPreferences,
          userId: session.user.id,
        },
        isDefault: true,
      });
    }

    return NextResponse.json({
      preferences: preferences[0],
      isDefault: false,
    });
  } catch (error) {
    console.error('[API] Get preferences error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update user's notification preferences
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      emailEnabled,
      emailAnnouncements,
      emailEvents,
      emailPrayerRequests,
      emailSystemAlerts,
      pushEnabled,
      pushAnnouncements,
      pushEvents,
      pushPrayerRequests,
      pushSystemAlerts,
      inAppEnabled,
      inAppAnnouncements,
      inAppEvents,
      inAppPrayerRequests,
      inAppSystemAlerts,
      digestFrequency,
      quietHoursEnabled,
      quietHoursStart,
      quietHoursEnd,
    } = body;

    // Validate quiet hours format if provided
    if (quietHoursStart && !/^\d{2}:\d{2}$/.test(quietHoursStart)) {
      return NextResponse.json(
        { error: 'Invalid quiet hours start format. Use HH:MM' },
        { status: 400 }
      );
    }
    if (quietHoursEnd && !/^\d{2}:\d{2}$/.test(quietHoursEnd)) {
      return NextResponse.json(
        { error: 'Invalid quiet hours end format. Use HH:MM' },
        { status: 400 }
      );
    }

    // Validate digest frequency
    const validFrequencies = ['instant', 'daily', 'weekly'];
    if (digestFrequency && !validFrequencies.includes(digestFrequency)) {
      return NextResponse.json(
        { error: 'Invalid digest frequency' },
        { status: 400 }
      );
    }

    // Upsert preferences
    const result = await db
      .insert(notificationPreferences)
      .values({
        userId: session.user.id,
        emailEnabled: emailEnabled ?? defaultPreferences.emailEnabled,
        emailAnnouncements: emailAnnouncements ?? defaultPreferences.emailAnnouncements,
        emailEvents: emailEvents ?? defaultPreferences.emailEvents,
        emailPrayerRequests: emailPrayerRequests ?? defaultPreferences.emailPrayerRequests,
        emailSystemAlerts: emailSystemAlerts ?? defaultPreferences.emailSystemAlerts,
        pushEnabled: pushEnabled ?? defaultPreferences.pushEnabled,
        pushAnnouncements: pushAnnouncements ?? defaultPreferences.pushAnnouncements,
        pushEvents: pushEvents ?? defaultPreferences.pushEvents,
        pushPrayerRequests: pushPrayerRequests ?? defaultPreferences.pushPrayerRequests,
        pushSystemAlerts: pushSystemAlerts ?? defaultPreferences.pushSystemAlerts,
        inAppEnabled: inAppEnabled ?? defaultPreferences.inAppEnabled,
        inAppAnnouncements: inAppAnnouncements ?? defaultPreferences.inAppAnnouncements,
        inAppEvents: inAppEvents ?? defaultPreferences.inAppEvents,
        inAppPrayerRequests: inAppPrayerRequests ?? defaultPreferences.inAppPrayerRequests,
        inAppSystemAlerts: inAppSystemAlerts ?? defaultPreferences.inAppSystemAlerts,
        digestFrequency: digestFrequency ?? defaultPreferences.digestFrequency,
        quietHoursEnabled: quietHoursEnabled ?? defaultPreferences.quietHoursEnabled,
        quietHoursStart: quietHoursStart ?? defaultPreferences.quietHoursStart,
        quietHoursEnd: quietHoursEnd ?? defaultPreferences.quietHoursEnd,
      })
      .onConflictDoUpdate({
        target: notificationPreferences.userId,
        set: {
          ...(emailEnabled !== undefined && { emailEnabled }),
          ...(emailAnnouncements !== undefined && { emailAnnouncements }),
          ...(emailEvents !== undefined && { emailEvents }),
          ...(emailPrayerRequests !== undefined && { emailPrayerRequests }),
          ...(emailSystemAlerts !== undefined && { emailSystemAlerts }),
          ...(pushEnabled !== undefined && { pushEnabled }),
          ...(pushAnnouncements !== undefined && { pushAnnouncements }),
          ...(pushEvents !== undefined && { pushEvents }),
          ...(pushPrayerRequests !== undefined && { pushPrayerRequests }),
          ...(pushSystemAlerts !== undefined && { pushSystemAlerts }),
          ...(inAppEnabled !== undefined && { inAppEnabled }),
          ...(inAppAnnouncements !== undefined && { inAppAnnouncements }),
          ...(inAppEvents !== undefined && { inAppEvents }),
          ...(inAppPrayerRequests !== undefined && { inAppPrayerRequests }),
          ...(inAppSystemAlerts !== undefined && { inAppSystemAlerts }),
          ...(digestFrequency !== undefined && { digestFrequency }),
          ...(quietHoursEnabled !== undefined && { quietHoursEnabled }),
          ...(quietHoursStart !== undefined && { quietHoursStart }),
          ...(quietHoursEnd !== undefined && { quietHoursEnd }),
          updatedAt: new Date(),
        },
      })
      .returning();

    return NextResponse.json({
      success: true,
      preferences: result[0],
      message: 'Preferences updated successfully',
    });
  } catch (error) {
    console.error('[API] Update preferences error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
