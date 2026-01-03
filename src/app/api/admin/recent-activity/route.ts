import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, prayerRequests, events, announcements } from "@/lib/db/schema";
import { eq, desc, sql, or } from "drizzle-orm";

// GET /api/admin/recent-activity - Get recent activities for admin dashboard
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "10"), 20); // Max 20 items

    console.log(`[RECENT-ACTIVITY] Fetching recent activities with limit: ${limit}`);

    try {
      // Test database connection first
      console.log("[RECENT-ACTIVITY] Testing database connection...");

      // Get recent prayer requests
      console.log("[RECENT-ACTIVITY] Fetching recent prayer requests...");
      const recentPrayerRequests = await db
        .select({
          id: prayerRequests.id,
          title: prayerRequests.title,
          requestedBy: prayerRequests.requestedBy,
          status: prayerRequests.status,
          priority: prayerRequests.priority,
          createdAt: prayerRequests.createdAt,
          type: sql<string>`'prayer'`,
        })
        .from(prayerRequests)
        .orderBy(desc(prayerRequests.createdAt))
        .limit(5);

      console.log(`[RECENT-ACTIVITY] Found ${recentPrayerRequests.length} prayer requests`);

      // Get recent events
      console.log("[RECENT-ACTIVITY] Fetching recent events...");
      const recentEvents = await db
        .select({
          id: events.id,
          title: events.title,
          organizer: events.organizer,
          status: events.status,
          registeredCount: events.registeredCount,
          createdAt: events.createdAt,
          type: sql<string>`'event'`,
        })
        .from(events)
        .orderBy(desc(events.createdAt))
        .limit(3);

      console.log(`[RECENT-ACTIVITY] Found ${recentEvents.length} events`);

      // Get recent announcements
      console.log("[RECENT-ACTIVITY] Fetching recent announcements...");
      const recentAnnouncements = await db
        .select({
          id: announcements.id,
          title: announcements.title,
          author: announcements.author,
          status: announcements.status,
          priority: announcements.priority,
          createdAt: announcements.createdAt,
          type: sql<string>`'announcement'`,
        })
        .from(announcements)
        .orderBy(desc(announcements.createdAt))
        .limit(3);

      console.log(`[RECENT-ACTIVITY] Found ${recentAnnouncements.length} announcements`);

      // Get recent members
      console.log("[RECENT-ACTIVITY] Fetching recent members...");
      const recentMembers = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          membershipDate: users.membershipDate,
          createdAt: users.createdAt,
          type: sql<string>`'member'`,
        })
        .from(users)
        .where(eq(users.isActive, true))
        .orderBy(desc(users.membershipDate))
        .limit(3);

      console.log(`[RECENT-ACTIVITY] Found ${recentMembers.length} members`);

      // Combine and format activities
      const activities = [];

      // Add prayer request activities
      for (const request of recentPrayerRequests) {
        activities.push({
          id: `prayer-${request.id}`,
          type: "prayer",
          title: `Prayer Request: ${request.title}`,
          description: `Prayer request submitted with ${request.priority} priority`,
          timestamp: request.createdAt.toISOString(),
          user: request.requestedBy,
          actionUrl: "/admin/prayer-requests",
          createdAt: request.createdAt,
        });
      }

      // Add event activities
      for (const event of recentEvents) {
        const registrationText = event.registeredCount > 0
          ? ` - ${event.registeredCount} registered`
          : '';
        activities.push({
          id: `event-${event.id}`,
          type: "event",
          title: `Event Created: ${event.title}`,
          description: `New event scheduled${registrationText}`,
          timestamp: event.createdAt.toISOString(),
          user: event.organizer,
          actionUrl: "/admin/events",
          createdAt: event.createdAt,
        });
      }

      // Add announcement activities
      for (const announcement of recentAnnouncements) {
        activities.push({
          id: `announcement-${announcement.id}`,
          type: "announcement",
          title: `Announcement: ${announcement.title}`,
          description: `New ${announcement.priority} priority announcement published`,
          timestamp: announcement.createdAt.toISOString(),
          user: announcement.author,
          actionUrl: "/admin/announcements",
          createdAt: announcement.createdAt,
        });
      }

      // Add member activities
      for (const member of recentMembers) {
        activities.push({
          id: `member-${member.id}`,
          type: "membership",
          title: `New Member: ${member.name}`,
          description: `${member.email} joined as ${member.role}`,
          timestamp: (member.membershipDate || member.createdAt).toISOString(),
          user: member.name || "Unknown",
          actionUrl: "/admin/users",
          createdAt: member.membershipDate || member.createdAt,
        });
      }

      // Sort by creation time and limit
      const sortedActivities = activities
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);

      console.log(`[RECENT-ACTIVITY] Successfully processed ${sortedActivities.length} activities from database`);

      // If no activities found from database, return empty activities array
      if (sortedActivities.length === 0) {
        console.log("[RECENT-ACTIVITY] No activities found in database, returning empty state");
        return NextResponse.json({ activities: [] });
      }

      return NextResponse.json({ activities: sortedActivities });

    } catch (dbError) {
      console.error("[RECENT-ACTIVITY] Database error:", dbError);
      console.error("[RECENT-ACTIVITY] Error details:", {
        message: dbError instanceof Error ? dbError.message : 'Unknown error',
        stack: dbError instanceof Error ? dbError.stack : 'No stack trace'
      });

      // Return error with database status instead of fallback mock data
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: "Unable to fetch recent activities from database",
          fallback: false
        },
        { status: 503 }
      );
    }

  } catch (error) {
    console.error("[RECENT-ACTIVITY] API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent activities" },
      { status: 500 }
    );
  }
}

// Helper function to calculate time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return diffInMinutes <= 1 ? "1 minute ago" : `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
  } else if (diffInDays < 7) {
    return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}