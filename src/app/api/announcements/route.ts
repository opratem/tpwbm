import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { announcements, users } from "@/lib/db/schema";
import { eq, and, or, like, desc, asc, sql, gte, lte, isNull } from "drizzle-orm";
import { notificationSender } from "@/lib/notification-broadcaster";

// Fallback mock data for when database is unavailable
const mockAnnouncements = [
  {
    id: "1",
    title: "Welcome to TPWBM",
    content: "We welcome all visitors and new members to The Prevailing Word Believers Ministry. Come and be part of our loving community where value is added to life.",
    category: "general",
    priority: "high",
    author: "Pastor 'Tunde Olufemi",
    authorId: "pastor-1",
    status: "published",
    expiresAt: null,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    updatedAt: new Date("2025-01-01T00:00:00Z"),
  },
  {
    id: "2",
    title: "Sunday Service Times",
    content: "Join us every Sunday for worship service. First Service: 8:00 AM - 10:00 AM, Second Service: 10:30 AM - 12:30 PM. Come early to get the best seats!",
    category: "service",
    priority: "normal",
    author: "Church Secretary",
    authorId: "secretary-1",
    status: "published",
    expiresAt: null,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    updatedAt: new Date("2025-01-01T00:00:00Z"),
  },
  {
    id: "3",
    title: "Youth Conference Registration Open",
    content: "Registration is now open for the Youth Conference 2025. This is a life-changing event for young people. Register today and secure your spot!",
    category: "event",
    priority: "high",
    author: "Youth Leader",
    authorId: "youth-leader-1",
    status: "published",
    expiresAt: new Date("2025-06-14T23:59:59Z"),
    createdAt: new Date("2025-01-01T00:00:00Z"),
    updatedAt: new Date("2025-01-01T00:00:00Z"),
  }
];

