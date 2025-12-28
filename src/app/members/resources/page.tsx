"use client";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Book,
  BookOpen,
  Calendar,
  Download,
  Eye,
  FileText,
  Filter,
  Heart,
  Music,
  Play,
  Search,
  Users,
  Video,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// Resource type
type Resource = {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  date: string;
  author?: string;
  downloads?: number;
  size?: string;
  format?: string;
  featured?: boolean;
  thumbnail?: string;
  youtubeUrl?: string;
  embedUrl?: string;
  duration?: string;
  viewCount?: string;
};

export default function MemberResources() {
  const { data: session } = useSession();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch resources from YouTube API
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        // Fetch from YouTube API
        const response = await fetch(
          "/api/youtube/church-content?maxResults=50",
        );

        if (response.ok) {
          const data = await response.json();

          // Transform YouTube videos into resources
          const youtubeResources: Resource[] =
            data.videos?.map((video: any, index: number) => ({
              id: video.id,
              title: video.title,
              description: video.description || "No description available",
              type: "video",
              category: determineCategory(video.title, video.description),
              date: video.publishedAt,
              author: video.channelTitle || "TPWBM",
              downloads: Number.parseInt(video.rawViewCount) || 0,
              format: "Video",
              featured: index < 3, // First 3 videos are featured
              thumbnail: video.thumbnail,
              youtubeUrl: video.youtubeUrl,
              embedUrl: video.embedUrl,
              duration: video.duration,
              viewCount: video.viewCount,
            })) || [];

          setResources(youtubeResources);
        } else {
          console.error("Failed to fetch resources");
          setResources([]);
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Determine category based on title and description
  const determineCategory = (title: string, description: string): string => {
    const content = `${title} ${description}`.toLowerCase();

    if (
      content.includes("sermon") ||
      content.includes("message") ||
      content.includes("preaching")
    )
      return "Sermons";
    if (content.includes("prayer") || content.includes("intercession"))
      return "Prayer";
    if (
      content.includes("worship") ||
      content.includes("song") ||
      content.includes("music")
    )
      return "Music";
    if (content.includes("study") || content.includes("bible"))
      return "Bible Study";
    if (content.includes("youth") || content.includes("children"))
      return "Children";
    if (content.includes("testimony") || content.includes("testimonies"))
      return "Testimonies";
    if (content.includes("announcement")) return "Announcements";

    return "General";
  };

  // Get unique categories for filter
  const allCategories = Array.from(
    new Set(resources.map((resource) => resource.category)),
  ).sort();

  // Filter and sort resources
  let filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort resources
  filteredResources = filteredResources.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "popular":
        return (b.downloads ?? 0) - (a.downloads ?? 0);
      case "alphabetical":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const getTypeIcon = (type: string) => {
    const icons = {
      video: Video,
      sermon: Book,
      study: BookOpen,
      prayer: Heart,
      music: Music,
      document: FileText,
      curriculum: Users,
    };
    return icons[type as keyof typeof icons] || Video;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      video:
        "bg-church-primary/10 text-church-primary border-church-primary/20",
      sermon: "bg-church-accent/10 text-church-accent border-church-accent/20",
      study:
        "bg-church-primary/10 text-church-primary border-church-primary/20",
      prayer: "bg-church-accent/10 text-church-accent border-church-accent/20",
      music:
        "bg-church-primary/10 text-church-primary border-church-primary/20",
      document:
        "bg-church-accent/10 text-church-accent border-church-accent/20",
      curriculum:
        "bg-church-primary/10 text-church-primary border-church-primary/20",
    };
    return (
      colors[type as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const handleView = (resource: Resource) => {
    if (resource.youtubeUrl) {
      window.open(resource.youtubeUrl, "_blank");
    }
  };

  const handlePreview = (resource: Resource) => {
    // In a real app, this would open a preview modal with the video player
    if (resource.youtubeUrl) {
      window.open(resource.youtubeUrl, "_blank");
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-church-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-primary" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-church-surface">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-primary mx-auto" />
          <p className="text-church-text-muted">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-10 space-y-8 bg-church-surface">
      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-church-primary">
          Member Resources
        </h1>
        <p className="text-church-text-muted mt-2">
          Access sermons, study materials, and church content
        </p>
      </div>

      {/* Featured Resources */}
      {resources.filter((r) => r.featured).length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-church-text mb-4">
            Featured Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources
              .filter((r) => r.featured)
              .map((resource) => {
                const Icon = getTypeIcon(resource.type);
                return (
                  <Card
                    key={resource.id}
                    className="hover:shadow-lg transition-all duration-300 border-l-4 border-church-accent group overflow-hidden"
                  >
                    {resource.thumbnail && (
                      <div className="relative h-48 w-full overflow-hidden bg-church-primary/5">
                        <img
                          src={resource.thumbnail}
                          alt={resource.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-church-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Play className="h-12 w-12 text-white" />
                        </div>
                        {resource.duration && (
                          <div className="absolute bottom-2 right-2 bg-church-primary/90 text-white px-2 py-1 rounded text-xs font-semibold">
                            {resource.duration}
                          </div>
                        )}
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-church-accent/10 rounded-lg flex items-center justify-center border border-church-accent/20">
                            <Icon className="h-5 w-5 text-church-accent" />
                          </div>
                          <Badge
                            className={`${getTypeColor(resource.type)} border`}
                          >
                            {resource.category}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-tight text-church-text">
                        {resource.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-church-text-muted line-clamp-2">
                        {resource.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-church-text-muted">
                        <span>
                          {new Date(resource.date).toLocaleDateString()}
                        </span>
                        {resource.viewCount && (
                          <span>{resource.viewCount} views</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-church-primary hover:bg-church-primary-light text-white"
                          onClick={() => handleView(resource)}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Watch
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-church-primary text-church-primary hover:bg-church-primary hover:text-white"
                          onClick={() => handlePreview(resource)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <Card className="border-church-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-church-text">
                Search Resources
              </Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-church-text-muted" />
                <Input
                  id="search"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-church-primary/20 focus:border-church-accent focus:ring-church-accent"
                />
              </div>
            </div>

            <div className="w-full lg:w-48">
              <Label htmlFor="category" className="text-church-text">
                Category
              </Label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full mt-1 p-2 border border-church-primary/20 rounded-md focus:border-church-accent focus:ring-church-accent text-church-text bg-white"
              >
                <option value="all">All Categories</option>
                {allCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full lg:w-48">
              <Label htmlFor="sort" className="text-church-text">
                Sort By
              </Label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full mt-1 p-2 border border-church-primary/20 rounded-md focus:border-church-accent focus:ring-church-accent text-church-text bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Viewed</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-church-text-muted">
            <span>{filteredResources.length} resources found</span>
          </div>
        </CardContent>
      </Card>

      {/* All Resources */}
      <div>
        <h2 className="text-xl font-semibold text-church-text mb-4">
          All Resources
        </h2>
        <div className="space-y-4">
          {filteredResources.map((resource) => {
            const Icon = getTypeIcon(resource.type);
            return (
              <Card
                key={resource.id}
                className="hover:shadow-lg transition-all duration-300 border-church-primary/20 group"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {resource.thumbnail ? (
                      <div className="relative w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-church-primary/5">
                        <img
                          src={resource.thumbnail}
                          alt={resource.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-church-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                        {resource.duration && (
                          <div className="absolute bottom-1 right-1 bg-church-primary/90 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
                            {resource.duration}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-church-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-church-accent/20">
                        <Icon className="h-6 w-6 text-church-accent" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2 gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-church-text group-hover:text-church-accent transition-colors">
                            {resource.title}
                          </h3>
                          <p className="text-sm text-church-text-muted mt-1 line-clamp-2">
                            {resource.description}
                          </p>
                        </div>
                        <Badge
                          className={`${getTypeColor(resource.type)} border flex-shrink-0`}
                        >
                          {resource.category}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-church-text-muted mb-3 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(resource.date).toLocaleDateString()}
                        </span>
                        {resource.author && <span>By {resource.author}</span>}
                        {resource.viewCount && (
                          <span>{resource.viewCount} views</span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-church-primary hover:bg-church-primary-light text-white"
                          onClick={() => handleView(resource)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Watch
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-church-primary text-church-primary hover:bg-church-primary hover:text-white"
                          onClick={() => handlePreview(resource)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {filteredResources.length === 0 && (
        <Card className="border-church-primary/20">
          <CardContent className="text-center py-12">
            <Video className="h-12 w-12 mx-auto text-church-text-muted mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-church-text">
              No resources found
            </h3>
            <p className="text-church-text-muted">
              Try adjusting your search terms or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
