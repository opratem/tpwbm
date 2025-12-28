import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { bookmarks } from '@/lib/db/schema';
import { eq, and, inArray } from 'drizzle-orm';

// GET - Check if resources are bookmarked
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const resourceIds = searchParams.get('resourceIds')?.split(',') || [];

    if (resourceIds.length === 0) {
      return NextResponse.json({ bookmarked: {} });
    }

    const userBookmarks = await db
      .select()
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.userId, session.user.id),
          inArray(bookmarks.resourceId, resourceIds)
        )
      );

    const bookmarkedMap: Record<string, boolean> = {};
    resourceIds.forEach(id => {
      bookmarkedMap[id] = userBookmarks.some(b => b.resourceId === id);
    });

    return NextResponse.json({
      success: true,
      bookmarked: bookmarkedMap
    });
  } catch (error) {
    console.error('Error checking bookmarks:', error);
    return NextResponse.json(
      { error: 'Failed to check bookmarks' },
      { status: 500 }
    );
  }
}
