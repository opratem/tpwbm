"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  Phone,
  Mail,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { EventsSkeleton } from "@/components/ui/loading-spinner";

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  address: string;
  organizer: string;
  organizerId: string;
  capacity: number;
  registeredCount: number;
  requiresRegistration: boolean;
  isRecurring: boolean;
  recurringPattern: string;
  recurringDays: string[];
  status: string;
  imageUrl: string;
  imageUrls?: string[]; // Add support for multiple images
  contactEmail: string;
  contactPhone: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface EventsProps {
  limit?: number;
  category?: string;
  upcoming?: boolean;
  showHeader?: boolean;
  variant?: "card" | "list" | "compact";
  className?: string;
}

export default function Events({
                                 limit = 10,
                                 category = "all",
                                 upcoming = true,
                                 showHeader = true,
                                 variant = "card",
                                 className = "",
                               }: EventsProps) {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<{ [key: string]: any }>({});
  const [registeringEvents, setRegisteringEvents] = useState<Set<string>>(new Set());

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (category !== "all") params.append("category", category);
      if (limit) params.append("limit", limit.toString());
      if (upcoming) params.append("upcoming", "true");
      params.append("status", "published");

      const response = await fetch(`/api/events?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      setEvents(data);

      // Fetch registration status for each event if user is logged in
      if (session) {
        const statusPromises = data.map(async (event: Event) => {
          if (event.requiresRegistration) {
            try {
              const regResponse = await fetch(`/api/events/${event.id}/register`);
              const regData = await regResponse.json();
              return { [event.id]: regData };
            } catch {
              return { [event.id]: { isRegistered: false } };
            }
          }
          return { [event.id]: { isRegistered: false } };
        });

        const statusResults = await Promise.all(statusPromises);
        const statusObj = statusResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setRegistrationStatus(statusObj);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [category, limit, upcoming, session]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleRegistration = async (eventId: string, action: "register" | "cancel") => {
    if (!session) {
      toast.error("Please log in to register for events");
      return;
    }

    setRegisteringEvents(prev => new Set([...prev, eventId]));

    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: action === "register" ? "POST" : "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${action} for event`);
      }

      const result = await response.json();
      toast.success(result.message);

      // Refresh registration status
      const regResponse = await fetch(`/api/events/${eventId}/register`);
      const regData = await regResponse.json();
      setRegistrationStatus(prev => ({
        ...prev,
        [eventId]: regData,
      }));

      // Refresh events to update counts
      fetchEvents();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Failed to ${action} for event`);
    } finally {
      setRegisteringEvents(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "worship":
        return Calendar;
      case "fellowship":
        return Users;
      case "youth":
        return User;
      case "workers":
        return User;
      case "prayers":
        return Calendar;
      case "thanksgiving":
        return Calendar;
      case "outreach":
        return ExternalLink;
      case "ministry":
        return Calendar;
      case "special_program":
        return Calendar;
      case "community":
        return Calendar;
      default:
        return Calendar;
    }
  };

  const formatCategoryDisplay = (category: string) => {
    return category
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "worship":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "fellowship":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "youth":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "workers":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "prayers":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
      case "thanksgiving":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      case "outreach":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "ministry":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
      case "special_program":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
      case "community":
        return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getEventImage = (event: Event) => {
    // Use multiple images if available, fallback to single image
    if (event.imageUrls && event.imageUrls.length > 0 && event.imageUrls[0] && event.imageUrls[0].trim() !== "") {
      return event.imageUrls[0]; // Use first image for main display
    }
    if (event.imageUrl && event.imageUrl.trim() !== "") {
      return event.imageUrl;
    }
    // Return a default church event image as fallback
    return "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start.toDateString() === end.toDateString()) {
      return `${formatDate(startDate)} • ${formatTime(startDate)} - ${formatTime(endDate)}`;
    } else {
      return `${formatDate(startDate)} ${formatTime(startDate)} - ${formatDate(endDate)} ${formatTime(endDate)}`;
    }
  };

  const isEventPast = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  if (loading) {
    return <EventsSkeleton />;
  }

  if (error) {
    return (
        <div className={`mobile-space-y-4 ${className}`}>
          {showHeader && (
              <div className="flex items-center gap-2 sm:gap-3">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                <h2 className="mobile-text-lg md:text-xl font-semibold">Events</h2>
              </div>
          )}
          <Card>
            <CardContent className="mobile-card-spacing text-center text-gray-500">
              <p className="mobile-text-sm">Unable to load events. Please try again later.</p>
              <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchEvents}
                  className="mt-3 sm:mt-4 mobile-touch-target"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
    );
  }

  if (events.length === 0) {
    return (
        <div className={`mobile-space-y-4 ${className}`}>
          {showHeader && (
              <div className="flex items-center gap-2 sm:gap-3">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                <h2 className="mobile-text-lg md:text-xl font-semibold">Events</h2>
              </div>
          )}
          <Card>
            <CardContent className="mobile-card-spacing text-center text-gray-500">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 opacity-50" />
              <p className="mobile-text-sm">No events available at this time.</p>
            </CardContent>
          </Card>
        </div>
    );
  }

  if (variant === "compact") {
    return (
        <div className={`mobile-space-y-4 ${className}`}>
          {showHeader && (
              <div className="flex items-center gap-2 sm:gap-3">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                <h2 className="mobile-text-lg md:text-xl font-semibold">Upcoming Events</h2>
              </div>
          )}
          <div className="space-y-2 sm:space-y-3">
            {events.map((event) => {
              const CategoryIcon = getCategoryIcon(event.category);
              const isPast = isEventPast(event.endDate);

              return (
                  <div
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      className={`flex items-start gap-2 sm:gap-3 p-3 sm:p-4 border rounded-lg sm:rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer min-h-[72px] sm:min-h-[80px] ${
                          isPast ? "opacity-60" : ""
                      }`}
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CategoryIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs sm:text-sm md:text-base line-clamp-1">{event.title}</p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                        {formatDate(event.startDate)} • {formatTime(event.startDate)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">
                        {event.location}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 sm:gap-1.5 flex-shrink-0">
                      <Badge className={`${getCategoryColor(event.category)} text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1`}>
                        {formatCategoryDisplay(event.category)}
                      </Badge>
                      {event.requiresRegistration && (
                          <div className="text-[10px] sm:text-xs text-gray-500">
                            {event.registeredCount}/{event.capacity || "∞"}
                          </div>
                      )}
                    </div>
                  </div>
              );
            })}
          </div>
        </div>
    );
  }

  return (
      <div className={`mobile-space-y-4 ${className}`}>
        {showHeader && (
            <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                <h2 className="mobile-text-lg md:text-xl font-semibold">Events</h2>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600 mobile-text-xs md:text-sm mobile-touch-target">
                View All <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
              </Button>
            </div>
        )}

        <div className="grid gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {events.map((event) => {
            const CategoryIcon = getCategoryIcon(event.category);
            const isPast = isEventPast(event.endDate);
            const regStatus = registrationStatus[event.id];
            const isRegistering = registeringEvents.has(event.id);

            return (
                <Card
                    key={event.id}
                    className={`hover:shadow-lg transition-shadow cursor-pointer overflow-hidden mobile-card ${
                        isPast ? "opacity-60" : ""
                    }`}
                    onClick={() => handleEventClick(event)}
                >
                  {/* Event Image */}
                  {getEventImage(event) && (
                      <div className="h-32 sm:h-40 md:h-48 lg:h-56 w-full overflow-hidden relative">
                        <img
                            src={getEventImage(event)}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 right-2 sm:right-3 md:right-4">
                          <Badge className={`${getCategoryColor(event.category)} text-[10px] sm:text-xs px-2 sm:px-3 py-1`}>
                            {formatCategoryDisplay(event.category)}
                          </Badge>
                        </div>
                      </div>
                  )}

                  <CardHeader className="pb-2 sm:pb-3">
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        {!getEventImage(event) && (
                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <CategoryIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600" />
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <CardTitle className="mobile-text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight tracking-tight line-clamp-2">
                            {event.title}
                          </CardTitle>
                          <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-2 flex-wrap">
                            {!getEventImage(event) && (
                                <Badge className={`${getCategoryColor(event.category)} text-[10px] sm:text-xs`}>
                                  {formatCategoryDisplay(event.category)}
                                </Badge>
                            )}
                            {event.isRecurring && (
                                <Badge variant="outline" className="text-[10px] sm:text-xs">Recurring</Badge>
                            )}
                            {isPast && (
                                <Badge variant="secondary" className="text-[10px] sm:text-xs">Past Event</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      {event.requiresRegistration && regStatus && (
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {regStatus.isRegistered ? (
                                <Badge className="bg-green-100 text-green-800 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1">
                                  <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                                  Registered
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1">
                                  <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                                  {event.registeredCount}/{event.capacity || "∞"}
                                </Badge>
                            )}
                          </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4 line-clamp-2 font-normal mobile-text-sm md:text-base">
                      {event.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
                        <span className="font-semibold line-clamp-1">{formatDateRange(event.startDate, event.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                        <span className="font-semibold line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600 flex-shrink-0" />
                        <span className="font-semibold line-clamp-1">Organized by {event.organizer}</span>
                      </div>
                      {event.requiresRegistration && (
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="font-medium line-clamp-1">
                        {event.registeredCount} registered
                              {event.capacity > 0 && ` of ${event.capacity}`}
                      </span>
                          </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
            );
          })}
        </div>

        {/* Event Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedEvent && (
                <div>
                  <DialogHeader>
                    <DialogTitle className="mobile-text-lg md:text-xl lg:text-2xl">{selectedEvent.title}</DialogTitle>
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-2 flex-wrap">
                      <Badge className={`${getCategoryColor(selectedEvent.category)} text-[10px] sm:text-xs`}>
                        {formatCategoryDisplay(selectedEvent.category)}
                      </Badge>
                      {selectedEvent.isRecurring && (
                          <Badge variant="outline" className="text-[10px] sm:text-xs">
                            {selectedEvent.recurringPattern} • {selectedEvent.recurringDays.join(", ")}
                          </Badge>
                      )}
                      {isEventPast(selectedEvent.endDate) && (
                          <Badge variant="secondary" className="text-[10px] sm:text-xs">Past Event</Badge>
                      )}
                    </div>
                  </DialogHeader>

                  <div className="mobile-space-y-4">
                    <DialogDescription className="mobile-text-sm md:text-base leading-relaxed">
                      {selectedEvent.description}
                    </DialogDescription>

                    {/* Event Images */}
                    {((selectedEvent.imageUrls && selectedEvent.imageUrls.length > 0) || selectedEvent.imageUrl) && (
                        <div className="mobile-space-y-2">
                          <p className="font-medium mobile-text-sm md:text-base">Event Images</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            {/* Show multiple images if available */}
                            {selectedEvent.imageUrls && selectedEvent.imageUrls.length > 0 ? (
                                selectedEvent.imageUrls.filter(url => url && url.trim() !== "").map((imageUrl, index) => (
                                    <div key={index} className="relative">
                                      <img
                                          src={imageUrl}
                                          alt={`${selectedEvent.title} - Image ${index + 1}`}
                                          className="w-full max-h-36 sm:max-h-48 md:max-h-56 object-contain rounded-lg sm:rounded-xl border bg-gray-50"
                                          onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                          }}
                                      />
                                    </div>
                                ))
                            ) : (
                                /* Fallback to single image */
                                selectedEvent.imageUrl && selectedEvent.imageUrl.trim() !== "" && (
                                    <div className="relative">
                                      <img
                                          src={selectedEvent.imageUrl}
                                          alt={selectedEvent.title}
                                          className="w-full max-h-36 sm:max-h-48 md:max-h-56 object-contain rounded-lg sm:rounded-xl border bg-gray-50"
                                          onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                          }}
                                      />
                                    </div>
                                )
                            )}
                          </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                      <div className="mobile-space-y-2 md:space-y-3">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium mobile-text-xs md:text-sm">Date & Time</p>
                            <p className="text-xs sm:text-sm text-gray-600">
                              {formatDateRange(selectedEvent.startDate, selectedEvent.endDate)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 sm:gap-3">
                          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium mobile-text-xs md:text-sm">Location</p>
                            <p className="text-xs sm:text-sm text-gray-600">{selectedEvent.location}</p>
                            {selectedEvent.address && (
                                <p className="text-xs sm:text-sm text-gray-500">{selectedEvent.address}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-start gap-2 sm:gap-3">
                          <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium mobile-text-xs md:text-sm">Organizer</p>
                            <p className="text-xs sm:text-sm text-gray-600">{selectedEvent.organizer}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mobile-space-y-2 md:space-y-3">
                        {selectedEvent.requiresRegistration && (
                            <div className="flex items-start gap-2 sm:gap-3">
                              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium mobile-text-xs md:text-sm">Registration</p>
                                <p className="text-xs sm:text-sm text-gray-600">
                                  {selectedEvent.registeredCount} registered
                                  {selectedEvent.capacity > 0 && ` of ${selectedEvent.capacity}`}
                                </p>
                                {selectedEvent.capacity > 0 && selectedEvent.registeredCount >= selectedEvent.capacity && (
                                    <p className="text-xs sm:text-sm text-red-600">Event is full</p>
                                )}
                              </div>
                            </div>
                        )}

                        {selectedEvent.contactEmail && (
                            <div className="flex items-start gap-2 sm:gap-3">
                              <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium mobile-text-xs md:text-sm">Contact</p>
                                <p className="text-xs sm:text-sm text-gray-600 break-all">{selectedEvent.contactEmail}</p>
                                {selectedEvent.contactPhone && (
                                    <p className="text-xs sm:text-sm text-gray-600">{selectedEvent.contactPhone}</p>
                                )}
                              </div>
                            </div>
                        )}

                        {selectedEvent.tags.length > 0 && (
                            <div>
                              <p className="font-medium mb-1.5 sm:mb-2 mobile-text-xs md:text-sm">Tags</p>
                              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                                {selectedEvent.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                                      {tag}
                                    </Badge>
                                ))}
                              </div>
                            </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-5">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto mobile-touch-target">
                      Close
                    </Button>

                    {selectedEvent.requiresRegistration &&
                        !isEventPast(selectedEvent.endDate) &&
                        session && (
                            <>
                              {registrationStatus[selectedEvent.id]?.isRegistered ? (
                                  <Button
                                      variant="destructive"
                                      onClick={() => handleRegistration(selectedEvent.id, "cancel")}
                                      disabled={registeringEvents.has(selectedEvent.id)}
                                      className="w-full sm:w-auto mobile-touch-target"
                                  >
                                    {registeringEvents.has(selectedEvent.id) ? "Cancelling..." : "Cancel Registration"}
                                  </Button>
                              ) : (
                                  <Button
                                      onClick={() => handleRegistration(selectedEvent.id, "register")}
                                      disabled={
                                          registeringEvents.has(selectedEvent.id) ||
                                          (selectedEvent.capacity > 0 &&
                                              selectedEvent.registeredCount >= selectedEvent.capacity)
                                      }
                                      className="w-full sm:w-auto mobile-touch-target"
                                  >
                                    {registeringEvents.has(selectedEvent.id) ? "Registering..." : "Register for Event"}
                                  </Button>
                              )}
                            </>
                        )}

                    {selectedEvent.requiresRegistration && !session && (
                        <Button asChild className="w-full sm:w-auto mobile-touch-target">
                          <a href="/members/login">Log in to Register</a>
                        </Button>
                    )}
                  </DialogFooter>
                </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
  );
}
