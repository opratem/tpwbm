import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions, hasAdminAccess } from "@/lib/auth";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notificationService } from '@/lib/notification-service';

// GET /api/blog/[id] - Get single blog post
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    const [post] = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.id, id));

    if (!post) {
      return NextResponse.json(
          { error: "Blog post not found" },
          { status: 404 }
      );
    }

    // If not admin and post is not published, deny access
    if ((!session || !hasAdminAccess(session.user.role)) && post.status !== 'published') {
      return NextResponse.json(
          { error: "Blog post not found" },
          { status: 404 }
      );
    }

    // Increment view count for published posts
    if (post.status === 'published') {
      await db
          .update(blogPosts)
          .set({ viewCount: post.viewCount + 1 })
          .where(eq(blogPosts.id, id));

      post.viewCount += 1;
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("[BLOG-GET-ID] Error:", error);
    return NextResponse.json(
        { error: "Failed to fetch blog post" },
        { status: 500 }
    );
  }
}

// PUT /api/blog/[id] - Update blog post
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !hasAdminAccess(session.user.role)) {
      return NextResponse.json(
          { error: "Unauthorized - Admin access required" },
          { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Check if post exists
    const [existingPost] = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.id, id));

    if (!existingPost) {
      return NextResponse.json(
          { error: "Blog post not found" },
          { status: 404 }
      );
    }

    const {
      title,
      content,
      excerpt,
      category,
      status,
      imageUrl,
      tags,
      isFeatured,
      allowComments,
      metaTitle,
      metaDescription,
      scheduledFor
    } = body;

    // Generate new slug if title changed
    let slug = existingPost.slug;
    if (title && title !== existingPost.title) {
      slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
    }

    const updateData: Partial<typeof blogPosts.$inferInsert> = {
      ...body,
      slug,
      updatedAt: new Date(),
    };

    // Set publishedAt when changing from draft to published
    if (status === 'published' && existingPost.status !== 'published') {
      updateData.publishedAt = new Date();
    }

    // Handle scheduled posts
    if (scheduledFor) {
      updateData.scheduledFor = new Date(scheduledFor);
    }

    const [updatedPost] = await db
        .update(blogPosts)
        .set(updateData)
        .where(eq(blogPosts.id, id))
        .returning();

    // Send notification when post is newly published
    if (status === 'published' && existingPost.status !== 'published') {
      try {
        await notificationService.newBlogPost({
          postId: updatedPost.slug,
          title: updatedPost.title,
          author: updatedPost.author,
          category: updatedPost.category,
        });
        console.log(`[BLOG-UPDATE] Notification sent for newly published blog post: ${updatedPost.id}`);
      } catch (notificationError) {
        console.error('[BLOG-UPDATE] Failed to send notification:', notificationError);
        // Don't fail the blog update if notification fails
      }
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("[BLOG-UPDATE] Error:", error);
    return NextResponse.json(
        { error: "Failed to update blog post" },
        { status: 500 }
    );
  }
}

// DELETE /api/blog/[id] - Delete blog post
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !hasAdminAccess(session.user.role)) {
      return NextResponse.json(
          { error: "Unauthorized - Admin access required" },
          { status: 401 }
      );
    }

    const { id } = await params;

    // Check if post exists
    const [existingPost] = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.id, id));

    if (!existingPost) {
      return NextResponse.json(
          { error: "Blog post not found" },
          { status: 404 }
      );
    }

    await db.delete(blogPosts).where(eq(blogPosts.id, id));

    return NextResponse.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("[BLOG-DELETE] Error:", error);
    return NextResponse.json(
        { error: "Failed to delete blog post" },
        { status: 500 }
    );
  }
}
