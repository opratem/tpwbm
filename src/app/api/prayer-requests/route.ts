import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { prayerRequests, prayerResponses, users } from "@/lib/db/schema";
import { eq, and, or, like, desc, sql, count, inArray } from "drizzle-orm";
import type { PrayerRequestFilter } from "@/types/prayer-requests";
import { notificationSender } from "@/lib/notification-broadcaster";
import {
  sanitizeString,
  sanitizeEmail,
  sanitizeHTML,
  checkRateLimit,
  rateLimiters,
  canSubmit,
  submissionTrackers,
  validateOrigin,
  getSecurityHeaders
} from '@/lib/security';
import { prayerRequestSchema, validateAndSanitize } from '@/lib/validations';

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
    if (session?.user.id && results.length > 0) {
      const requestIds = results.map(r => r.id);
      const prayerStatuses = await db
          .select({
            prayerRequestId: prayerResponses.prayerRequestId,
            hasPrayed: sql<boolean>`TRUE`,
          })
          .from(prayerResponses)
          .where(
              and(
                  eq(prayerResponses.userId, session.user.id),
                  inArray(prayerResponses.prayerRequestId, requestIds)
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
    // Validate origin
    if (!validateOrigin(request)) {
      return NextResponse.json(
        { error: 'Invalid request origin' },
        { status: 403 }
      );
    }

    // Rate limiting - 5 prayer requests per 10 minutes
    const rateLimit = checkRateLimit(request, rateLimiters.forms);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many prayer request submissions. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        { status: 429 }
      );
    }

    // Prevent duplicate submissions
    if (!canSubmit(request, submissionTrackers.forms)) {
      return NextResponse.json(
        { error: 'Please wait a moment before submitting another prayer request' },
        { status: 429 }
      );
    }

    const session = await getServerSession(authOptions);
    const body = await request.json();

    // Build validation data - prayer requests can come from guests
    const validationData = {
      title: body.title,
      description: body.description,
      category: body.category,
      isAnonymous: body.isAnonymous ?? false,
      requestorName: body.guestName || (session?.user.name ?? undefined),
      requestorEmail: body.guestEmail || (session?.user.email ?? undefined),
      isUrgent: body.priority === 'urgent',
      status: 'pending' as const,
    };

    // Validate with Zod
    const validation = validateAndSanitize(prayerRequestSchema, validationData);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid prayer request data',
          details: validation.errors
        },
        { status: 400 }
      );
    }

    const validatedData = validation.data;

    // Determine prayer priority from body or derived from isUrgent
    const priority = body.priority || (validatedData.isUrgent ? 'urgent' : 'normal');
    const isPublic = body.isPublic ?? true;
    const tags = Array.isArray(body.tags) ? body.tags : [];

    let requestedBy: string;
    let requestedById: string;
    let requestedByEmail: string;

    if (session) {
      // Authenticated user
      requestedBy = validatedData.isAnonymous ? "Anonymous" : (session.user.name || "Unknown");
      requestedById = session.user.id;
      requestedByEmail = validatedData.isAnonymous ? "" : (session.user.email || "");
    } else {
      // Anonymous/guest user
      if (!validatedData.requestorName && !validatedData.isAnonymous) {
        return NextResponse.json(
            { error: "Name is required for non-anonymous submissions" },
            { status: 400 }
        );
      }

      requestedBy = validatedData.isAnonymous ? "Anonymous" : (validatedData.requestorName || "Guest");
      requestedById = "00000000-0000-0000-0000-000000000000"; // Special guest user ID
      requestedByEmail = validatedData.requestorEmail || "";
    }

    // Create new prayer request - requires admin approval
    const [newRequest] = await db.insert(prayerRequests).values({
      title: validatedData.title,
      description: validatedData.description,
      category: validatedData.category,
      priority,
      requestedBy,
      requestedById,
      requestedByEmail,
      isAnonymous: validatedData.isAnonymous,
      status: validatedData.status,
      isPublic,
      tags,
      prayerCount: 0,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
    }).returning();

    // Send notification to admins about new prayer request
    try {
      await notificationSender.newPrayerRequest({
        requestId: newRequest.id,
        requestTitle: validatedData.title,
        requesterName: requestedBy,
        isGuest: !session
      });
      console.log(`[PRAYER-REQUEST] Notification sent for new request: ${newRequest.id}`);
    } catch (error) {
      console.error("Failed to send prayer request notification:", error);
      // Don't fail the request creation if notification fails
    }

    console.log(`[PRAYER-REQUEST] New prayer request created: ${newRequest.id} by ${requestedBy}`);

    // Apply security headers
    const headers = getSecurityHeaders();

    return NextResponse.json({
      ...newRequest,
      message: "Your prayer request has been submitted and is pending approval. You will be notified once it's reviewed by our church admin."
    }, { status: 201, headers });

  } catch (error) {
    console.error("Error creating prayer request:", error);
    return NextResponse.json(
        { error: "Failed to create prayer request. Please try again." },
        { status: 500 }
    );
  }
}
