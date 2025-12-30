import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { eventRegistrations, prayerRequests, events } from '@/lib/db/schema';
import { eq, and, gte } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch user's event registrations count
    const userEventRegistrations = await db
      .select()
      .from(eventRegistrations)
      .where(eq(eventRegistrations.userId, userId));

    // Fetch user's prayer requests count
    const userPrayerRequests = await db
      .select()
      .from(prayerRequests)
      .where(eq(prayerRequests.requestedById, userId));

    // Fetch upcoming events the user is registered for
    const now = new Date();
    const upcomingUserEvents = await db
      .select({
        event: events,
        registration: eventRegistrations,
      })
      .from(eventRegistrations)
      .innerJoin(events, eq(eventRegistrations.eventId, events.id))
      .where(
        and(
          eq(eventRegistrations.userId, userId),
          gte(events.startDate, now)
        )
      )
      .limit(10);

    return NextResponse.json({
      eventsCount: userEventRegistrations.length,
      upcomingEventsCount: upcomingUserEvents.length,
      prayerRequestsCount: userPrayerRequests.length,
      groupsCount: 0, // No groups table yet
      resourcesCount: 0, // No resources table yet
      upcomingEvents: upcomingUserEvents,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
