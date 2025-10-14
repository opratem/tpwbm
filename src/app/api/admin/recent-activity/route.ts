import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
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
        const timeAgo = getTimeAgo(request.createdAt);
        activities.push({
          id: `prayer-${request.id}`,
          type: "prayer",
          description: `Prayer request "${request.title}" submitted by ${request.requestedBy}`,
          timestamp: timeAgo,
          status: request.status,
          priority: request.priority,
          createdAt: request.createdAt,
        });
      }

      // Add event activities
      for (const event of recentEvents) {
        const timeAgo = getTimeAgo(event.createdAt);
        const registrationText = event.registeredCount > 0
          ? ` (${event.registeredCount} registered)`
          : '';
        activities.push({
          id: `event-${event.id}`,
          type: "event",
          description: `Event "${event.title}" created by ${event.organizer}${registrationText}`,
          timestamp: timeAgo,
          status: event.status,
          createdAt: event.createdAt,
        });
      }

      // Add announcement activities
      for (const announcement of recentAnnouncements) {
        const timeAgo = getTimeAgo(announcement.createdAt);
        activities.push({
          id: `announcement-${announcement.id}`,
          type: "content",
          description: `Announcement "${announcement.title}" published by ${announcement.author}`,
          timestamp: timeAgo,
          status: announcement.status,
          priority: announcement.priority,
          createdAt: announcement.createdAt,
        });
      }

      // Add member activities
      for (const member of recentMembers) {
        const timeAgo = getTimeAgo(member.membershipDate || member.createdAt);
        activities.push({
          id: `member-${member.id}`,
          type: "member",
          description: `New member registration: ${member.name}`,
          timestamp: timeAgo,
          status: member.role === 'admin' ? 'admin' : 'active',
          createdAt: member.membershipDate || member.createdAt,
        });
      }

      // Sort by creation time and limit
      const sortedActivities = activities
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);

      console.log(`[RECENT-ACTIVITY] Successfully processed ${sortedActivities.length} activities from database`);

      // If no activities found from database, create some helpful default activities
      if (sortedActivities.length === 0) {
        console.log("[RECENT-ACTIVITY] No activities found in database, returning empty state message");
        return NextResponse.json([
          {
            id: "empty-state",
            type: "system",
            description: "No recent activities found. Activity will appear here as members join, events are created, and prayer requests are submitted.",
            timestamp: "Just now",
            status: "info",
          }
        ]);
      }

      return NextResponse.json(sortedActivities);

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
