import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { bookmarks } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

// GET - Fetch all bookmarks for authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userBookmarks = await db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.userId, session.user.id))
      .orderBy(desc(bookmarks.createdAt));

    return NextResponse.json({
      success: true,
      bookmarks: userBookmarks
    });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks' },
      { status: 500 }
    );
  }
}

// POST - Create a new bookmark
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { resourceType, resourceId, resourceTitle, resourceUrl, resourceThumbnail, resourceMetadata } = body;

    if (!resourceType || !resourceId || !resourceTitle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if bookmark already exists
    const existingBookmark = await db
      .select()
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.userId, session.user.id),
          eq(bookmarks.resourceId, resourceId),
          eq(bookmarks.resourceType, resourceType)
        )
      )
      .limit(1);

    if (existingBookmark.length > 0) {
      return NextResponse.json(
        { error: 'Bookmark already exists', bookmark: existingBookmark[0] },
        { status: 409 }
      );
    }

    // Create new bookmark
    const newBookmark = await db
      .insert(bookmarks)
      .values({
        userId: session.user.id,
        resourceType,
        resourceId,
        resourceTitle,
        resourceUrl: resourceUrl || null,
        resourceThumbnail: resourceThumbnail || null,
        resourceMetadata: resourceMetadata || {}
      })
      .returning();

    return NextResponse.json({
      success: true,
      bookmark: newBookmark[0]
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to create bookmark' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a bookmark
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const resourceId = searchParams.get('resourceId');
    const resourceType = searchParams.get('resourceType');

    if (!resourceId || !resourceType) {
      return NextResponse.json(
        { error: 'Missing resourceId or resourceType' },
        { status: 400 }
      );
    }

    const deletedBookmark = await db
      .delete(bookmarks)
      .where(
        and(
          eq(bookmarks.userId, session.user.id),
          eq(bookmarks.resourceId, resourceId),
          eq(bookmarks.resourceType, resourceType as any)
        )
      )
      .returning();

    if (deletedBookmark.length === 0) {
      return NextResponse.json(
        { error: 'Bookmark not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Bookmark removed successfully'
    });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to delete bookmark' },
      { status: 500 }
    );
  }
}
