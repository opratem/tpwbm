import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { prayerRequests, prayerResponses, users } from "@/lib/db/schema";
import { eq, and, or, like, desc, sql, count } from "drizzle-orm";
import type { PrayerRequestFilter } from "@/types/prayer-requests";
import { notificationSender } from "@/lib/notification-broadcaster";

// GET /api/prayer-requests - Get all prayer requests (with optional filtering)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");
    const isPublic = searchParams.get("isPublic");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const page = searchParams.get("page");

    // Build where conditions
    const conditions = [];

    // Access control - non-authenticated users can only see public active requests
    if (!session) {
      conditions.push(eq(prayerRequests.isPublic, true));
      conditions.push(eq(prayerRequests.status, 'active'));
    } else if (session.user.role !== "admin") {
      // Members can see their own requests or public active/answered requests
      conditions.push(
          or(
              eq(prayerRequests.requestedById, session.user.id),
              and(
                  eq(prayerRequests.isPublic, true),
                  or(
                      eq(prayerRequests.status, 'active'),
                      eq(prayerRequests.status, 'answered')
                  )
              )
          )
      );
    }

    // Apply filters
    if (category && category !== "all") {
      conditions.push(eq(prayerRequests.category, category as any));
    }

    if (status && status !== "all") {
      conditions.push(eq(prayerRequests.status, status as any));
    }

    if (priority && priority !== "all") {
      conditions.push(eq(prayerRequests.priority, priority as any));
    }

    if (isPublic !== null) {
      conditions.push(eq(prayerRequests.isPublic, isPublic === "true"));
    }

    if (search) {
      conditions.push(
          or(
              like(prayerRequests.title, `%${search}%`),
              like(prayerRequests.description, `%${search}%`)
          )
      );
    }

    // Build and execute query directly
    const baseConditions = conditions.length > 0 ? and(...conditions) : undefined;

    const results = await db
        .select({
          id: prayerRequests.id,
          title: prayerRequests.title,
          description: prayerRequests.description,
          category: prayerRequests.category,
          priority: prayerRequests.priority,
          requestedBy: prayerRequests.requestedBy,
          requestedById: prayerRequests.requestedById,
          requestedByEmail: prayerRequests.requestedByEmail,
          isAnonymous: prayerRequests.isAnonymous,
          status: prayerRequests.status,
          isPublic: prayerRequests.isPublic,
          tags: prayerRequests.tags,
          prayerCount: prayerRequests.prayerCount,
          followUpNotes: prayerRequests.followUpNotes,
          adminNotes: prayerRequests.adminNotes,
          answeredDate: prayerRequests.answeredDate,
          answeredDescription: prayerRequests.answeredDescription,
          expiresAt: prayerRequests.expiresAt,
          createdAt: prayerRequests.createdAt,
          updatedAt: prayerRequests.updatedAt,
        })
        .from(prayerRequests)
        .where(baseConditions)
        .orderBy(
            sql`CASE ${prayerRequests.priority}
          WHEN 'urgent' THEN 4
          WHEN 'high' THEN 3
          WHEN 'normal' THEN 2
          WHEN 'low' THEN 1
          ELSE 0
        END DESC`,
            desc(prayerRequests.createdAt)
        )
        .limit(limit ? Number.parseInt(limit, 10) : 100)
        .offset(
            page ? (Number.parseInt(page, 10) - 1) * (limit ? Number.parseInt(limit, 10) : 100) :
                offset ? Number.parseInt(offset, 10) : 0
        );

    // Get prayer status for current user if authenticated
    if (session?.user.id) {
      const prayerStatuses = await db
          .select({
            prayerRequestId: prayerResponses.prayerRequestId,
            hasPrayed: sql<boolean>`TRUE`,
          })
          .from(prayerResponses)
          .where(
              and(
                  eq(prayerResponses.userId, session.user.id),
                  sql`${prayerResponses.prayerRequestId} = ANY(${results.map(r => r.id)})`
              )
          );

      const prayerStatusMap = new Map(
          prayerStatuses.map(status => [status.prayerRequestId, status.hasPrayed])
      );

      // Add hasPrayed status to results
      const resultsWithPrayerStatus = results.map(request => ({
        ...request,
        prayedByUsers: [], // We'll populate this separately if needed
        hasPrayed: prayerStatusMap.get(request.id) || false,
      }));

      return NextResponse.json(resultsWithPrayerStatus);
    }

    return NextResponse.json(results.map(request => ({
      ...request,
      prayedByUsers: [],
      hasPrayed: false,
    })));
  } catch (error) {
    console.error("Error fetching prayer requests:", error);
    return NextResponse.json(
        { error: "Failed to fetch prayer requests" },
        { status: 500 }
    );
  }
}

// POST /api/prayer-requests - Create new prayer request
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    const {
      title,
      description,
      category,
      priority = 'normal',
      isAnonymous = false,
      isPublic = true,
      tags = [],
      expiresAt,
      // For anonymous users
      guestName,
      guestEmail
    } = body;

    // Validate required fields
    if (!title || !description || !category) {
      return NextResponse.json(
          { error: "Missing required fields: title, description, category" },
          { status: 400 }
      );
    }

    let requestedBy: string;
    let requestedById: string;
    let requestedByEmail: string;

    if (session) {
      // Authenticated user
      requestedBy = isAnonymous ? "Anonymous" : session.user.name || "Unknown";
      requestedById = session.user.id;
      requestedByEmail = isAnonymous ? "" : session.user.email || "";
    } else {
      // Anonymous/guest user
      if (!guestName && !isAnonymous) {
        return NextResponse.json(
            { error: "Name is required for non-anonymous submissions" },
            { status: 400 }
        );
      }

      // Create a guest user record or use anonymous
      if (isAnonymous) {
        requestedBy = "Anonymous";
        requestedById = "00000000-0000-0000-0000-000000000000"; // Special guest user ID
        requestedByEmail = "";
      } else {
        requestedBy = guestName || "Guest";
        requestedById = "00000000-0000-0000-0000-000000000000"; // Special guest user ID
        requestedByEmail = guestEmail || "";
      }
    }

    // Create new prayer request - auto-activate instead of pending
    const [newRequest] = await db.insert(prayerRequests).values({
      title,
      description,
      category,
      priority,
      requestedBy,
      requestedById,
      requestedByEmail,
      isAnonymous,
      status: "active", // Auto-activate all prayer requests (no approval needed)
      isPublic,
      tags,
      prayerCount: 0,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    }).returning();

    // Send notification to admins about new prayer request
    try {
      await notificationSender.newPrayerRequest({
        requestId: newRequest.id,
        requestTitle: title,
        requesterName: requestedBy,
        isGuest: !session
      });
      console.log(`[PRAYER-REQUEST] Notification sent for new request: ${newRequest.id}`);
    } catch (error) {
      console.error("Failed to send prayer request notification:", error);
      // Don't fail the request creation if notification fails
    }

    console.log(`[PRAYER-REQUEST] New prayer request created: ${newRequest.id} by ${requestedBy}`);

    return NextResponse.json({
      ...newRequest,
      message: "Your prayer request has been submitted and is now active. Our church family will be praying for you."
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating prayer request:", error);
    return NextResponse.json(
        { error: "Failed to create prayer request" },
        { status: 500 }
    );
  }
}
