import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { announcements } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// GET /api/announcements/[id] - Get specific announcement
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    // Get the announcement
    const [announcement] = await db
        .select()
        .from(announcements)
        .where(eq(announcements.id, id));

    if (!announcement) {
      return NextResponse.json(
          { error: "Announcement not found" },
          { status: 404 }
      );
    }

    // Check access permissions
    if (!session) {
      // Non-authenticated users can only see published announcements
      if (announcement.status !== "published") {
        return NextResponse.json(
            { error: "Access denied" },
            { status: 403 }
        );
      }
    } else if (session.user.role !== "admin") {
      // Members can only see published announcements
      if (announcement.status !== "published") {
        return NextResponse.json(
            { error: "Access denied" },
            { status: 403 }
        );
      }
    }
    // Admins can see all announcements

    return NextResponse.json(announcement);

  } catch (error) {
    console.error("Error fetching announcement:", error);
    return NextResponse.json(
        { error: "Failed to fetch announcement" },
        { status: 500 }
    );
  }
}

// PUT /api/announcements/[id] - Update announcement (admin only)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
          { error: "Unauthorized - Admin access required" },
          { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Get existing announcement
    const [existingAnnouncement] = await db
        .select()
        .from(announcements)
        .where(eq(announcements.id, id));

    if (!existingAnnouncement) {
      return NextResponse.json(
          { error: "Announcement not found" },
          { status: 404 }
      );
    }

    // Build update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    // Only include fields that are provided in the request
    const { title, content, category, priority, status, expiresAt } = body;
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (category !== undefined) updateData.category = category;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;

    // Update the announcement
    const [updatedAnnouncement] = await db
        .update(announcements)
        .set(updateData)
        .where(eq(announcements.id, id))
        .returning();

    return NextResponse.json(updatedAnnouncement);

  } catch (error) {
    console.error("Error updating announcement:", error);
    return NextResponse.json(
        { error: "Failed to update announcement" },
        { status: 500 }
    );
  }
}

// DELETE /api/announcements/[id] - Delete announcement (admin only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
          { error: "Unauthorized - Admin access required" },
          { status: 401 }
      );
    }

    const { id } = await params;

    // Get existing announcement
    const [existingAnnouncement] = await db
        .select()
        .from(announcements)
        .where(eq(announcements.id, id));

    if (!existingAnnouncement) {
      return NextResponse.json(
          { error: "Announcement not found" },
          { status: 404 }
      );
    }

    // Delete the announcement
    await db
        .delete(announcements)
        .where(eq(announcements.id, id));

    return NextResponse.json({
      message: "Announcement deleted successfully",
      announcement: existingAnnouncement,
    });

  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json(
        { error: "Failed to delete announcement" },
        { status: 500 }
    );
  }
}
