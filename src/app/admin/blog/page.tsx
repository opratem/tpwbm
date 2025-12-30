"use client";

import { AdminLayout } from "@/components/admin/admin-layout";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  Clock,
  Calendar,
  User,
  Heart,
  MessageSquare,
  Star,
  X,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

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
  scheduledFor?: string;
  viewCount: number;
  isFeatured: boolean;
  allowComments: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogFormData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  status: string;
  imageUrl: string;
  tags: string[];
  isFeatured: boolean;
  allowComments: boolean;
  metaTitle: string;
  metaDescription: string;
  scheduledFor: string;
}

export default function AdminBlogPage() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    content: "",
    excerpt: "",
    category: "general",
    status: "draft",
    imageUrl: "",
    tags: [],
    isFeatured: false,
    allowComments: true,
    metaTitle: "",
    metaDescription: "",
    scheduledFor: "",
  });
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
    search: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Redirect if not admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      redirect("/");
    }
  }, [session, status]);

  useEffect(() => {
    if (session?.user?.role === "admin") {
      fetchPosts();
    }
  }, [session]);

  useEffect(() => {
    const filterPosts = () => {
      let filtered = [...posts];

      if (filters.category !== "all") {
        filtered = filtered.filter(post => post.category === filters.category);
      }

      if (filters.status !== "all") {
        filtered = filtered.filter(post => post.status === filters.status);
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(post =>
            post.title.toLowerCase().includes(searchLower) ||
            post.content.toLowerCase().includes(searchLower) ||
            post.excerpt?.toLowerCase().includes(searchLower) ||
            post.author.toLowerCase().includes(searchLower)
        );
      }

      setFilteredPosts(filtered);
    };

    filterPosts();
  }, [posts, filters]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/blog");
      if (!response.ok) {
        throw new Error("Failed to fetch blog posts");
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  const filterPostsManual = () => {
    let filtered = [...posts];

    if (filters.category !== "all") {
      filtered = filtered.filter(post => post.category === filters.category);
    }

    if (filters.status !== "all") {
      filtered = filtered.filter(post => post.status === filters.status);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(post =>
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          post.excerpt?.toLowerCase().includes(searchLower) ||
          post.author.toLowerCase().includes(searchLower)
      );
    }

    setFilteredPosts(filtered);
  };

  // Helper function to generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      category: "general",
      status: "draft",
      imageUrl: "",
      tags: [],
      isFeatured: false,
      allowComments: true,
      metaTitle: "",
      metaDescription: "",
      scheduledFor: "",
    });
  };

  const handleCreatePost = async () => {
    try {
      setSubmitting(true);

      if (!formData.title || !formData.content) {
        toast.error("Please fill in title and content");
        return;
      }

      // Add slug to the payload
      const payload = {
        ...formData,
        slug: generateSlug(formData.title),
      };

      const response = await fetch("/api/admin/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create blog post");
      }

      const newPost = await response.json();
      setPosts(prev => [newPost, ...prev]);
      setIsCreateDialogOpen(false);
      resetForm();
      toast.success("Blog post created successfully!");
    } catch (error) {
      console.error("Error creating blog post:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create blog post");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditPost = async () => {
    if (!editingPost) return;

    try {
      setSubmitting(true);

      // Use existing slug if title unchanged, otherwise generate new one
      const slug = editingPost.slug && formData.title === editingPost.title
        ? editingPost.slug
        : generateSlug(formData.title);

      const payload = {
        ...formData,
        slug,
      };

      const response = await fetch(`/api/admin/blog/${editingPost.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update blog post");
      }

      const updatedPost = await response.json();
      setPosts(prev => prev.map(post => post.id === editingPost.id ? updatedPost : post));
      setIsEditDialogOpen(false);
      setEditingPost(null);
      resetForm();
      toast.success("Blog post updated successfully!");
    } catch (error) {
      console.error("Error updating blog post:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update blog post");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete blog post");
      }

      setPosts(prev => prev.filter(post => post.id !== postId));
      toast.success("Blog post deleted successfully!");
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete blog post");
    }
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || "",
      category: post.category,
      status: post.status,
      imageUrl: post.imageUrl || "",
      tags: post.tags,
      isFeatured: post.isFeatured,
      allowComments: post.allowComments,
      metaTitle: post.metaTitle || "",
      metaDescription: post.metaDescription || "",
      scheduledFor: post.scheduledFor || "",
    });
    setIsEditDialogOpen(true);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "sermons": return "bg-blue-100 text-blue-800";
      case "testimonies": return "bg-green-100 text-green-800";
      case "ministry_updates": return "bg-purple-100 text-purple-800";
      case "community_news": return "bg-orange-100 text-orange-800";
      case "spiritual_growth": return "bg-indigo-100 text-indigo-800";
      case "events_recap": return "bg-pink-100 text-pink-800";
      case "prayer_points": return "bg-emerald-100 text-emerald-800";
      case "announcements": return "bg-red-100 text-red-800";
      case "devotional": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-100 text-green-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "archived": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderBlogForm = () => (
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Blog post title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sermons">Sermons</SelectItem>
                <SelectItem value="testimonies">Testimonies</SelectItem>
                <SelectItem value="ministry_updates">Ministry Updates</SelectItem>
                <SelectItem value="community_news">Community News</SelectItem>
                <SelectItem value="spiritual_growth">Spiritual Growth</SelectItem>
                <SelectItem value="events_recap">Events Recap</SelectItem>
                <SelectItem value="prayer_points">Prayer Points</SelectItem>
                <SelectItem value="announcements">Announcements</SelectItem>
                <SelectItem value="devotional">Devotional</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
              ref={textareaRef}
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => {
                const cursorPosition = e.target.selectionStart;
                setFormData(prev => ({ ...prev, excerpt: e.target.value }));
                requestAnimationFrame(() => {
                  if (textareaRef.current) {
                    textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
                  }
                });
              }}
              placeholder="Brief description of the blog post"
              rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content *</Label>
          <Textarea
              ref={contentRef}
              id="content"
              value={formData.content}
              onChange={(e) => {
                const cursorPosition = e.target.selectionStart;
                setFormData(prev => ({ ...prev, content: e.target.value }));
                requestAnimationFrame(() => {
                  if (contentRef.current) {
                    contentRef.current.setSelectionRange(cursorPosition, cursorPosition);
                  }
                });
              }}
              placeholder="Blog post content"
              rows={8}
          />
        </div>

        {/* Image Upload Section */}
        <div className="space-y-2">
          <Label>Featured Image</Label>
          <div className="space-y-3">
            {formData.imageUrl?.trim() && (
                <div className="relative inline-block">
                  <img
                      src={formData.imageUrl?.trim() || '/images/blog-default.jpg'}
                      alt="Featured image preview"
                      className="max-w-xs max-h-32 object-contain rounded border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                  />
                  <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1"
                      onClick={() => setFormData(prev => ({ ...prev, imageUrl: "" }))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
            )}

            <div className="flex flex-col gap-3">
              <div>
                <Label htmlFor="imageFile" className="text-sm text-gray-600">Upload from Device</Label>
                <Input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setUploadingImage(true);
                        try {
                          const uploadFormData = new FormData();
                          uploadFormData.append('files', file);
                          uploadFormData.append('folder', 'blog');
                          uploadFormData.append('tags', 'blog,featured-image');

                          const response = await fetch('/api/upload', {
                            method: 'PUT',
                            body: uploadFormData,
                          });

                          const data = await response.json();

                          if (data.success && data.results[0]?.url) {
                            setFormData(prev => ({ ...prev, imageUrl: data.results[0].url }));
                            toast.success("Image uploaded successfully!");
                          } else {
                            throw new Error(data.error || 'Upload failed');
                          }
                        } catch (error) {
                          console.error('Upload error:', error);
                          toast.error("Failed to upload image");
                        } finally {
                          setUploadingImage(false);
                        }
                      }
                    }}
                    disabled={uploadingImage}
                    className="cursor-pointer"
                />
                {uploadingImage && (
                    <p className="text-xs text-blue-600 mt-1">Uploading image...</p>
                )}
              </div>

              <div>
                <Label htmlFor="imageUrl" className="text-sm text-gray-600">Or paste Image URL</Label>
                <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.status === "scheduled" && (
              <div className="space-y-2">
                <Label htmlFor="scheduledFor">Scheduled Date & Time</Label>
                <Input
                    id="scheduledFor"
                    type="datetime-local"
                    value={formData.scheduledFor}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledFor: e.target.value }))}
                />
              </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                className="rounded"
            />
            <Label htmlFor="isFeatured">Featured Post</Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
                type="checkbox"
                id="allowComments"
                checked={formData.allowComments}
                onChange={(e) => setFormData(prev => ({ ...prev, allowComments: e.target.checked }))}
                className="rounded"
            />
            <Label htmlFor="allowComments">Allow Comments</Label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">SEO Title</Label>
            <Input
                id="metaTitle"
                value={formData.metaTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                placeholder="SEO optimized title (60 chars max)"
                maxLength={60}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">SEO Description</Label>
            <Input
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                placeholder="SEO description (160 chars max)"
                maxLength={160}
            />
          </div>
        </div>
      </div>
  );

  if (status === "loading") {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
    );
  }

  return (
    <AdminLayout>
      <div className="container max-w-7xl py-10 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Create and manage church blog posts and articles
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="sermons">Sermons</SelectItem>
                  <SelectItem value="testimonies">Testimonies</SelectItem>
                  <SelectItem value="ministry_updates">Ministry Updates</SelectItem>
                  <SelectItem value="community_news">Community News</SelectItem>
                  <SelectItem value="spiritual_growth">Spiritual Growth</SelectItem>
                  <SelectItem value="events_recap">Events Recap</SelectItem>
                  <SelectItem value="prayer_points">Prayer Points</SelectItem>
                  <SelectItem value="announcements">Announcements</SelectItem>
                  <SelectItem value="devotional">Devotional</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <Search className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                    placeholder="Search posts..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-8 w-48"
                />
              </div>
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Blog Post</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new blog post.
                  </DialogDescription>
                </DialogHeader>
                {renderBlogForm()}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePost} disabled={submitting}>
                    {submitting ? "Creating..." : "Create Post"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{posts.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {posts.filter(p => p.status === "published").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {posts.filter(p => p.status === "draft").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {posts.filter(p => p.isFeatured).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            {post.imageUrl?.trim() && (
                                <img
                                    src={post.imageUrl?.trim() || '/images/blog-default.jpg'}
                                    alt={post.title}
                                    className="w-20 h-20 object-cover rounded"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                />
                            )}
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={getCategoryColor(post.category)}>
                                  {post.category.replace('_', ' ')}
                                </Badge>
                                <Badge className={getStatusColor(post.status)}>
                                  {post.status}
                                </Badge>
                                {post.isFeatured && (
                                    <Badge variant="outline">
                                      <Star className="h-3 w-3 mr-1" />
                                      Featured
                                    </Badge>
                                )}
                              </div>
                              {post.excerpt && (
                                  <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                                    {post.excerpt}
                                  </p>
                              )}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  <span>{post.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                              {post.publishedAt
                                  ? new Date(post.publishedAt).toLocaleDateString()
                                  : new Date(post.createdAt).toLocaleDateString()
                              }
                            </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Eye className="h-4 w-4" />
                                  <span>{post.viewCount} views</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(post)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{post.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => handleDeletePost(post.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              ))}

              {filteredPosts.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold mb-2">No blog posts found</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {filters.search || filters.category !== "all" || filters.status !== "all"
                            ? "Try adjusting your filters to see more posts."
                            : "Get started by creating your first blog post."}
                      </p>
                      <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Blog Post
                      </Button>
                    </CardContent>
                  </Card>
              )}
            </div>
        )}

        {/* Edit Post Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Blog Post</DialogTitle>
              <DialogDescription>
                Update the blog post details below.
              </DialogDescription>
            </DialogHeader>
            {renderBlogForm()}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditPost} disabled={submitting}>
                {submitting ? "Updating..." : "Update Post"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
