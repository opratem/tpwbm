import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blogPosts, blogComments } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notificationService } from '@/lib/notification-service';

// GET - Get comments for a post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get the blog post
    const [post] = await db
      .select({ id: blogPosts.id, allowComments: blogPosts.allowComments })
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (!post.allowComments) {
      return NextResponse.json({
        comments: [],
        allowComments: false,
        message: 'Comments are disabled for this post',
      });
    }

    // Get approved comments
    const comments = await db
      .select({
        id: blogComments.id,
        authorName: blogComments.authorName,
        content: blogComments.content,
        createdAt: blogComments.createdAt,
        parentCommentId: blogComments.parentCommentId,
      })
      .from(blogComments)
      .where(
        and(
          eq(blogComments.blogPostId, post.id),
          eq(blogComments.status, 'approved')
        )
      )
      .orderBy(desc(blogComments.createdAt));

    return NextResponse.json({
      comments,
      allowComments: true,
      commentCount: comments.length,
    });
  } catch (error) {
    console.error('Error getting comments:', error);
    return NextResponse.json({ error: 'Failed to get comments' }, { status: 500 });
  }
}

// POST - Add a comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { content, authorName, authorEmail, parentCommentId } = body;

    // Validate input
    if (!content || content.trim().length < 3) {
      return NextResponse.json(
        { error: 'Comment must be at least 3 characters long' },
        { status: 400 }
      );
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'Comment must be less than 2000 characters' },
        { status: 400 }
      );
    }

    // Get the blog post with author info
    const [post] = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        allowComments: blogPosts.allowComments,
        authorId: blogPosts.authorId,
        author: blogPosts.author,
      })
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (!post.allowComments) {
      return NextResponse.json(
        { error: 'Comments are disabled for this post' },
        { status: 403 }
      );
    }

    const session = await getServerSession(authOptions);
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const userAgent = request.headers.get('user-agent') || '';

    // Use session user info if logged in, otherwise require name and email
    let finalAuthorName = authorName;
    let finalAuthorEmail = authorEmail;
    let authorId = null;

    if (session?.user) {
      finalAuthorName = session.user.name || authorName || 'Anonymous';
      finalAuthorEmail = session.user.email || authorEmail;
      authorId = session.user.id;
    } else {
      // Validate name and email for anonymous users
      if (!authorName || authorName.trim().length < 2) {
        return NextResponse.json(
          { error: 'Name is required and must be at least 2 characters' },
          { status: 400 }
        );
      }
      if (!authorEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorEmail)) {
        return NextResponse.json(
          { error: 'Valid email is required' },
          { status: 400 }
        );
      }
    }

    // Auto-approve comments from logged-in users, pending for anonymous
    const status = session?.user ? 'approved' : 'pending';

    // Create the comment
    const [newComment] = await db
      .insert(blogComments)
      .values({
        blogPostId: post.id,
        authorName: finalAuthorName.trim(),
        authorEmail: finalAuthorEmail,
        authorId,
        content: content.trim(),
        status,
        parentCommentId: parentCommentId || null,
        ipAddress: ip,
        userAgent,
      })
      .returning();

    // Send notification to blog post author and admins
    // Only notify if comment is approved (logged-in users' comments are auto-approved)
    if (status === 'approved') {
      try {
        await notificationService.newBlogComment({
          postId: post.id,
          postSlug: post.slug,
          postTitle: post.title,
          authorId: post.authorId,
          authorName: post.author,
          commenterName: finalAuthorName.trim(),
          commentPreview: content.trim(),
          isReply: !!parentCommentId,
        });
        console.log(`[BLOG-COMMENT] Notification sent for new comment on post: ${post.slug}`);
      } catch (notificationError) {
        // Don't fail the comment submission if notification fails
        console.error('[BLOG-COMMENT] Failed to send notification:', notificationError);
      }
    }

    return NextResponse.json({
      success: true,
      comment: {
        id: newComment.id,
        authorName: newComment.authorName,
        content: newComment.content,
        createdAt: newComment.createdAt,
        status: newComment.status,
      },
      message: status === 'approved'
        ? 'Comment posted successfully!'
        : 'Comment submitted and awaiting moderation.',
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}
