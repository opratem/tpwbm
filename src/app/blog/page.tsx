import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Calendar, User, Clock, ArrowRight, Search } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category: string;
  status: string;
  author: string;
  imageUrl?: string;
  tags: string[];
  publishedAt?: string;
  viewCount: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://tpwbm.com.ng');
    const response = await fetch(`${baseUrl}/api/admin/blog`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('Failed to fetch blog posts');
      return [];
    }

    const posts: BlogPost[] = await response.json();
    return posts.filter(p => p.status === 'published');
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

function formatCategory(category: string) {
  return category.split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function getReadTime(content: string) {
  const wordsPerMinute = 200;
  const wordCount = content.split(' ').length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
}

export const metadata = {
  title: 'Blog | TPWBM',
  description: 'Read inspiring articles, devotionals, and church updates from The Prevailing Word Believers Ministry',
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const featuredPosts = posts.filter(p => p.isFeatured).slice(0, 3);
  const recentPosts = posts.slice(0, 9);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      <PageHeader
        title="Our Blog"
        subtitle="Insights & Inspiration"
        description="Read inspiring articles, devotionals, and updates from our church community"
        backgroundImage="/images/blog-header-bg.jpg"
        minHeight="md"
      />

      <div className="container mx-auto px-4 py-16">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <h2 className="mobile-text-2xl font-bold mb-8 text-gray-900">Featured Articles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.imageUrl || "/images/blog-default.jpg"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <Badge className="mb-3" variant="outline">
                      {formatCategory(post.category)}
                    </Badge>
                    <h3 className="mobile-text-xl font-bold mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt || post.content.substring(0, 120)}...
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(post.publishedAt || post.createdAt), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="p-0">
                      <Link href={`/blog/${post.slug}`}>
                        Read More <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Recent Posts */}
        <section>
          <h2 className="mobile-text-2xl font-bold mb-8 text-gray-900">Recent Articles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.imageUrl || "/images/blog-default.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <Badge className="mb-3" variant="outline">
                    {formatCategory(post.category)}
                  </Badge>
                  <h3 className="mobile-text-lg font-bold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                    {post.excerpt || post.content.substring(0, 100)}...
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(post.publishedAt || post.createdAt), 'MMM dd')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{getReadTime(post.content)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="mobile-text-xl font-semibold text-gray-600 mb-4">No blog posts yet</h3>
            <p className="text-gray-500">Check back soon for inspiring content!</p>
          </div>
        )}
      </div>
    </div>
  );
}
