import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, events, prayerRequests, blogPosts, announcements, membershipRequests } from '@/lib/db/schema';
import { eq, gte, and, sql } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get total users count
    const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(users);

    // Get active users count
    const activeUsers = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.isActive, true));

    // Get total events count
    const totalEvents = await db.select({ count: sql<number>`count(*)` }).from(events);

    // Get upcoming events count
    const now = new Date();
    const upcomingEvents = await db
      .select({ count: sql<number>`count(*)` })
      .from(events)
      .where(gte(events.startDate, now));

    // Get total prayer requests count
    const totalPrayerRequests = await db.select({ count: sql<number>`count(*)` }).from(prayerRequests);

    // Get PENDING prayer requests count (key for admin notification)
    const pendingPrayerRequests = await db
      .select({ count: sql<number>`count(*)` })
      .from(prayerRequests)
      .where(eq(prayerRequests.status, 'pending'));

    // Get active prayer requests count
    const activePrayerRequests = await db
      .select({ count: sql<number>`count(*)` })
      .from(prayerRequests)
      .where(eq(prayerRequests.status, 'active'));

    // Get total blog posts count
    const totalBlogPosts = await db.select({ count: sql<number>`count(*)` }).from(blogPosts);

    // Get published blog posts count
    const publishedBlogPosts = await db
      .select({ count: sql<number>`count(*)` })
      .from(blogPosts)
      .where(eq(blogPosts.status, 'published'));

    // Get total announcements count
    const totalAnnouncements = await db.select({ count: sql<number>`count(*)` }).from(announcements);

    // Get active announcements count
    const activeAnnouncements = await db
      .select({ count: sql<number>`count(*)` })
      .from(announcements)
      .where(eq(announcements.status, 'published'));

    // Get pending membership requests count
    const pendingMembershipRequests = await db
      .select({ count: sql<number>`count(*)` })
      .from(membershipRequests)
      .where(eq(membershipRequests.status, 'pending'));

    // Get recent pending prayer requests (last 10)
    const recentPendingRequests = await db
      .select()
      .from(prayerRequests)
      .where(eq(prayerRequests.status, 'pending'))
      .orderBy(sql`${prayerRequests.createdAt} DESC`)
      .limit(10);

    return NextResponse.json({
      users: {
        total: Number(totalUsers[0]?.count || 0),
        active: Number(activeUsers[0]?.count || 0),
      },
      events: {
        total: Number(totalEvents[0]?.count || 0),
        upcoming: Number(upcomingEvents[0]?.count || 0),
      },
      prayerRequests: {
        total: Number(totalPrayerRequests[0]?.count || 0),
        pending: Number(pendingPrayerRequests[0]?.count || 0),
        active: Number(activePrayerRequests[0]?.count || 0),
      },
      blog: {
        total: Number(totalBlogPosts[0]?.count || 0),
        published: Number(publishedBlogPosts[0]?.count || 0),
      },
      announcements: {
        total: Number(totalAnnouncements[0]?.count || 0),
        active: Number(activeAnnouncements[0]?.count || 0),
      },
      membershipRequests: {
        pending: Number(pendingMembershipRequests[0]?.count || 0),
      },
      recentPendingRequests,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
