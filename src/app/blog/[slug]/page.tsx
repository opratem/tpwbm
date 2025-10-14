import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  User,
  Clock,
  Tag,
  ArrowLeft,
  Share2,
  Heart,
  MessageSquare,
  Eye
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category: string;
  status: string;
  author: string;
  authorId: string;
  imageUrl?: string;
  tags: string[];
  publishedAt?: string;
  viewCount: number;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/admin/blog`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('Failed to fetch blog posts');
      return null;
    }

    const posts: BlogPost[] = await response.json();
    const post = posts.find(p => p.slug === slug && p.status === 'published');

    return post || null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

async function getRelatedPosts(currentPostId: string, category: string): Promise<BlogPost[]> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/admin/blog?category=${category}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return [];
    }

    const posts: BlogPost[] = await response.json();
    return posts
        .filter(p => p.id !== currentPostId && p.status === 'published')
        .slice(0, 3);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found'
    };
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      images: post.imageUrl ? [post.imageUrl] : undefined,
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.id, post.category);

  const formatCategory = (category: string) => {
    return category.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch {
      return 'Date unavailable';
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Button variant="ghost" asChild className="text-white hover:bg-white/10 mb-6">
                <Link href="/blog">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>

              <Badge className="mb-4 bg-purple-600 text-white">
                {formatCategory(post.category)}
              </Badge>

              <h1 className="mobile-text-2xl md:text-3xl lg:text-4xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-blue-100">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{getReadTime(post.content)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{post.viewCount} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            {post.imageUrl && (
                <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
                  <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover"
                      priority
                  />
                </div>
            )}

            {/* Article Content */}
            <Card className="mb-8">
              <CardContent className="p-8">
                {post.excerpt && (
                    <p className="text-lg text-gray-600 mb-6 font-medium leading-relaxed border-l-4 border-blue-500 pl-6 italic">
                      {post.excerpt}
                    </p>
                )}

                <div className="prose prose-lg max-w-none">
                  {post.content.split('\n').map((paragraph, index) => (
                      paragraph.trim() && (
                          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                            {paragraph}
                          </p>
                      )
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {post.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-sm">
                          {tag}
                        </Badge>
                    ))}
                  </div>
                </div>
            )}

            {/* Engagement Section */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4 mr-2" />
                      Like
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Comment
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {relatedPosts.map(relatedPost => (
                        <Card key={relatedPost.id} className="group hover:shadow-lg transition-shadow">
                          <CardContent className="p-0">
                            <div className="relative h-32 mb-3">
                              <Image
                                  src={relatedPost.imageUrl || "/images/blog-default.jpg"}
                                  alt={relatedPost.title}
                                  fill
                                  className="object-cover rounded-t-lg"
                              />
                            </div>
                            <div className="p-4">
                              <Badge className="mb-2 text-xs" variant="outline">
                                {formatCategory(relatedPost.category)}
                              </Badge>
                              <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {relatedPost.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {relatedPost.excerpt || relatedPost.content.substring(0, 80) + "..."}
                              </p>
                              <Button variant="ghost" size="sm" asChild className="p-0 h-auto">
                                <Link href={`/blog/${relatedPost.slug}`}>
                                  Read More →
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                    ))}
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}
