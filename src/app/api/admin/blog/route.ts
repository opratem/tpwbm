import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import {
  checkRateLimit,
  rateLimiters,
  getSecurityHeaders,
  validateOrigin
} from '@/lib/security';
import { blogPostSchema, validateAndSanitize } from '@/lib/validations';
import { notificationService } from '@/lib/notification-service';

// GET /api/blog - Get all blog posts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const conditions = [];

    // If not admin, only show published posts
    if (!session || session.user.role !== 'admin') {
      conditions.push(eq(blogPosts.status, 'published'));
    }

    // Add filters with proper type validation
    if (status && session?.user.role === 'admin') {
      const validStatuses = ['draft', 'published', 'scheduled', 'archived'] as const;
      type BlogStatus = typeof validStatuses[number];
      if (validStatuses.includes(status as BlogStatus)) {
        conditions.push(eq(blogPosts.status, status as BlogStatus));
      }
    }

    if (category) {
      const validCategories = ['sermons', 'testimonies', 'ministry_updates', 'community_news', 'spiritual_growth', 'events_recap', 'prayer_points', 'announcements', 'devotional', 'general'] as const;
      type BlogCategory = typeof validCategories[number];
      if (validCategories.includes(category as BlogCategory)) {
        conditions.push(eq(blogPosts.category, category as BlogCategory));
      }
    }

    if (featured === 'true') {
      conditions.push(eq(blogPosts.isFeatured, true));
    }

    // Build the query in one go
    const posts = conditions.length > 0
        ? await db.select().from(blogPosts).where(and(...conditions)).orderBy(desc(blogPosts.createdAt))
        : await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));

    return NextResponse.json(posts);
  } catch (error) {
    console.error("[BLOG-GET] Error:", error);
    return NextResponse.json(
        { error: "Failed to fetch blog posts" },
        { status: 500 }
    );
  }
}

// POST /api/blog - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
          { error: "Unauthorized - Admin access required" },
          { status: 401 }
      );
    }

    // Validate origin
    if (!validateOrigin(request)) {
      return NextResponse.json(
        { error: 'Invalid request origin' },
        { status: 403 }
      );
    }

    // Apply security headers
    const securityHeaders = getSecurityHeaders();

    // Rate limiting - 10 blog posts per 10 minutes
    const rateLimit = checkRateLimit(request, rateLimiters.forms);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many blog post creation requests. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        {
          status: 429,
          headers: {
            ...securityHeaders,
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
          }
        }
      );
    }

    const body = await request.json();

    // Validate with Zod
    const validation = validateAndSanitize(blogPostSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid blog post data',
          details: validation.errors
        },
        { status: 400, headers: securityHeaders }
      );
    }

    const validatedData = validation.data;

    const newPost = {
      title: validatedData.title,
      slug: validatedData.slug,
      content: validatedData.content,
      excerpt: validatedData.excerpt || '',
      category: validatedData.category as 'sermons' | 'testimonies' | 'ministry_updates' | 'community_news' | 'spiritual_growth' | 'events_recap' | 'prayer_points' | 'announcements' | 'devotional' | 'general',
      status: validatedData.status as 'draft' | 'published' | 'archived',
      author: validatedData.author || session.user.name || 'Admin',
      authorId: session.user.id,
      imageUrl: validatedData.imageUrl || null,
      tags: validatedData.tags || [],
      isFeatured: validatedData.isFeatured || false,
      allowComments: true,
      metaTitle: validatedData.metaTitle || validatedData.title,
      metaDescription: validatedData.metaDescription || validatedData.excerpt,
      scheduledFor: null,
      publishedAt: validatedData.status === 'published' ? new Date() : null,
    };

    const [blogPost] = await db.insert(blogPosts).values(newPost).returning();

    // Send notification for published blog posts
    if (blogPost.status === 'published') {
      try {
        await notificationService.newBlogPost({
          postId: blogPost.slug,
          title: blogPost.title,
          author: blogPost.author,
          category: blogPost.category,
        });
        console.log(`[BLOG-CREATE] Notification sent for new published blog post: ${blogPost.id}`);
      } catch (notificationError) {
        console.error('[BLOG-CREATE] Failed to send notification:', notificationError);
        // Don't fail the blog creation if notification fails
      }
    }

    return NextResponse.json(blogPost, { status: 201, headers: securityHeaders });
  } catch (error) {
    console.error("[BLOG-CREATE] Error:", error);
    return NextResponse.json(
        { error: "Failed to create blog post" },
        { status: 500 }
    );
  }
}