import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { events, eventRegistrations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// Helper function to validate UUID format
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// Helper function to check if user has admin privileges (admin or super_admin)
const isAdminUser = (role: string | undefined) => {
  return role === "admin" || role === "super_admin";
};

// GET /api/events/[id] - Get event by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate UUID format
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: "Invalid event ID format" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    const [event] = await db
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
      .from(events)
      .where(eq(events.id, id));

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Check access permissions
    if (!session) {
      // Non-authenticated users can only see published events
      if (event.status !== "published") {
        return NextResponse.json(
          { error: "Access denied" },
          { status: 403 }
        );
      }
    } else if (!isAdminUser(session.user.role)) {
      // Members can only see published events
      if (event.status !== "published") {
        return NextResponse.json(
          { error: "Access denied" },
          { status: 403 }
        );
      }
    }
    // Admins and super_admins can see all events

    // Get current user's registration status if authenticated
    let isRegistered = false;
    if (session?.user.id && event.requiresRegistration) {
      const [registration] = await db
        .select()
        .from(eventRegistrations)
        .where(
          and(
            eq(eventRegistrations.eventId, id),
            eq(eventRegistrations.userId, session.user.id)
          )
        );
      isRegistered = !!registration;
    }

    return NextResponse.json({
      ...event,
      isRegistered,
    });

  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

// PUT /api/events/[id] - Update event (admin or super_admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate UUID format
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: "Invalid event ID format" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);

    if (!session || !isAdminUser(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Get existing event
    const [existingEvent] = await db
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
      .from(events)
      .where(eq(events.id, id));

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    // Handle date fields conversion
    const {
      title, description, category, startDate, endDate, location, address,
      organizer, capacity, requiresRegistration, isRecurring, recurringPattern,
      recurringDays, recurringEndDate, status, imageUrl, imageUrls, contactEmail, contactPhone, tags, price, registrationDeadline
    } = body;

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = new Date(endDate);
    if (location !== undefined) updateData.location = location;
    if (address !== undefined) updateData.address = address;
    if (organizer !== undefined) updateData.organizer = organizer || session.user.name || 'Unknown';
    if (capacity !== undefined) updateData.capacity = capacity;
    if (requiresRegistration !== undefined) updateData.requiresRegistration = requiresRegistration;
    if (isRecurring !== undefined) updateData.isRecurring = isRecurring;
    if (recurringPattern !== undefined) updateData.recurringPattern = recurringPattern;
    if (recurringDays !== undefined) updateData.recurringDays = recurringDays;
    if (recurringEndDate !== undefined) updateData.recurringEndDate = recurringEndDate ? new Date(recurringEndDate) : null;
    if (status !== undefined) updateData.status = status;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (imageUrls !== undefined) updateData.imageUrls = imageUrls;
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail;
    if (contactPhone !== undefined) updateData.contactPhone = contactPhone;
    if (tags !== undefined) updateData.tags = tags;
    if (price !== undefined) updateData.price = price;
    if (registrationDeadline !== undefined) updateData.registrationDeadline = registrationDeadline ? new Date(registrationDeadline) : null;

    // Update the event
    const [updatedEvent] = await db
      .update(events)
      .set(updateData)
      .where(eq(events.id, id))
      .returning();

    return NextResponse.json(updatedEvent);

  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// PATCH /api/events/[id] - Partially update event (admin or super_admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate UUID format
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: "Invalid event ID format" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);

    if (!session || !isAdminUser(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Get existing event
    const [existingEvent] = await db
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
      .from(events)
      .where(eq(events.id, id));

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Build update data (only fields provided in the request)
    const updateData: any = {
      updatedAt: new Date(),
    };

    // Handle date fields conversion
    const {
      title, description, category, startDate, endDate, location, address,
      organizer, capacity, requiresRegistration, isRecurring, recurringPattern,
      recurringDays, recurringEndDate, status, imageUrl, imageUrls, contactEmail, contactPhone, tags, price, registrationDeadline
    } = body;

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = new Date(endDate);
    if (location !== undefined) updateData.location = location;
    if (address !== undefined) updateData.address = address;
    if (organizer !== undefined) updateData.organizer = organizer || session.user.name || 'Unknown';
    if (capacity !== undefined) updateData.capacity = capacity;
    if (requiresRegistration !== undefined) updateData.requiresRegistration = requiresRegistration;
    if (isRecurring !== undefined) updateData.isRecurring = isRecurring;
    if (recurringPattern !== undefined) updateData.recurringPattern = recurringPattern;
    if (recurringDays !== undefined) updateData.recurringDays = recurringDays;
    if (recurringEndDate !== undefined) updateData.recurringEndDate = recurringEndDate ? new Date(recurringEndDate) : null;
    if (status !== undefined) updateData.status = status;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (imageUrls !== undefined) updateData.imageUrls = imageUrls;
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail;
    if (contactPhone !== undefined) updateData.contactPhone = contactPhone;
    if (tags !== undefined) updateData.tags = tags;
    if (price !== undefined) updateData.price = price;
    if (registrationDeadline !== undefined) updateData.registrationDeadline = registrationDeadline ? new Date(registrationDeadline) : null;

    // Update the event
    const [updatedEvent] = await db
      .update(events)
      .set(updateData)
      .where(eq(events.id, id))
      .returning();

    return NextResponse.json(updatedEvent);

  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id] - Delete event (admin or super_admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate UUID format
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: "Invalid event ID format" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);

    if (!session || !isAdminUser(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    // Get existing event
    const [existingEvent] = await db
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
      .from(events)
      .where(eq(events.id, id));

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Delete the event (cascade will handle event registrations)
    await db
      .delete(events)
      .where(eq(events.id, id));

    return NextResponse.json({
      message: "Event deleted successfully",
      event: existingEvent,
    });

  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
