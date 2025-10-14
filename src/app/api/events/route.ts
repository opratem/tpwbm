import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { events, eventRegistrations, users } from "@/lib/db/schema";
import { eq, and, or, like, desc, asc, sql, gte, lte } from "drizzle-orm";

// Fallback mock data for when database is unavailable - only recurring events
const mockEvents = [
  {
    id: "1",
    title: "Sunday Worship Service",
    description: "Join us for our weekly worship service with powerful praise, worship, and the Word of God.",
    category: "worship",
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now (next Sunday)
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
    location: "Main Sanctuary",
    address: "The Prevailing Word Believers Ministry Inc.",
    organizer: "Pastor 'Tunde Olufemi",
    organizerId: "pastor-1",
    capacity: 200,
    registeredCount: 0,
    requiresRegistration: false,
    isRecurring: true,
    recurringPattern: "weekly",
    recurringDays: ["sunday"],
    recurringEndDate: null,
    status: "published",
    imageUrl: "/images/Celebration_of_Jesus.jpeg",
    imageUrls: [],
    contactEmail: "info@tpwbm.org",
    contactPhone: "",
    tags: ["worship", "service"],
    price: "0.00",
    registrationDeadline: null,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    updatedAt: new Date("2025-01-01T00:00:00Z"),
  },
  {
    id: "2",
    title: "Midweek Bible Study",
    description: "Dive deeper into scripture through study and discussion. Join us for an enriching time in God's Word.",
    category: "fellowship",
    startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow (Tuesday)
    endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000), // 1.5 hours later
    location: "Fellowship Hall",
    address: "The Prevailing Word Believers Ministry Inc.",
    organizer: "Minister Peace Olufemi",
    organizerId: "minister-1",
    capacity: 80,
    registeredCount: 0,
    requiresRegistration: false,
    isRecurring: true,
    recurringPattern: "weekly",
    recurringDays: ["tuesday"],
    recurringEndDate: null,
    status: "published",
    imageUrl: "/images/Bible_Study.jpeg",
    imageUrls: [],
    contactEmail: "info@tpwbm.org",
    contactPhone: "",
    tags: ["bible study", "fellowship"],
    price: "0.00",
    registrationDeadline: null,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    updatedAt: new Date("2025-01-01T00:00:00Z"),
  }
];

