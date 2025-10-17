"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, User, ArrowRight, BookOpen, Tag, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

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
  createdAt: string;
  updatedAt: string;
}

export function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const categories = [
    "all",
    "sermons",
    "teachings",
    "testimonies",
    "events",
    "announcements",
    "devotional",
    "general"
  ];

  const fetchBlogPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const url = new URL('/api/admin/blog', window.location.origin);
      if (showFeaturedOnly) {
        url.searchParams.set('featured', 'true');
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }

      const data = await response.json();
      // Only show published posts for public view
      const publishedPosts = (data.posts || []).filter((post: BlogPost) => post.status === 'published');
      setBlogPosts(publishedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blog posts');
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
    }
  }, [showFeaturedOnly]);

  const filterPosts = useCallback(() => {
    let filtered = [...blogPosts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query) ||
          post.author.toLowerCase().includes(query) ||
          post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (showFeaturedOnly) {
      filtered = filtered.filter(post => post.isFeatured);
    }

    setFilteredPosts(filtered);
  }, [blogPosts, searchQuery, selectedCategory, showFeaturedOnly]);

  useEffect(() => {
    fetchBlogPosts();
  }, [fetchBlogPosts]);

  useEffect(() => {
    filterPosts();
  }, [filterPosts, blogPosts, searchQuery, selectedCategory, showFeaturedOnly]);

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

  if (loading) {
    return (
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 mobile-text-lg">Loading blog posts...</span>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-red-600 mobile-text-lg mb-4">Error loading blog posts</div>
            <p className="mobile-text-base text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchBlogPosts} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
    );
  }

  const featuredPost = filteredPosts.find(post => post.isFeatured) || filteredPosts[0];
  const otherPosts = filteredPosts.filter(post => post.id !== featuredPost?.id);

  return (
      <section className="py-16 bg-white dark:from-gray-950 dark:to-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-full mb-6">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <div className="mobile-space-y-4">
              <p className="section-subtitle text-primary dark:text-secondary">OUR BLOG</p>
              <h2 className="mobile-text-2xl md:text-3xl lg:text-4xl text-balance leading-tight text-primary dark:text-gray-100">
                Spiritual Articles &{" "}
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Insights
                </span>
              </h2>
              <div className="w-24 sm:w-32 h-1 sm:h-1.5 bg-gradient-to-r from-primary via-secondary to-primary rounded-full mx-auto" />
            </div>
            <p className="mobile-text-lg text-primary/70 dark:text-gray-300 max-w-2xl mx-auto mt-6">
              Read inspiring articles, biblical insights, and practical wisdom for your spiritual journey.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 border-2 border-gray-200 focus:border-primary"
                />
              </div>
              <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-12 px-4 border-2 border-gray-200 rounded-md focus:border-primary bg-white"
              >
                <option value="all">All Categories</option>
                {categories.slice(1).map(category => (
                    <option key={category} value={category}>
                      {formatCategory(category)}
                    </option>
                ))}
              </select>
              <Button
                  variant={showFeaturedOnly ? "default" : "outline"}
                  onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                  className="h-12 px-6"
              >
                {showFeaturedOnly ? "Show All" : "Featured Only"}
              </Button>
            </div>
          </div>

          {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="mobile-text-lg text-gray-500">No articles found matching your search criteria.</p>
                <Button onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setShowFeaturedOnly(false);
                }} variant="outline" className="mt-4">
                  Clear Filters
                </Button>
              </div>
          ) : (
              <div>
                {/* Featured Post */}
                {featuredPost && (
                    <div className="max-w-6xl mx-auto mb-12">
                      <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <div className="md:flex">
                          <div className="md:w-1/2 relative h-64 md:h-auto">
                            <Image
                                src={featuredPost.imageUrl?.trim() || "/images/blog-default.jpg"}
                                alt={featuredPost.title}
                                fill
                                className="object-cover"
                            />
                            <Badge className="absolute top-4 left-4 bg-secondary text-primary">
                              Featured
                            </Badge>
                          </div>
                          <div className="md:w-1/2 p-8 flex flex-col justify-center">
                            <Badge className="w-fit mb-4 bg-secondary/20 text-primary border-secondary">
                              {formatCategory(featuredPost.category)}
                            </Badge>
                            <h3 className="mobile-text-2xl font-bold mb-4 text-primary dark:text-white">
                              {featuredPost.title}
                            </h3>
                            <p className="mobile-text-base text-primary/70 dark:text-gray-300 mb-6 leading-relaxed">
                              {featuredPost.excerpt || featuredPost.content.substring(0, 200) + "..."}
                            </p>

                            <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{featuredPost.author}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(featuredPost.publishedAt || featuredPost.createdAt)}</span>
                              </div>
                              <span>{getReadTime(featuredPost.content)}</span>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                              {featuredPost.tags.map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs border-primary/30">
                                    <Tag className="h-3 w-3 mr-1" />
                                    {tag}
                                  </Badge>
                              ))}
                            </div>

                            <Button asChild className="w-fit bg-primary hover:bg-primary/90">
                              <Link href={`/blog/${featuredPost.slug}`}>
                                Read Full Article
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                )}

                {/* Posts Grid */}
                {otherPosts.length > 0 && (
                    <div className="max-w-6xl mx-auto">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {otherPosts.map((post) => (
                            <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                              <CardHeader className="p-0">
                                <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                                  <Image
                                      src={post.imageUrl?.trim() || "/images/blog-default.jpg"}
                                      alt={post.title}
                                      fill
                                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <Badge className="absolute top-3 left-3 bg-secondary/90 text-primary text-xs">
                                    {formatCategory(post.category)}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="p-6">
                                <h3 className="mobile-text-lg font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                  {post.title}
                                </h3>

                                <p className="mobile-text-base text-primary/70 dark:text-gray-300 mb-4 line-clamp-3">
                                  {post.excerpt || post.content.substring(0, 120) + "..."}
                                </p>

                                <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    <span>{post.author}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-500">{getReadTime(post.content)}</span>
                                  <Button variant="ghost" size="sm" asChild className="group-hover:bg-secondary/20 group-hover:text-primary">
                                    <Link href={`/blog/${post.slug}`}>
                                      Read More
                                      <ArrowRight className="h-3 w-3 ml-1" />
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
          )}
        </div>
      </section>
  );
}
