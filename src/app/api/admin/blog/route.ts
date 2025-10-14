import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

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

    // Add filters
    if (status && session?.user.role === 'admin') {
      conditions.push(eq(blogPosts.status, status as any));
    }

    if (category) {
      conditions.push(eq(blogPosts.category, category as any));
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

    const body = await request.json();
    const {
      title,
      content,
      excerpt,
      category,
      status = 'draft',
      imageUrl,
      tags = [],
      isFeatured = false,
      allowComments = true,
      metaTitle,
      metaDescription,
      scheduledFor
    } = body;

    // Generate slug from title
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const newPost = {
      title,
      slug,
      content,
      excerpt,
      category,
      status,
      author: session.user.name || 'Admin',
      authorId: session.user.id,
      imageUrl,
      tags,
      isFeatured,
      allowComments,
      metaTitle,
      metaDescription,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      publishedAt: status === 'published' ? new Date() : null,
    };

    const [blogPost] = await db.insert(blogPosts).values(newPost).returning();

    return NextResponse.json(blogPost, { status: 201 });
  } catch (error) {
    console.error("[BLOG-CREATE] Error:", error);
    return NextResponse.json(
        { error: "Failed to create blog post" },
        { status: 500 }
    );
  }
}
