/**
 * API Route: Notification Preferences
 * GET/PUT /api/notifications/preferences
 *
 * Manages user notification preferences.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { userNotificationPreferences } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Default preferences
const defaultPreferences = {
  pushEnabled: false,
  announcements: true,
  events: true,
  prayerRequests: true,
  systemNotifications: true,
  emailEnabled: false,
  emailDigestFrequency: 'never',
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
      .from(userNotificationPreferences)
      .where(eq(userNotificationPreferences.userId, session.user.id))
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
      pushEnabled,
      announcements,
      events,
      prayerRequests,
      systemNotifications,
      emailEnabled,
      emailDigestFrequency,
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

    // Validate email digest frequency
    const validFrequencies = ['never', 'daily', 'weekly'];
    if (emailDigestFrequency && !validFrequencies.includes(emailDigestFrequency)) {
      return NextResponse.json(
        { error: 'Invalid email digest frequency' },
        { status: 400 }
      );
    }

    // Upsert preferences
    const result = await db
      .insert(userNotificationPreferences)
      .values({
        userId: session.user.id,
        pushEnabled: pushEnabled ?? defaultPreferences.pushEnabled,
        announcements: announcements ?? defaultPreferences.announcements,
        events: events ?? defaultPreferences.events,
        prayerRequests: prayerRequests ?? defaultPreferences.prayerRequests,
        systemNotifications: systemNotifications ?? defaultPreferences.systemNotifications,
        emailEnabled: emailEnabled ?? defaultPreferences.emailEnabled,
        emailDigestFrequency: emailDigestFrequency ?? defaultPreferences.emailDigestFrequency,
        quietHoursEnabled: quietHoursEnabled ?? defaultPreferences.quietHoursEnabled,
        quietHoursStart: quietHoursStart ?? defaultPreferences.quietHoursStart,
        quietHoursEnd: quietHoursEnd ?? defaultPreferences.quietHoursEnd,
      })
      .onConflictDoUpdate({
        target: userNotificationPreferences.userId,
        set: {
          ...(pushEnabled !== undefined && { pushEnabled }),
          ...(announcements !== undefined && { announcements }),
          ...(events !== undefined && { events }),
          ...(prayerRequests !== undefined && { prayerRequests }),
          ...(systemNotifications !== undefined && { systemNotifications }),
          ...(emailEnabled !== undefined && { emailEnabled }),
          ...(emailDigestFrequency !== undefined && { emailDigestFrequency }),
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
