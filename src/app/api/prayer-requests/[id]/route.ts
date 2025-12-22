import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { prayerRequests, prayerResponses, users } from "@/lib/db/schema";
import { eq, and, or, sql } from "drizzle-orm";

// GET /api/prayer-requests/[id] - Get specific prayer request
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    // Get the prayer request
    const [prayerRequest] = await db
        .select()
        .from(prayerRequests)
        .where(eq(prayerRequests.id, id));

    if (!prayerRequest) {
      return NextResponse.json(
          { error: "Prayer request not found" },
          { status: 404 }
      );
    }

    // Check access permissions
    if (!session) {
      // Non-authenticated users can only see public active requests
      if (!prayerRequest.isPublic || prayerRequest.status !== "active") {
        return NextResponse.json(
            { error: "Access denied" },
            { status: 403 }
        );
      }
    } else if (session.user.role !== "admin") {
      // Members can see their own requests or public active/answered requests
      const canAccess =
          prayerRequest.requestedById === session.user.id ||
          (prayerRequest.isPublic && (prayerRequest.status === "active" || prayerRequest.status === "answered"));

      if (!canAccess) {
        return NextResponse.json(
            { error: "Access denied" },
            { status: 403 }
        );
      }
    }

    // Get list of users who prayed (for admin view or if user owns the request)
    let prayedByUsers: string[] = [];
    let hasPrayed = false;

    if (session?.user.id) {
      // Check if current user has prayed
      const [userPrayer] = await db
          .select()
          .from(prayerResponses)
          .where(
              and(
                  eq(prayerResponses.prayerRequestId, id),
                  eq(prayerResponses.userId, session.user.id)
              )
          );

      hasPrayed = !!userPrayer;

      // Get all prayer responses if admin or owner
      if (session.user.role === "admin" || prayerRequest.requestedById === session.user.id) {
        const allPrayers = await db
            .select({
              userId: prayerResponses.userId,
            })
            .from(prayerResponses)
            .where(eq(prayerResponses.prayerRequestId, id));

        prayedByUsers = allPrayers.map(p => p.userId);
      }
    }

    return NextResponse.json({
      ...prayerRequest,
      prayedByUsers,
      hasPrayed,
    });

  } catch (error) {
    console.error("Error fetching prayer request:", error);
    return NextResponse.json(
        { error: "Failed to fetch prayer request" },
        { status: 500 }
    );
  }
}

// PUT /api/prayer-requests/[id] - Update prayer request
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Get existing prayer request
    const [existingRequest] = await db
        .select()
        .from(prayerRequests)
        .where(eq(prayerRequests.id, id));

    if (!existingRequest) {
      return NextResponse.json(
          { error: "Prayer request not found" },
          { status: 404 }
      );
    }

    // Check permissions - only admin or original requester can edit
    if (session.user.role !== "admin" && existingRequest.requestedById !== session.user.id) {
      return NextResponse.json(
          { error: "Permission denied" },
          { status: 403 }
      );
    }

    // Validate update permissions based on role
    const allowedFields = session.user.role === "admin"
        ? Object.keys(body) // Admins can update any field
        : ["title", "description", "category", "priority", "isAnonymous", "isPublic", "tags"]; // Users can only update certain fields

    const updateData: any = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Always update the updatedAt timestamp
    updateData.updatedAt = new Date();

    // Update the prayer request
    const [updatedRequest] = await db
        .update(prayerRequests)
        .set(updateData)
        .where(eq(prayerRequests.id, id))
        .returning();

    return NextResponse.json(updatedRequest);

  } catch (error) {
    console.error("Error updating prayer request:", error);
    return NextResponse.json(
        { error: "Failed to update prayer request" },
        { status: 500 }
    );
  }
}

// PATCH /api/prayer-requests/[id] - Handle prayer actions (pray/unpray)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    // Get existing prayer request
    const [existingRequest] = await db
        .select()
        .from(prayerRequests)
        .where(eq(prayerRequests.id, id));

    if (!existingRequest) {
      return NextResponse.json(
          { error: "Prayer request not found" },
          { status: 404 }
      );
    }

    // Check access permissions
    if (!existingRequest.isPublic && existingRequest.requestedById !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json(
          { error: "Access denied" },
          { status: 403 }
      );
    }

    if (action === "pray") {
      const userId = session.user.id;

      // Check if user has already prayed
      const [existingPrayer] = await db
          .select()
          .from(prayerResponses)
          .where(
              and(
                  eq(prayerResponses.prayerRequestId, id),
                  eq(prayerResponses.userId, userId)
              )
          );

      if (existingPrayer) {
        // Remove prayer (unpray)
        await db
            .delete(prayerResponses)
            .where(
                and(
                    eq(prayerResponses.prayerRequestId, id),
                    eq(prayerResponses.userId, userId)
                )
            );

        // Decrement prayer count
        await db
            .update(prayerRequests)
            .set({
              prayerCount: sql`${prayerRequests.prayerCount} - 1`,
              updatedAt: new Date(),
            })
            .where(eq(prayerRequests.id, id));
      } else {
        // Add prayer
        await db.insert(prayerResponses).values({
          prayerRequestId: id,
          userId: userId,
          userName: session.user.name || "Unknown",
          isPrayed: true,
        });

        // Increment prayer count
        await db
            .update(prayerRequests)
            .set({
              prayerCount: sql`${prayerRequests.prayerCount} + 1`,
              updatedAt: new Date(),
            })
            .where(eq(prayerRequests.id, id));
      }

      // Get updated prayer request
      const [updatedRequest] = await db
          .select()
          .from(prayerRequests)
          .where(eq(prayerRequests.id, id));

      return NextResponse.json(updatedRequest);
    }

    return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
    );

  } catch (error) {
    console.error("Error updating prayer request:", error);
    return NextResponse.json(
        { error: "Failed to update prayer request" },
        { status: 500 }
    );
  }
}

// DELETE /api/prayer-requests/[id] - Delete prayer request
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
      );
    }

    const { id } = await params;

    // Get existing prayer request
    const [existingRequest] = await db
        .select()
        .from(prayerRequests)
        .where(eq(prayerRequests.id, id));

    if (!existingRequest) {
      return NextResponse.json(
          { error: "Prayer request not found" },
          { status: 404 }
      );
    }

    // Check permissions - only admin or original requester can delete
    if (session.user.role !== "admin" && existingRequest.requestedById !== session.user.id) {
      return NextResponse.json(
          { error: "Permission denied" },
          { status: 403 }
      );
    }

    // Delete the prayer request (cascade will handle prayer responses)
    await db
        .delete(prayerRequests)
        .where(eq(prayerRequests.id, id));

    return NextResponse.json({
      message: "Prayer request deleted successfully",
      prayerRequest: existingRequest,
    });

  } catch (error) {
    console.error("Error deleting prayer request:", error);
    return NextResponse.json(
        { error: "Failed to delete prayer request" },
        { status: 500 }
    );
  }
}
