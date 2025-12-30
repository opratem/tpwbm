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
import Calendar from "@/components/ui/calender";
import Events from "@/components/ui/events";
import type { Event, EventCategory, EventFormData, RecurringPattern } from "@/types/events";
import {
  Calendar as CalendarIcon,
  Plus,
  Edit,
  Trash2,
  Users,
  MapPin,
  Clock,
  Search,
  Filter,
  Grid,
  List,
  Settings,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminEventsPage() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    category: "worship",
    startDate: "",
    endDate: "",
    location: "",
    address: "",
    organizer: "",
    capacity: undefined,
    requiresRegistration: false,
    isRecurring: false,
    recurringPattern: undefined,
    recurringDays: [],
    recurringEndDate: "",
    contactEmail: "",
    contactPhone: "",
    tags: [],
    price: undefined,
    registrationDeadline: "",
    imageUrl: "",
    imageUrls: [],
  });
  const [filters, setFilters] = useState({
    category: "all" as EventCategory | "all",
    status: "all" as "all" | "published" | "draft" | "cancelled",
    search: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to check if user has admin privileges (admin or super_admin)
  const isAdminUser = (role: string | undefined) => {
    return role === "admin" || role === "super_admin";
  };

  // Helper function to consolidate image handling (migrate single imageUrl to imageUrls array)
  const consolidateImages = (imageUrl?: string, imageUrls?: string[]) => {
    const urls: string[] = [];

    // Add existing imageUrls if they exist
    if (imageUrls && imageUrls.length > 0) {
      urls.push(...imageUrls);
    }

    // Add legacy imageUrl if it exists and isn't already in imageUrls
    if (imageUrl && !urls.includes(imageUrl)) {
      urls.push(imageUrl);
    }

    return urls;
  };

  // Helper function to convert date to datetime-local format
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";
    // Format as YYYY-MM-DDTHH:MM for datetime-local input
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Helper function to format date for date input
  const formatDateOnly = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().split('T')[0];
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging to false if we're leaving the drop zone completely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(file =>
        file.type.startsWith('image/')
    );

    if (files.length > 0) {
      await handleImageUpload(files);
    }
  };

  const handleImageUpload = async (files: File[]) => {
    setUploadingImage(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const uploadFormData = new FormData();
        uploadFormData.append('files', file);
        uploadFormData.append('folder', 'events');
        uploadFormData.append('tags', 'event,flyer');

        const response = await fetch('/api/upload', {
          method: 'PUT',
          body: uploadFormData,
        });

        const data = await response.json();
        if (data.success && data.results[0]?.url) {
          return data.results[0].url;
        }
        throw new Error(data.error || 'Upload failed');
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        imageUrls: [...(prev.imageUrls || []), ...uploadedUrls]
      }));
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Failed to upload images");
    } finally {
      setUploadingImage(false);
    }
  };

  // Redirect if not admin or super_admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session || !isAdminUser(session.user.role)) {
      redirect("/");
    }
  }, [session, status]);

  useEffect(() => {
    if (session?.user?.role && isAdminUser(session.user.role)) {
      fetchEvents();
    }
  }, [session]);

  useEffect(() => {
    let filtered = [...events];

    // Filter by category
    if (filters.category !== "all") {
      filtered = filtered.filter(event => event.category === filters.category);
    }

    // Filter by status
    if (filters.status !== "all") {
      filtered = filtered.filter(event => event.status === filters.status);
    }

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(event =>
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.location.toLowerCase().includes(searchLower) ||
          event.organizer.toLowerCase().includes(searchLower)
      );
    }

    setFilteredEvents(filtered);
  }, [events, filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/events");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "worship",
      startDate: "",
      endDate: "",
      location: "",
      address: "",
      organizer: "",
      capacity: undefined,
      requiresRegistration: false,
      isRecurring: false,
      recurringPattern: undefined,
      recurringDays: [],
      recurringEndDate: "",
      contactEmail: "",
      contactPhone: "",
      tags: [],
      price: undefined,
      registrationDeadline: "",
      imageUrl: "",
      imageUrls: [],
    });
  };

  const handleCreateEvent = async () => {
    try {
      setSubmitting(true);

      // Validate required fields
      if (!formData.title || !formData.description || !formData.startDate || !formData.endDate || !formData.location) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Consolidate images before submission
      const consolidatedImages = consolidateImages(formData.imageUrl, formData.imageUrls);
      const submitData = {
        ...formData,
        imageUrls: consolidatedImages,
        imageUrl: consolidatedImages.length > 0 ? consolidatedImages[0] : "",
      };

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create event");
      }

      const newEvent = await response.json();
      setEvents(prev => [newEvent, ...prev]);
      setIsCreateDialogOpen(false);
      resetForm();
      toast.success("Event created successfully!");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditEvent = async () => {
    if (!editingEvent) return;

    try {
      setSubmitting(true);

      // Consolidate images before submission
      const consolidatedImages = consolidateImages(formData.imageUrl, formData.imageUrls);
      const submitData = {
        ...formData,
        imageUrls: consolidatedImages,
        imageUrl: consolidatedImages.length > 0 ? consolidatedImages[0] : "",
      };

      const response = await fetch(`/api/events/${editingEvent.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update event");
      }

      const updatedEvent = await response.json();
      setEvents(prev => prev.map(event => event.id === editingEvent.id ? updatedEvent : event));
      setIsEditDialogOpen(false);
      setEditingEvent(null);
      resetForm();
      toast.success("Event updated successfully!");
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete event");
      }

      setEvents(prev => prev.filter(event => event.id !== eventId));
      toast.success("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete event");
    }
  };

  const handleToggleStatus = async (eventId: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update event status");
      }

      const updatedEvent = await response.json();
      setEvents(prev => prev.map(event => event.id === eventId ? updatedEvent : event));
      toast.success(`Event ${newStatus === "published" ? "published" : "unpublished"} successfully!`);
    } catch (error) {
      console.error("Error updating event status:", error);
      toast.error("Failed to update event status");
    }
  };

  const openEditDialog = (event: Event) => {
    setEditingEvent(event);

    // Consolidate images and clear legacy field
    const consolidatedImages = consolidateImages(event.imageUrl, event.imageUrls || []);

    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      startDate: formatDateForInput(event.startDate),
      endDate: formatDateForInput(event.endDate),
      location: event.location,
      address: event.address || "",
      organizer: event.organizer || "",
      capacity: event.capacity,
      requiresRegistration: event.requiresRegistration,
      isRecurring: event.isRecurring,
      recurringPattern: event.recurringPattern,
      recurringDays: event.recurringDays || [],
      recurringEndDate: formatDateOnly(event.recurringEndDate || ""),
      contactEmail: event.contactEmail || "",
      contactPhone: event.contactPhone || "",
      tags: event.tags || [],
      price: event.price,
      registrationDeadline: formatDateForInput(event.registrationDeadline || ""),
      imageUrl: "",
      imageUrls: consolidatedImages,
    });
    setIsEditDialogOpen(true);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "worship": return "bg-blue-100 text-blue-800";
      case "fellowship": return "bg-green-100 text-green-800";
      case "youth": return "bg-purple-100 text-purple-800";
      case "workers": return "bg-orange-100 text-orange-800";
      case "prayers": return "bg-emerald-100 text-emerald-800";
      case "thanksgiving": return "bg-amber-100 text-amber-800";
      case "outreach": return "bg-red-100 text-red-800";
      case "ministry": return "bg-indigo-100 text-indigo-800";
      case "special_program": return "bg-pink-100 text-pink-800";
      case "community": return "bg-teal-100 text-teal-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-100 text-green-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderEventForm = () => (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Event title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as EventCategory }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="worship">Worship</SelectItem>
                <SelectItem value="fellowship">Fellowship</SelectItem>
                <SelectItem value="youth">Youth</SelectItem>
                <SelectItem value="workers">Workers</SelectItem>
                <SelectItem value="prayers">Prayers</SelectItem>
                <SelectItem value="thanksgiving">Thanksgiving</SelectItem>
                <SelectItem value="outreach">Outreach</SelectItem>
                <SelectItem value="ministry">Ministry</SelectItem>
                <SelectItem value="special_program">Special Event</SelectItem>
                <SelectItem value="community">Community</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => {
                const value = e.target.value;
                setFormData(prev => ({ ...prev, description: value }));
              }}
              placeholder="Event description"
              rows={4}
              className="resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date & Time *</Label>
            <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date & Time *</Label>
            <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Event location"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Full address (optional)"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizer">Event Organizer</Label>
          <Input
              id="organizer"
              value={formData.organizer}
              onChange={(e) => setFormData(prev => ({ ...prev, organizer: e.target.value }))}
              placeholder="Enter organizer name (leave empty to use your name)"
          />
          <p className="text-xs text-gray-500">
            If left empty, your name will be used as the organizer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
                id="capacity"
                type="number"
                value={formData.capacity || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value ? Number.parseInt(e.target.value) : undefined }))}
                placeholder="Maximum attendees"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value ? Number.parseFloat(e.target.value) : undefined }))}
                placeholder="Event price (optional)"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                placeholder="Contact email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                placeholder="Contact phone"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
              type="checkbox"
              id="requiresRegistration"
              checked={formData.requiresRegistration}
              onChange={(e) => setFormData(prev => ({ ...prev, requiresRegistration: e.target.checked }))}
              className="rounded"
          />
          <Label htmlFor="requiresRegistration">Requires Registration</Label>
        </div>

        {formData.requiresRegistration && (
            <div className="space-y-2">
              <Label htmlFor="registrationDeadline">Registration Deadline</Label>
              <Input
                  id="registrationDeadline"
                  type="datetime-local"
                  value={formData.registrationDeadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, registrationDeadline: e.target.value }))}
              />
            </div>
        )}

        <div className="flex items-center space-x-2">
          <input
              type="checkbox"
              id="isRecurring"
              checked={formData.isRecurring}
              onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
              className="rounded"
          />
          <Label htmlFor="isRecurring">Recurring Event</Label>
        </div>

        {formData.isRecurring && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recurringPattern">Recurring Pattern</Label>
                <Select value={formData.recurringPattern} onValueChange={(value) => setFormData(prev => ({ ...prev, recurringPattern: value as RecurringPattern }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Biweekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="recurringEndDate">Recurring End Date</Label>
                <Input
                    id="recurringEndDate"
                    type="date"
                    value={formData.recurringEndDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, recurringEndDate: e.target.value }))}
                />
              </div>
            </div>
        )}

        <div className="space-y-2">
          <Label>Event Images/Flyers</Label>
          <div className="space-y-4">
            {(formData.imageUrls && formData.imageUrls.length > 0) && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Current Images</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {formData.imageUrls.map((imageUrl, index) => (
                        <div key={`${imageUrl}-${index}`} className="relative group">
                          <div className="relative overflow-hidden rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-400 transition-colors">
                            <img
                                src={imageUrl?.trim() || '/images/event-default.jpg'}
                                alt={`Event preview ${index + 1}`}
                                className="w-full h-32 object-contain bg-gray-50 hover:object-cover transition-all duration-300"
                                style={{ objectPosition: 'center' }}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                              <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => setFormData(prev => ({
                                    ...prev,
                                    imageUrls: prev.imageUrls?.filter((_, i) => i !== index) || []
                                  }))}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
            )}

            <div
                className={`border-2 border-dashed rounded-xl p-6 transition-all duration-300 relative overflow-hidden ${
                    isDragging
                        ? 'border-blue-500 bg-blue-50 scale-105 shadow-xl'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
                } bg-gradient-to-br from-blue-50/20 to-purple-50/20`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
              {isDragging && (
                  <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="text-center text-blue-600">
                      <div className="w-20 h-20 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center animate-bounce">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-xl font-bold">Drop your images here!</p>
                      <p className="text-sm opacity-75">Images will be uploaded automatically</p>
                    </div>
                  </div>
              )}

              <div className="text-center space-y-4">
                <div className={`mx-auto w-16 h-16 bg-gradient-to-br from-church-primary via-church-primary-light to-church-accent rounded-full flex items-center justify-center transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Event Images</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Drag & drop images here</strong> or click to browse. Support JPG, PNG, and GIF formats.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="inline-flex items-center px-6 py-3 border-2 border-blue-500 text-blue-600 font-semibold rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {uploadingImage ? 'Uploading...' : 'Choose Images from Device'}
                  </button>
                  <Input
                      ref={fileInputRef}
                      id="imageFiles"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 0) {
                          await handleImageUpload(files);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }
                      }}
                      disabled={uploadingImage}
                      className="hidden"
                  />

                  {uploadingImage && (
                      <div className="flex items-center justify-center space-x-2 text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                        <span className="text-sm font-medium">Uploading images...</span>
                      </div>
                  )}

                  <div className="text-xs text-gray-500">
                    <span className="font-medium">💡 Pro tip:</span> You can drag multiple images at once • Max 10MB per image
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-3">
                  <div className="flex-1 border-t border-gray-300" />
                  <span className="text-sm text-gray-500 font-medium">OR</span>
                  <div className="flex-1 border-t border-gray-300" />
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                        id="imageUrl"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="Paste image URL here..."
                        className="flex-1"
                        disabled={uploadingImage}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (formData.imageUrl) {
                            setFormData(prev => ({
                              ...prev,
                              imageUrls: [...(prev.imageUrls || []), prev.imageUrl || ""],
                              imageUrl: ""
                            }));
                            toast.success("Image URL added successfully!");
                          }
                        }}
                        disabled={!formData.imageUrl || uploadingImage}
                        className="px-4 py-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
                    >
                      Add URL
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Paste a direct link to an image (e.g., from Google Drive, Unsplash, etc.)
                  </p>
                </div>
              </div>
            </div>
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
            <h1 className="text-3xl font-bold tracking-tight">Events Management</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage church events, schedules, and registrations
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value as EventCategory | "all" }))}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="worship">Worship</SelectItem>
                  <SelectItem value="fellowship">Fellowship</SelectItem>
                  <SelectItem value="youth">Youth</SelectItem>
                  <SelectItem value="workers">Workers</SelectItem>
                  <SelectItem value="prayers">Prayers</SelectItem>
                  <SelectItem value="thanksgiving">Thanksgiving</SelectItem>
                  <SelectItem value="outreach">Outreach</SelectItem>
                  <SelectItem value="ministry">Ministry</SelectItem>
                  <SelectItem value="special_program">Special Event</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as "all" | "published" | "draft" | "cancelled" }))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <Search className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                    placeholder="Search events..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-8 w-48"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex border rounded-lg overflow-hidden">
                <Button
                    variant={view === "calendar" ? "default" : "ghost"}
                    onClick={() => setView("calendar")}
                    size="sm"
                    className="rounded-none"
                >
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Calendar
                </Button>
                <Button
                    variant={view === "list" ? "default" : "ghost"}
                    onClick={() => setView("list")}
                    size="sm"
                    className="rounded-none"
                >
                  <List className="h-4 w-4 mr-1" />
                  List
                </Button>
              </div>

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
                  <DialogHeader className="flex-shrink-0 pb-4 border-b">
                    <DialogTitle className="text-2xl font-bold">Create New Event</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Fill in the details to create a new church event.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto py-4">
                    {renderEventForm()}
                  </div>
                  <DialogFooter className="flex-shrink-0 pt-4 border-t bg-gray-50/50">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateEvent} disabled={submitting} className="min-w-[120px]">
                      {submitting ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            <span>Creating...</span>
                          </div>
                      ) : (
                          "Create Event"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events.filter(e => e.status === "published").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events.filter(e => new Date(e.startDate) > new Date()).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events.reduce((sum, e) => sum + e.registeredCount, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        ) : (
            <div>
              {view === "calendar" ? (
                  <Calendar
                      events={filteredEvents}
                      showCreateButton={true}
                      onCreateEvent={() => setIsCreateDialogOpen(true)}
                      className="mb-8"
                  />
              ) : (
                  <div className="space-y-4">
                    {filteredEvents.map((event) => (
                        <Card key={event.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-start gap-3 mb-3">
                                  <div>
                                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge className={getCategoryColor(event.category)}>
                                        {event.category.split('_').map(word =>
                                            word.charAt(0).toUpperCase() + word.slice(1)
                                        ).join(' ')}
                                      </Badge>
                                      <Badge className={getStatusColor(event.status)}>
                                        {event.status}
                                      </Badge>
                                      {event.isRecurring && (
                                          <Badge variant="outline">Recurring</Badge>
                                      )}
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                                      {event.description}
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>
                                  {new Date(event.startDate).toLocaleDateString()} at {" "}
                                          {new Date(event.startDate).toLocaleTimeString("en-US", {
                                            hour: "numeric",
                                            minute: "2-digit",
                                            hour12: true,
                                          })}
                                </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>{event.location}</span>
                                      </div>
                                      {event.requiresRegistration && (
                                          <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            <span>
                                    {event.registeredCount}/{event.capacity || "∞"} registered
                                  </span>
                                          </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleToggleStatus(event.id, event.status)}
                                >
                                  {event.status === "published" ? (
                                      <><EyeOff className="h-4 w-4 mr-1" /> Unpublish</>
                                  ) : (
                                      <><Eye className="h-4 w-4 mr-1" /> Publish</>
                                  )}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEditDialog(event)}
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
                                      <AlertDialogTitle>Delete Event</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{event.title}"? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                          onClick={() => handleDeleteEvent(event.id)}
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

                    {filteredEvents.length === 0 && (
                        <Card>
                          <CardContent className="p-8 text-center">
                            <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-lg font-semibold mb-2">No events found</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                              {filters.search || filters.category !== "all" || filters.status !== "all"
                                  ? "Try adjusting your filters to see more events."
                                  : "Get started by creating your first event."}
                            </p>
                            <Button onClick={() => setIsCreateDialogOpen(true)}>
                              <Plus className="h-4 w-4 mr-2" />
                              Create Event
                            </Button>
                          </CardContent>
                        </Card>
                    )}
                  </div>
              )}
            </div>
        )}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0 pb-4 border-b">
              <DialogTitle className="text-2xl font-bold">Edit Event</DialogTitle>
              <DialogDescription className="text-gray-600">
                Update the event details below.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto py-4">
              {renderEventForm()}
            </div>
            <DialogFooter className="flex-shrink-0 pt-4 border-t bg-gray-50/50">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditEvent} disabled={submitting} className="min-w-[120px]">
                {submitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      <span>Updating...</span>
                    </div>
                ) : (
                    "Update Event"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
