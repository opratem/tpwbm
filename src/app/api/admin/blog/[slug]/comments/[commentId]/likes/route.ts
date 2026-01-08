import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blogComments, commentLikes } from '@/lib/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Helper to get session ID from cookies or generate one
function getSessionId(request: NextRequest): string {
  const sessionId = request.cookies.get('blog_session_id')?.value;
  if (sessionId) return sessionId;
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// GET - Get like count for a comment and whether current user has liked
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; commentId: string }> }
) {
  try {
    const { commentId } = await params;

    // Verify comment exists
    const [comment] = await db
      .select({ id: blogComments.id })
      .from(blogComments)
      .where(eq(blogComments.id, commentId))
      .limit(1);

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Get like count
    const [likeCountResult] = await db
      .select({ count: count() })
      .from(commentLikes)
      .where(eq(commentLikes.commentId, commentId));

    const likeCount = likeCountResult?.count || 0;

    // Check if current user/session has liked
    const session = await getServerSession(authOptions);
    const sessionId = getSessionId(request);

    let hasLiked = false;

    if (session?.user?.id) {
      const [userLike] = await db
        .select()
        .from(commentLikes)
        .where(
          and(
            eq(commentLikes.commentId, commentId),
            eq(commentLikes.userId, session.user.id)
          )
        )
        .limit(1);
      hasLiked = !!userLike;
    } else {
      const [sessionLike] = await db
        .select()
        .from(commentLikes)
        .where(
          and(
            eq(commentLikes.commentId, commentId),
            eq(commentLikes.sessionId, sessionId)
          )
        )
        .limit(1);
      hasLiked = !!sessionLike;
    }

    return NextResponse.json({
      likeCount,
      hasLiked,
    });
  } catch (error) {
    console.error('Error getting comment likes:', error);
    return NextResponse.json({ error: 'Failed to get likes' }, { status: 500 });
  }
}

// POST - Like a comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; commentId: string }> }
) {
  try {
    const { commentId } = await params;

    // Verify comment exists
    const [comment] = await db
      .select({ id: blogComments.id })
      .from(blogComments)
      .where(eq(blogComments.id, commentId))
      .limit(1);

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    const session = await getServerSession(authOptions);
    const sessionId = getSessionId(request);
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';

    // Check if already liked
    let existingLike;
    if (session?.user?.id) {
      [existingLike] = await db
        .select()
        .from(commentLikes)
        .where(
          and(
            eq(commentLikes.commentId, commentId),
            eq(commentLikes.userId, session.user.id)
          )
        )
        .limit(1);
    } else {
      [existingLike] = await db
        .select()
        .from(commentLikes)
        .where(
          and(
            eq(commentLikes.commentId, commentId),
            eq(commentLikes.sessionId, sessionId)
          )
        )
        .limit(1);
    }

    if (existingLike) {
      return NextResponse.json({ error: 'Already liked' }, { status: 400 });
    }

    // Create the like
    await db.insert(commentLikes).values({
      commentId,
      userId: session?.user?.id || null,
      sessionId: session?.user?.id ? null : sessionId,
      ipAddress: ip,
    });

    // Get updated count
    const [likeCountResult] = await db
      .select({ count: count() })
      .from(commentLikes)
      .where(eq(commentLikes.commentId, commentId));

    const response = NextResponse.json({
      success: true,
      likeCount: likeCountResult?.count || 0,
      hasLiked: true,
    });

    // Set session cookie for anonymous users
    if (!session?.user?.id) {
      response.cookies.set('blog_session_id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    return response;
  } catch (error) {
    console.error('Error liking comment:', error);
    return NextResponse.json({ error: 'Failed to like comment' }, { status: 500 });
  }
}

// DELETE - Unlike a comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; commentId: string }> }
) {
  try {
    const { commentId } = await params;

    const session = await getServerSession(authOptions);
    const sessionId = getSessionId(request);

    // Delete the like
    if (session?.user?.id) {
      await db
        .delete(commentLikes)
        .where(
          and(
            eq(commentLikes.commentId, commentId),
            eq(commentLikes.userId, session.user.id)
          )
        );
    } else {
      await db
        .delete(commentLikes)
        .where(
          and(
            eq(commentLikes.commentId, commentId),
            eq(commentLikes.sessionId, sessionId)
          )
        );
    }

    // Get updated count
    const [likeCountResult] = await db
      .select({ count: count() })
      .from(commentLikes)
      .where(eq(commentLikes.commentId, commentId));

    return NextResponse.json({
      success: true,
      likeCount: likeCountResult?.count || 0,
      hasLiked: false,
    });
  } catch (error) {
    console.error('Error unliking comment:', error);
    return NextResponse.json({ error: 'Failed to unlike comment' }, { status: 500 });
  }
}
