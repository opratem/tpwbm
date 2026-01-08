import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blogPosts, blogLikes } from '@/lib/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Helper to get session ID from cookies or generate one
function getSessionId(request: NextRequest): string {
  const sessionId = request.cookies.get('blog_session_id')?.value;
  if (sessionId) return sessionId;
  // Generate a random session ID
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// GET - Get like count and whether current user has liked
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get the blog post
    const [post] = await db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Get like count
    const [likeCountResult] = await db
      .select({ count: count() })
      .from(blogLikes)
      .where(eq(blogLikes.blogPostId, post.id));

    const likeCount = likeCountResult?.count || 0;

    // Check if current user/session has liked
    const session = await getServerSession(authOptions);
    const sessionId = getSessionId(request);

    let hasLiked = false;

    if (session?.user?.id) {
      // Check by user ID for logged-in users
      const [userLike] = await db
        .select()
        .from(blogLikes)
        .where(
          and(
            eq(blogLikes.blogPostId, post.id),
            eq(blogLikes.userId, session.user.id)
          )
        )
        .limit(1);
      hasLiked = !!userLike;
    } else {
      // Check by session ID for anonymous users
      const [sessionLike] = await db
        .select()
        .from(blogLikes)
        .where(
          and(
            eq(blogLikes.blogPostId, post.id),
            eq(blogLikes.sessionId, sessionId)
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
    console.error('Error getting likes:', error);
    return NextResponse.json({ error: 'Failed to get likes' }, { status: 500 });
  }
}

// POST - Like a post
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get the blog post
    const [post] = await db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const session = await getServerSession(authOptions);
    const sessionId = getSessionId(request);
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';

    // Check if already liked
    let existingLike;
    if (session?.user?.id) {
      [existingLike] = await db
        .select()
        .from(blogLikes)
        .where(
          and(
            eq(blogLikes.blogPostId, post.id),
            eq(blogLikes.userId, session.user.id)
          )
        )
        .limit(1);
    } else {
      [existingLike] = await db
        .select()
        .from(blogLikes)
        .where(
          and(
            eq(blogLikes.blogPostId, post.id),
            eq(blogLikes.sessionId, sessionId)
          )
        )
        .limit(1);
    }

    if (existingLike) {
      return NextResponse.json({ error: 'Already liked' }, { status: 400 });
    }

    // Create the like
    await db.insert(blogLikes).values({
      blogPostId: post.id,
      userId: session?.user?.id || null,
      sessionId: session?.user?.id ? null : sessionId,
      ipAddress: ip,
    });

    // Get updated count
    const [likeCountResult] = await db
      .select({ count: count() })
      .from(blogLikes)
      .where(eq(blogLikes.blogPostId, post.id));

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
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }

    return response;
  } catch (error) {
    console.error('Error liking post:', error);
    return NextResponse.json({ error: 'Failed to like post' }, { status: 500 });
  }
}

// DELETE - Unlike a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get the blog post
    const [post] = await db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const session = await getServerSession(authOptions);
    const sessionId = getSessionId(request);

    // Delete the like
    if (session?.user?.id) {
      await db
        .delete(blogLikes)
        .where(
          and(
            eq(blogLikes.blogPostId, post.id),
            eq(blogLikes.userId, session.user.id)
          )
        );
    } else {
      await db
        .delete(blogLikes)
        .where(
          and(
            eq(blogLikes.blogPostId, post.id),
            eq(blogLikes.sessionId, sessionId)
          )
        );
    }

    // Get updated count
    const [likeCountResult] = await db
      .select({ count: count() })
      .from(blogLikes)
      .where(eq(blogLikes.blogPostId, post.id));

    return NextResponse.json({
      success: true,
      likeCount: likeCountResult?.count || 0,
      hasLiked: false,
    });
  } catch (error) {
    console.error('Error unliking post:', error);
    return NextResponse.json({ error: 'Failed to unlike post' }, { status: 500 });
  }
}
