import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { events, eventRegistrations, users } from '@/lib/db/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import { notificationService } from '@/lib/notification-service';

// Helper to check if user is admin
const isAdminUser = (role: string | undefined | null) => {
  return role === 'admin' || role === 'super_admin';
};

/**
 * GET /api/events/reminders - Get upcoming events that need reminders
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !isAdminUser(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    // Get events happening in the next 24 hours
    const upcomingIn24h = await db
      .select()
      .from(events)
      .where(
        and(
          gte(events.startDate, now),
          lte(events.startDate, tomorrow),
          eq(events.status, 'published')
        )
      );

    // Get events happening in the next week
    const upcomingInWeek = await db
      .select()
      .from(events)
      .where(
        and(
          gte(events.startDate, tomorrow),
          lte(events.startDate, nextWeek),
          eq(events.status, 'published')
        )
      );

    return NextResponse.json({
      upcomingIn24h: upcomingIn24h.map(e => ({
        id: e.id,
        title: e.title,
        startDate: e.startDate,
        location: e.location,
        registeredCount: e.registeredCount,
      })),
      upcomingInWeek: upcomingInWeek.map(e => ({
        id: e.id,
        title: e.title,
        startDate: e.startDate,
        location: e.location,
        registeredCount: e.registeredCount,
      })),
    });
  } catch (error) {
    console.error('Error fetching event reminders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event reminders' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/events/reminders - Send reminder notifications for an event
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !isAdminUser(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { eventId, reminderType, sendToAll } = body;

    if (!eventId || !reminderType) {
      return NextResponse.json(
        { error: 'Event ID and reminder type are required' },
        { status: 400 }
      );
    }

    // Get the event
    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId));

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Get registered users for this event
    let registeredUserIds: string[] = [];

    if (!sendToAll) {
      const registrations = await db
        .select({ userId: eventRegistrations.userId })
        .from(eventRegistrations)
        .where(
          and(
            eq(eventRegistrations.eventId, eventId),
            eq(eventRegistrations.status, 'registered')
          )
        );

      registeredUserIds = registrations.map(r => r.userId);
    }

    // Format date and time
    const eventDate = new Date(event.startDate);
    const dateStr = eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
    const timeStr = eventDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    // Send the reminder
    const notification = await notificationService.eventReminder({
      eventId: event.id,
      title: event.title,
      date: dateStr,
      time: timeStr,
      location: event.location,
      reminderType: reminderType as '24h' | '1h' | 'day_of' | 'custom',
      registeredUserIds: sendToAll ? undefined : registeredUserIds,
    });

    if (notification) {
      return NextResponse.json({
        success: true,
        message: `Reminder sent successfully`,
        notificationId: notification.id,
        recipientCount: sendToAll ? 'all members' : registeredUserIds.length,
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to create notification' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending event reminder:', error);
    return NextResponse.json(
      { error: 'Failed to send event reminder' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/events/reminders - Send automatic reminders for upcoming events
 * This can be called by a cron job or manually by admin
 */
export async function PATCH(request: NextRequest) {
  try {
    // Allow both authenticated admin or system cron job
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Check for cron authentication
    const isCronJob = cronSecret && authHeader === `Bearer ${cronSecret}`;

    if (!isCronJob) {
      const session = await getServerSession(authOptions);
      if (!session?.user || !isAdminUser(session.user.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const now = new Date();
    const results = {
      reminders24h: 0,
      reminders1h: 0,
      errors: 0,
    };

    // Events starting in the next 23-25 hours (for 24h reminder)
    const tomorrow = new Date(now);
    tomorrow.setHours(now.getHours() + 23);
    const tomorrowEnd = new Date(now);
    tomorrowEnd.setHours(now.getHours() + 25);

    const eventsFor24hReminder = await db
      .select()
      .from(events)
      .where(
        and(
          gte(events.startDate, tomorrow),
          lte(events.startDate, tomorrowEnd),
          eq(events.status, 'published')
        )
      );

    // Send 24h reminders
    for (const event of eventsFor24hReminder) {
      try {
        // Get registered users
        const registrations = await db
          .select({ userId: eventRegistrations.userId })
          .from(eventRegistrations)
          .where(
            and(
              eq(eventRegistrations.eventId, event.id),
              eq(eventRegistrations.status, 'registered')
            )
          );

        const eventDate = new Date(event.startDate);
        const dateStr = eventDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        });
        const timeStr = eventDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

        await notificationService.eventReminder({
          eventId: event.id,
          title: event.title,
          date: dateStr,
          time: timeStr,
          location: event.location,
          reminderType: '24h',
          registeredUserIds: registrations.length > 0
            ? registrations.map(r => r.userId)
            : undefined,
        });

        results.reminders24h++;
      } catch (error) {
        console.error(`Error sending 24h reminder for event ${event.id}:`, error);
        results.errors++;
      }
    }

    // Events starting in the next 50-70 minutes (for 1h reminder)
    const oneHourFromNow = new Date(now);
    oneHourFromNow.setMinutes(now.getMinutes() + 50);
    const oneHourEnd = new Date(now);
    oneHourEnd.setMinutes(now.getMinutes() + 70);

    const eventsFor1hReminder = await db
      .select()
      .from(events)
      .where(
        and(
          gte(events.startDate, oneHourFromNow),
          lte(events.startDate, oneHourEnd),
          eq(events.status, 'published')
        )
      );

    // Send 1h reminders
    for (const event of eventsFor1hReminder) {
      try {
        const registrations = await db
          .select({ userId: eventRegistrations.userId })
          .from(eventRegistrations)
          .where(
            and(
              eq(eventRegistrations.eventId, event.id),
              eq(eventRegistrations.status, 'registered')
            )
          );

        const eventDate = new Date(event.startDate);
        const timeStr = eventDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

        await notificationService.eventReminder({
          eventId: event.id,
          title: event.title,
          date: eventDate.toLocaleDateString(),
          time: timeStr,
          location: event.location,
          reminderType: '1h',
          registeredUserIds: registrations.length > 0
            ? registrations.map(r => r.userId)
            : undefined,
        });

        results.reminders1h++;
      } catch (error) {
        console.error(`Error sending 1h reminder for event ${event.id}:`, error);
        results.errors++;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Automatic reminders processed',
      results,
    });
  } catch (error) {
    console.error('Error processing automatic reminders:', error);
    return NextResponse.json(
      { error: 'Failed to process automatic reminders' },
      { status: 500 }
    );
  }
}
