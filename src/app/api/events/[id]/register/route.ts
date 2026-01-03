import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { events, eventRegistrations } from "@/lib/db/schema";
import { eq, and, count, sql } from "drizzle-orm";
import { notificationService } from '@/lib/notification-service';

// Helper function to validate UUID format
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// POST /api/events/[id]/register - Register for an event
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
          { error: "Authentication required to register for events" },
          { status: 401 }
      );
    }

    const { id: eventId } = await params;

    // Validate UUID format
    if (!isValidUUID(eventId)) {
      return NextResponse.json(
          { error: "Invalid event ID format" },
          { status: 400 }
      );
    }

    const body = await request.json();
    const { notes } = body;

    // Get event details
    const [event] = await db
        .select()
        .from(events)
        .where(eq(events.id, eventId));

    if (!event) {
      return NextResponse.json(
          { error: "Event not found" },
          { status: 404 }
      );
    }

    // Check if event is published
    if (event.status !== "published") {
      return NextResponse.json(
          { error: "Event is not available for registration" },
          { status: 400 }
      );
    }

    // Check if registration is required for this event
    if (!event.requiresRegistration) {
      return NextResponse.json(
          { error: "This event does not require registration" },
          { status: 400 }
      );
    }

    // Check if registration deadline has passed
    if (event.registrationDeadline && new Date() > event.registrationDeadline) {
      return NextResponse.json(
          { error: "Registration deadline has passed" },
          { status: 400 }
      );
    }

    // Check if user is already registered
    const [existingRegistration] = await db
        .select()
        .from(eventRegistrations)
        .where(
            and(
                eq(eventRegistrations.eventId, eventId),
                eq(eventRegistrations.userId, session.user.id),
                eq(eventRegistrations.status, 'registered')
            )
        );

    if (existingRegistration) {
      return NextResponse.json(
          { error: "You are already registered for this event" },
          { status: 400 }
      );
    }

    // Check capacity
    if (event.capacity && event.capacity > 0) {
      const [capacityCheck] = await db
          .select({ count: count() })
          .from(eventRegistrations)
          .where(
              and(
                  eq(eventRegistrations.eventId, eventId),
                  eq(eventRegistrations.status, 'registered')
              )
          );

      if (event.capacity && capacityCheck.count >= event.capacity) {
        return NextResponse.json(
            { error: "Event is at full capacity" },
            { status: 400 }
        );
      }
    }

    // Create registration in a transaction
    await db.transaction(async (tx) => {
      // Insert registration
      await tx.insert(eventRegistrations).values({
        eventId,
        userId: session.user.id,
        userName: session.user.name || "Unknown User",
        userEmail: session.user.email || "",
        notes: notes || null,
        status: "registered",
      });

      // Update registered count
      await tx
          .update(events)
          .set({
            registeredCount: sql`${events.registeredCount} + 1`,
            updatedAt: new Date(),
          })
          .where(eq(events.id, eventId));
    });

    // Get the created registration
    const [newRegistration] = await db
        .select()
        .from(eventRegistrations)
        .where(
            and(
                eq(eventRegistrations.eventId, eventId),
                eq(eventRegistrations.userId, session.user.id)
            )
        );

    // Send notification to admins about new event registration
    try {
      await notificationService.newEventRegistration({
        eventId: event.id,
        eventTitle: event.title,
        userName: session.user.name || "Unknown User",
        userEmail: session.user.email || "",
      });
      console.log(`[EVENT-REGISTRATION] Notification sent for event: ${event.id}`);
    } catch (notificationError) {
      console.error('[EVENT-REGISTRATION] Failed to send notification:', notificationError);
      // Don't fail the registration if notification fails
    }

    return NextResponse.json({
      message: "Successfully registered for event",
      registration: newRegistration,
    }, { status: 201 });

  } catch (error) {
    console.error("Error registering for event:", error);
    return NextResponse.json(
        { error: "Failed to register for event" },
        { status: 500 }
    );
  }
}

// DELETE /api/events/[id]/register - Cancel event registration
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
      );
    }

    const { id: eventId } = await params;

    // Validate UUID format
    if (!isValidUUID(eventId)) {
      return NextResponse.json(
          { error: "Invalid event ID format" },
          { status: 400 }
      );
    }

    // Find existing registration
    const [existingRegistration] = await db
        .select()
        .from(eventRegistrations)
        .where(
            and(
                eq(eventRegistrations.eventId, eventId),
                eq(eventRegistrations.userId, session.user.id),
                eq(eventRegistrations.status, 'registered')
            )
        );

    if (!existingRegistration) {
      return NextResponse.json(
          { error: "No active registration found for this event" },
          { status: 404 }
      );
    }

    // Cancel registration in a transaction
    await db.transaction(async (tx) => {
      // Update registration status
      await tx
          .update(eventRegistrations)
          .set({
            status: 'cancelled',
          })
          .where(eq(eventRegistrations.id, existingRegistration.id));

      // Update registered count
      await tx
          .update(events)
          .set({
            registeredCount: sql`${events.registeredCount} - 1`,
            updatedAt: new Date(),
          })
          .where(eq(events.id, eventId));
    });

    return NextResponse.json({
      message: "Event registration cancelled successfully",
    });

  } catch (error) {
    console.error("Error cancelling event registration:", error);
    return NextResponse.json(
        { error: "Failed to cancel registration" },
        { status: 500 }
    );
  }
}

// GET /api/events/[id]/register - Get user's registration status for event
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({
        isRegistered: false,
        requiresAuth: false,
        registrationCount: 0,
        error: "Invalid event ID format"
      }, { status: 400 });
    }

    const { id: eventId } = await params;

    // Validate UUID format
    if (!isValidUUID(eventId)) {
      return NextResponse.json({
        isRegistered: false,
        requiresAuth: false,
        registrationCount: 0,
        error: "Invalid event ID format"
      }, { status: 400 });
    }

    // Find user's registration
    const [registration] = await db
        .select()
        .from(eventRegistrations)
        .where(
            and(
                eq(eventRegistrations.eventId, eventId),
                eq(eventRegistrations.userId, session.user.id),
                eq(eventRegistrations.status, 'registered')
            )
        );

    // Get current registration count
    const [registrationCountResult] = await db
        .select({ count: count() })
        .from(eventRegistrations)
        .where(
            and(
                eq(eventRegistrations.eventId, eventId),
                eq(eventRegistrations.status, 'registered')
            )
        );

    return NextResponse.json({
      isRegistered: !!registration,
      registration: registration || null,
      registrationCount: registrationCountResult.count,
      requiresAuth: false,
    });

  } catch (error) {
    console.error("Error checking registration status:", error);
    return NextResponse.json(
        { error: "Failed to check registration status" },
        { status: 500 }
    );
  }
}
