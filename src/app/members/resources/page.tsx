"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Download,
  Eye,
  Book,
  FileText,
  Music,
  Video,
  Calendar,
  Filter,
  BookOpen,
  Heart,
  Users
} from "lucide-react";

// Mock resources data
const mockResources = [
  {
    id: 1,
    title: "Walking in Faith - Sermon Notes",
    description: "Detailed notes from last Sunday's sermon on faith and trust in God's plan",
    type: "sermon",
    category: "Sermons",
    date: "2024-05-26",
    author: "Pastor Michael",
    downloads: 45,
    size: "2.3 MB",
    format: "PDF",
    featured: true,
  },
  {
    id: 2,
    title: "Romans Study Guide - Week 4",
    description: "Interactive study guide for our current Romans series, focusing on Romans 4:1-25",
    type: "study",
    category: "Bible Study",
    date: "2024-05-20",
    author: "Adult Education Team",
    downloads: 32,
    size: "1.8 MB",
    format: "PDF",
    featured: false,
  },
  {
    id: 3,
    title: "Monthly Prayer Focus - June 2024",
    description: "Prayer points and scripture verses for our church's June prayer emphasis",
    type: "prayer",
    category: "Prayer",
    date: "2024-05-31",
    author: "Prayer Ministry",
    downloads: 67,
    size: "0.9 MB",
    format: "PDF",
    featured: true,
  },
  {
    id: 4,
    title: "Worship Songs - May Playlist",
    description: "Chord charts and lyrics for all worship songs used in May services",
    type: "music",
    category: "Music",
    date: "2024-05-01",
    author: "Worship Team",
    downloads: 23,
    size: "4.2 MB",
    format: "ZIP",
    featured: false,
  },
  {
    id: 5,
    title: "Annual Report 2023",
    description: "Complete overview of our church's ministry activities, finances, and growth in 2023",
    type: "document",
    category: "Reports",
    date: "2024-01-15",
    author: "Church Board",
    downloads: 89,
    size: "5.7 MB",
    format: "PDF",
    featured: false,
  },
  {
    id: 6,
    title: "New Member Handbook",
    description: "Everything new members need to know about our church family, values, and ministries",
    type: "document",
    category: "Orientation",
    date: "2024-03-10",
    author: "Membership Team",
    downloads: 156,
    size: "3.4 MB",
    format: "PDF",
    featured: true,
  },
  {
    id: 7,
    title: "Children's Ministry Curriculum - Summer",
    description: "Complete curriculum package for children's Sunday school during summer months",
    type: "curriculum",
    category: "Children",
    date: "2024-05-15",
    author: "Children's Ministry",
    downloads: 28,
    size: "12.3 MB",
    format: "ZIP",
    featured: false,
  },
  {
    id: 8,
    title: "Marriage Enrichment Workbook",
    description: "Practical workbook for couples looking to strengthen their relationship",
    type: "study",
    category: "Marriage",
    date: "2024-04-08",
    author: "Family Ministry",
    downloads: 41,
    size: "2.1 MB",
    format: "PDF",
    featured: false,
  },
];

export default function MemberResources() {
  const { data: session } = useSession();
  const [resources] = useState(mockResources);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Get unique categories for filter
  const allCategories = Array.from(
    new Set(resources.map(resource => resource.category))
  ).sort();

  // Filter and sort resources
  let filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
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
        return b.downloads - a.downloads;
      case "alphabetical":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const getTypeIcon = (type: string) => {
    const icons = {
      sermon: Book,
      study: BookOpen,
      prayer: Heart,
      music: Music,
      document: FileText,
      curriculum: Users,
    };
    return icons[type as keyof typeof icons] || FileText;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      sermon: "bg-blue-100 text-blue-800",
      study: "bg-green-100 text-green-800",
      prayer: "bg-purple-100 text-purple-800",
      music: "bg-orange-100 text-orange-800",
      document: "bg-gray-100 text-gray-800",
      curriculum: "bg-pink-100 text-pink-800",
    };
    return colors[type as keyof typeof colors] || colors.document;
  };

  const handleDownload = (resourceId: number) => {
    // In a real app, this would trigger actual download
    console.log(`Downloading resource ${resourceId}`);
  };

  const handlePreview = (resourceId: number) => {
    // In a real app, this would open a preview modal
    console.log(`Previewing resource ${resourceId}`);
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-400">Member Resources</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Access sermons, study materials, and church documents
        </p>
      </div>

      {/* Featured Resources */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Featured Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.filter(r => r.featured).map((resource) => {
            const Icon = getTypeIcon(resource.type);
            return (
              <Card key={resource.id} className="hover:shadow-md transition-shadow border-l-4 border-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <Badge className={getTypeColor(resource.type)}>
                        {resource.category}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {resource.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(resource.date).toLocaleDateString()}</span>
                    <span>{resource.downloads} downloads</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => handleDownload(resource.id)}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handlePreview(resource.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Resources</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="w-full lg:w-48">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md"
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
              <Label htmlFor="sort">Sort By</Label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Downloaded</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <span>{filteredResources.length} resources found</span>
          </div>
        </CardContent>
      </Card>

      {/* All Resources */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Resources</h2>
        <div className="space-y-4">
          {filteredResources.map((resource) => {
            const Icon = getTypeIcon(resource.type);
            return (
              <Card key={resource.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-gray-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{resource.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {resource.description}
                          </p>
                        </div>
                        <Badge className={getTypeColor(resource.type)}>
                          {resource.category}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(resource.date).toLocaleDateString()}
                        </span>
                        <span>By {resource.author}</span>
                        <span>{resource.downloads} downloads</span>
                        <span>{resource.size} • {resource.format}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleDownload(resource.id)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handlePreview(resource.id)}>
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
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No resources found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