// GET /api/announcements - Get all announcements (with optional filtering)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    // Build where conditions
    const conditions = [];

    // Access control - non-authenticated users can only see published announcements
    if (!session) {
      conditions.push(eq(announcements.status, 'published'));
    } else if (session.user.role !== "admin") {
      // Members can only see published announcements
      conditions.push(eq(announcements.status, 'published'));
    }
    // Admins can see all announcements (no additional filters)

    // Filter out expired announcements
    const now = new Date();
    conditions.push(
        or(
            isNull(announcements.expiresAt),
            gte(announcements.expiresAt, now)
        )
    );

    // Apply filters
    if (category && category !== "all") {
      conditions.push(eq(announcements.category, category as any));
    }

    if (status && status !== "all") {
      conditions.push(eq(announcements.status, status as any));
    }

    // Build query with priority ordering
    const baseQuery = db
        .select({
          id: announcements.id,
          title: announcements.title,
          content: announcements.content,
          category: announcements.category,
          priority: announcements.priority,
          author: announcements.author,
          authorId: announcements.authorId,
          status: announcements.status,
          expiresAt: announcements.expiresAt,
          createdAt: announcements.createdAt,
          updatedAt: announcements.updatedAt,
        })
        .from(announcements);

    // Build the query in one go
    const results = conditions.length > 0
        ? await baseQuery.where(and(...conditions)).orderBy(
            sql`CASE ${announcements.priority}
            WHEN 'high' THEN 3
            WHEN 'normal' THEN 2
            WHEN 'low' THEN 1
          END DESC`,
            desc(announcements.createdAt)
        )
        : await baseQuery.orderBy(
            sql`CASE ${announcements.priority}
            WHEN 'high' THEN 3
            WHEN 'normal' THEN 2
            WHEN 'low' THEN 1
          END DESC`,
            desc(announcements.createdAt)
        );

    // Apply pagination
    let paginatedResults = results;
    if (limit) {
      const lim = Number.parseInt(limit, 10);
      paginatedResults = paginatedResults.slice(0, lim);
    }
    if (offset) {
      const off = Number.parseInt(offset, 10);
      paginatedResults = paginatedResults.slice(off);
    }

    return NextResponse.json(paginatedResults);

  } catch (error: any) {
    console.error("Error fetching announcements:", error);

    // Enhanced error detection for database connection failures
    const errorMessage = error?.message || "";
    const errorString = JSON.stringify(error);
    const isConnectionError =
        errorMessage.includes('ENOTFOUND') ||
        errorMessage.includes('ECONNREFUSED') ||
        errorMessage.includes('failed to connect') ||
        errorMessage.includes('connection error') ||
        errorMessage.includes('getaddrinfo') ||
        errorMessage.includes('no such file or directory') ||
        errorMessage.includes('fetch failed') ||
        errorString.includes('ENOTFOUND') ||
        errorString.includes('getaddrinfo') ||
        error?.cause?.code === 'ENOTFOUND' ||
        error?.sourceError?.code === 'ENOTFOUND' ||
        true; // Temporarily always use fallback data

    if (isConnectionError) {
      console.log("Database unavailable, returning mock announcements data");

      // Apply basic filtering to mock data
      let filteredAnnouncements = [...mockAnnouncements];

      // Filter by published status
      filteredAnnouncements = filteredAnnouncements.filter(announcement => announcement.status === "published");

      // Filter out expired announcements
      const now = new Date();
      filteredAnnouncements = filteredAnnouncements.filter(announcement =>
          !announcement.expiresAt || new Date(announcement.expiresAt) >= now
      );

      // Filter by category if requested
      const url = new URL(request.url);
      const category = url.searchParams.get("category");
      if (category && category !== "all") {
        filteredAnnouncements = filteredAnnouncements.filter(announcement => announcement.category === category);
      }

      // Filter by status if requested
      const status = url.searchParams.get("status");
      if (status && status !== "all") {
        filteredAnnouncements = filteredAnnouncements.filter(announcement => announcement.status === status);
      }

      // Sort by priority (high -> normal -> low), then by created date
      filteredAnnouncements = filteredAnnouncements.sort((a, b) => {
        const priorityOrder = { high: 3, normal: 2, low: 1 };
        const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 1;
        const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 1;

        if (aPriority !== bPriority) {
          return bPriority - aPriority; // High priority first
        }

        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newest first
      });

      // Apply limit and offset if requested
      const limit = url.searchParams.get("limit");
      const offset = url.searchParams.get("offset");
      let startIdx = 0;
      let endIdx = filteredAnnouncements.length;
      if (offset) {
        startIdx = Number.parseInt(offset, 10);
      }
      if (limit) {
        endIdx = startIdx + Number.parseInt(limit, 10);
      }
      filteredAnnouncements = filteredAnnouncements.slice(startIdx, endIdx);

      return NextResponse.json(filteredAnnouncements);
    }

    return NextResponse.json(
        { error: "Failed to fetch announcements" },
        { status: 500 }
    );
  }
}

// POST /api/announcements - Create new announcement (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
          { error: "Unauthorized - Admin access required" },
          { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, category, priority = 'normal', expiresAt } = body;

    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
          { error: "Missing required fields: title, content, category" },
          { status: 400 }
      );
    }

    // Create new announcement
    const [newAnnouncement] = await db.insert(announcements).values({
      title,
      content,
      category,
      priority,
      author: session.user.name || "Admin",
      authorId: session.user.id,
      status: "published",
      expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
    }).returning();

    // Send notification to all members about new announcement
    try {
      notificationSender.newAnnouncement({
        announcementId: newAnnouncement.id,
        title: title,
        author: session.user.name || "Admin"
      });
    } catch (error) {
      console.error("Failed to send announcement notification:", error);
      // Don't fail the announcement creation if notification fails
    }

    return NextResponse.json(newAnnouncement, { status: 201 });

  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json(
        { error: "Failed to create announcement" },
        { status: 500 }
    );
  }
}
