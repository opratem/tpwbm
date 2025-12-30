"use client";

import { AdminLayout } from "@/components/admin/admin-layout";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Users,
  Clock,
  Settings,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: "high" | "normal" | "low";
  author: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  expiresAt: string;
}

interface AnnouncementFormData {
  title: string;
  content: string;
  category: string;
  priority: string;
  expiresAt: string;
}

export default function AdminAnnouncementsPage() {
  const { data: session, status } = useSession();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: "",
    content: "",
    category: "general",
    priority: "normal",
    expiresAt: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to check if user has admin privileges (admin or super_admin)
  const isAdminUser = (role: string | undefined) => {
    return role === "admin" || role === "super_admin";
  };

  // Move useEffect before any conditional returns to follow Rules of Hooks
  useEffect(() => {
    // Only fetch if user is authenticated and is admin or super_admin
    if (session && isAdminUser(session.user.role)) {
      fetchAnnouncements();
    }
  }, [session]);

  // Handle loading state
  if (status === "loading") {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
        </div>
    );
  }

  // Handle authentication - allow both admin and super_admin
  if (!session || !isAdminUser(session.user.role)) {
    redirect("/members/dashboard");
  }

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/announcements");
      if (!response.ok) {
        throw new Error("Failed to fetch announcements");
      }
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (isEdit = false) => {
    if (!formData.title || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const url = isEdit && editingAnnouncement
          ? `/api/announcements/${editingAnnouncement.id}`
          : "/api/announcements";

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEdit ? "update" : "create"} announcement`);
      }

      const result = await response.json();

      if (isEdit) {
        setAnnouncements(prev =>
            prev.map(a => a.id === result.id ? result : a)
        );
        toast.success("Announcement updated successfully");
        setIsEditDialogOpen(false);
      } else {
        setAnnouncements(prev => [result, ...prev]);
        toast.success("Announcement created successfully");
        setIsCreateDialogOpen(false);
      }

      resetForm();
    } catch (error) {
      console.error("Error submitting announcement:", error);
      toast.error(`Failed to ${isEdit ? "update" : "create"} announcement`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
      priority: announcement.priority,
      expiresAt: announcement.expiresAt.split('T')[0], // Convert to date input format
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) {
      return;
    }

    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete announcement");
      }

      setAnnouncements(prev => prev.filter(a => a.id !== id));
      toast.success("Announcement deleted successfully");
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast.error("Failed to delete announcement");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      category: "general",
      priority: "normal",
      expiresAt: "",
    });
    setEditingAnnouncement(null);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "event":
        return Calendar;
      case "schedule":
        return Clock;
      case "general":
        return Bell;
      case "ministry":
        return Users;
      case "outreach":
        return Users;
      case "urgent":
        return Bell;
      default:
        return Bell;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "event":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "schedule":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "general":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      case "ministry":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "outreach":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "normal":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "low":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter announcements based on search and filters
  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || announcement.category === categoryFilter;
    const matchesPriority = priorityFilter === "all" || announcement.priority === priorityFilter;

    return matchesSearch && matchesCategory && matchesPriority;
  });

  const renderAnnouncementForm = () => (
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title *</Label>
          <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter announcement title..."
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="content">Content *</Label>
          <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter announcement content..."
              rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="schedule">Schedule</SelectItem>
                <SelectItem value="ministry">Ministry</SelectItem>
                <SelectItem value="outreach">Outreach</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
                value={formData.priority}
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="expiresAt">Expires On</Label>
          <Input
              id="expiresAt"
              type="date"
              value={formData.expiresAt}
              onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
          />
        </div>
      </div>
  );

  return (
    <AdminLayout>
      <div className="container max-w-7xl py-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Manage Announcements</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Create, edit, and manage church announcements
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
                variant="outline"
                size="sm"
                onClick={fetchAnnouncements}
                disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={() => resetForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Announcement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Announcement</DialogTitle>
                  <DialogDescription>
                    Create a new announcement to share with your church community.
                  </DialogDescription>
                </DialogHeader>
                {renderAnnouncementForm()}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleSubmit(false)} disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Announcement"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                      id="search"
                      placeholder="Search announcements..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-filter">Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="schedule">Schedule</SelectItem>
                    <SelectItem value="ministry">Ministry</SelectItem>
                    <SelectItem value="outreach">Outreach</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority-filter">Priority</Label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Total Found</Label>
                <div className="text-2xl font-bold text-blue-600">
                  {filteredAnnouncements.length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Announcements List */}
        <div className="space-y-4">
          {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }, (_, i) => (
                    <Card key={`skeleton-${i}-${Date.now()}`} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                        <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-2/3" />
                      </CardContent>
                    </Card>
                ))}
              </div>
          ) : announcements.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">No announcements found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || categoryFilter !== "all" || priorityFilter !== "all"
                        ? "Try adjusting your filters to see more results."
                        : "Get started by creating your first announcement."}
                  </p>
                  {(!searchTerm && categoryFilter === "all" && priorityFilter === "all") && (
                      <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Announcement
                      </Button>
                  )}
                </CardContent>
              </Card>
          ) : (
              filteredAnnouncements.map((announcement) => {
                const CategoryIcon = getCategoryIcon(announcement.category);
                const isExpired = new Date(announcement.expiresAt) < new Date();

                return (
                    <Card key={announcement.id} className={`hover:shadow-lg transition-shadow ${isExpired ? 'opacity-75' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <CategoryIcon className="h-6 w-6 text-blue-600" />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-4 mb-3">
                                <h3 className="text-xl font-semibold">{announcement.title}</h3>
                                <div className="flex items-center gap-2">
                                  <Badge className={getCategoryColor(announcement.category)}>
                                    {announcement.category}
                                  </Badge>
                                  <Badge className={getPriorityColor(announcement.priority)}>
                                    {announcement.priority}
                                  </Badge>
                                  {isExpired && (
                                      <Badge variant="secondary">Expired</Badge>
                                  )}
                                </div>
                              </div>

                              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                                {announcement.content}
                              </p>

                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center gap-4">
                                  <span>By {announcement.author}</span>
                                  <span>Created: {formatDate(announcement.createdAt)}</span>
                                  <span>Expires: {formatDate(announcement.expiresAt)}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(announcement)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(announcement.id)}
                                className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                );
              })
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Announcement</DialogTitle>
              <DialogDescription>
                Make changes to the announcement details.
              </DialogDescription>
            </DialogHeader>
            {renderAnnouncementForm()}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleSubmit(true)} disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Announcement"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