// GET /api/events - Get all events (with optional filtering)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const upcoming = searchParams.get("upcoming");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build where conditions
    const conditions = [];

    // Access control - non-authenticated users can only see published events
    if (!session) {
      conditions.push(eq(events.status, 'published'));
    } else if (session.user.role !== "admin") {
      // Members can only see published events
      conditions.push(eq(events.status, 'published'));
    }
    // Admins can see all events (no additional filters)

    // Apply filters
    if (category && category !== "all") {
      conditions.push(eq(events.category, category as any));
    }

    if (status && status !== "all") {
      conditions.push(eq(events.status, status as any));
    }

    // Filter upcoming events only
    if (upcoming === "true") {
      const now = new Date();
      conditions.push(gte(events.startDate, now));
    }

    // Filter by date range
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      conditions.push(
          and(
              gte(events.startDate, start),
              lte(events.startDate, end)
          )
      );
    }

    // Build base query with all available columns (database now migrated)
    let baseQuery = db
        .select({
          id: events.id,
          title: events.title,
          description: events.description,
          category: events.category,
          startDate: events.startDate,
          endDate: events.endDate,
          location: events.location,
          address: events.address,
          organizer: events.organizer,
          organizerId: events.organizerId,
          capacity: events.capacity,
          registeredCount: events.registeredCount,
          requiresRegistration: events.requiresRegistration,
          isRecurring: events.isRecurring,
          recurringPattern: events.recurringPattern,
          recurringDays: events.recurringDays,
          recurringEndDate: events.recurringEndDate,
          status: events.status,
          imageUrl: events.imageUrl,
          imageUrls: events.imageUrls,
          contactEmail: events.contactEmail,
          contactPhone: events.contactPhone,
          tags: events.tags,
          price: events.price,
          registrationDeadline: events.registrationDeadline,
          createdAt: events.createdAt,
          updatedAt: events.updatedAt,
        })
        .from(events);

    // Apply filters
    if (conditions.length > 0) {
      baseQuery = (baseQuery as any).where(and(...conditions));
    }

    // Sort by start date (upcoming first)
    baseQuery = (baseQuery as any).orderBy(asc(events.startDate));

    // Apply pagination
    if (limit) {
      baseQuery = (baseQuery as any).limit(Number.parseInt(limit, 10));
    }
    if (offset) {
      baseQuery = (baseQuery as any).offset(Number.parseInt(offset, 10));
    }

    const results = await baseQuery;

    return NextResponse.json(results);

  } catch (error: any) {
    console.error("Error fetching events:", error);

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
        error?.sourceError?.code === 'ENOTFOUND';

    if (isConnectionError) {
      console.log("Database unavailable, returning fallback recurring events only");

      // Apply basic filtering to mock data (only recurring events)
      let filteredEvents = [...mockEvents];

      // Filter by published status (since only published events are visible to non-admins)
      filteredEvents = filteredEvents.filter(event => event.status === "published");

      // Filter by category if requested
      const url = new URL(request.url);
      const category = url.searchParams.get("category");
      if (category && category !== "all") {
        filteredEvents = filteredEvents.filter(event => event.category === category);
      }

      // Filter by status if requested
      const status = url.searchParams.get("status");
      if (status && status !== "all") {
        filteredEvents = filteredEvents.filter(event => event.status === status);
      }

      // Filter by upcoming if requested
      if (url.searchParams.get("upcoming") === "true") {
        const now = new Date();
        filteredEvents = filteredEvents.filter(event => new Date(event.startDate) >= now);
      }

      // Filter by date range if requested
      const startDate = url.searchParams.get("startDate");
      const endDate = url.searchParams.get("endDate");
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        filteredEvents = filteredEvents.filter(event =>
            new Date(event.startDate) >= start && new Date(event.startDate) <= end
        );
      }

      // Sort by start date (upcoming first)
      filteredEvents = filteredEvents.sort(
          (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );

      // Apply limit and offset if requested
      const limit = url.searchParams.get("limit");
      const offset = url.searchParams.get("offset");
      let startIdx = 0;
      let endIdx = filteredEvents.length;
      if (offset) {
        startIdx = Number.parseInt(offset, 10);
      }
      if (limit) {
        endIdx = startIdx + Number.parseInt(limit, 10);
      }
      filteredEvents = filteredEvents.slice(startIdx, endIdx);

      return NextResponse.json(filteredEvents);
    }

    return NextResponse.json(
        { error: "Failed to fetch events" },
        { status: 500 }
    );
  }
}

// POST /api/events - Create new event (admin only)
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
    const {
      title,
      description,
      category,
      startDate,
      endDate,
      location,
      address = "",
      organizer = "",
      capacity = 0,
      requiresRegistration = false,
      isRecurring = false,
      recurringPattern,
      recurringDays = [],
      recurringEndDate,
      contactEmail,
      contactPhone = "",
      tags = [],
      price = "0.00",
      registrationDeadline,
      imageUrl = "",
      imageUrls = [],
    } = body;

    // Validate required fields
    if (!title || !description || !category || !startDate || !endDate || !location) {
      return NextResponse.json(
          { error: "Missing required fields: title, description, category, startDate, endDate, location" },
          { status: 400 }
      );
    }

    // Create new event
    const [newEvent] = await (db.insert(events).values({
      title,
      description,
      category,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      location,
      address,
      organizer: organizer || session.user.name || "Unknown Organizer",
      organizerId: session.user.id,
      capacity,
      registeredCount: 0,
      requiresRegistration,
      isRecurring,
      recurringPattern: recurringPattern || null,
      recurringDays,
      recurringEndDate: recurringEndDate ? new Date(recurringEndDate) : null,
      status: "published",
      imageUrl: imageUrl || null,
      imageUrls: imageUrls || [],
      contactEmail: contactEmail || session.user.email || "",
      contactPhone,
      tags,
      price,
      registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
    }).returning() as any);

    return NextResponse.json(newEvent, { status: 201 });

  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
        { error: "Failed to create event" },
        { status: 500 }
    );
  }
}
