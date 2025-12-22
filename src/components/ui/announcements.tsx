"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnnouncementsSkeleton } from "@/components/ui/loading-spinner";
import {
  Bell,
  Calendar,
  Settings,
  Users,
  ChevronRight,
  Clock,
  User,
} from "lucide-react";

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

interface AnnouncementsProps {
  limit?: number;
  category?: string;
  showHeader?: boolean;
  variant?: "card" | "list" | "compact";
  className?: string;
}

export default function Announcements({
                                        limit = 5,
                                        category = "all",
                                        showHeader = true,
                                        variant = "card",
                                        className = "",
                                      }: AnnouncementsProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (category !== "all") params.append("category", category);
      if (limit) params.append("limit", limit.toString());
      params.append("status", "published");

      const response = await fetch(`/api/announcements?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch announcements");
      }

      const data = await response.json();
      setAnnouncements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load announcements");
    } finally {
      setLoading(false);
    }
  }, [category, limit]);

  useEffect(() => {
    fetchAnnouncements();
  }, [category, limit, fetchAnnouncements]);

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
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return <AnnouncementsSkeleton />;
  }

  if (error) {
    return (
        <div className={`mobile-space-y-4 ${className}`}>
          {showHeader && (
              <div className="flex items-center gap-2 sm:gap-3">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <h2 className="mobile-text-lg md:text-xl font-semibold">Announcements</h2>
              </div>
          )}
          <Card>
            <CardContent className="mobile-card-spacing text-center text-gray-500">
              <p className="mobile-text-sm">Unable to load announcements. Please try again later.</p>
              <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchAnnouncements}
                  className="mt-3 sm:mt-4 mobile-touch-target"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
    );
  }

  if (announcements.length === 0) {
    return (
        <div className={`mobile-space-y-4 ${className}`}>
          {showHeader && (
              <div className="flex items-center gap-2 sm:gap-3">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <h2 className="mobile-text-lg md:text-xl font-semibold">Announcements</h2>
              </div>
          )}
          <Card>
            <CardContent className="mobile-card-spacing text-center text-gray-500">
              <Bell className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 opacity-50" />
              <p className="mobile-text-sm">No announcements available at this time.</p>
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
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <h2 className="mobile-text-lg md:text-xl font-semibold">Announcements</h2>
              </div>
          )}
          <div className="space-y-2 sm:space-y-3">
            {announcements.map((announcement) => {
              const CategoryIcon = getCategoryIcon(announcement.category);
              return (
                  <div
                      key={announcement.id}
                      className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 border rounded-lg sm:rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors min-h-[64px] sm:min-h-[72px]"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CategoryIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs sm:text-sm md:text-base line-clamp-1">{announcement.title}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                        {formatRelativeTime(announcement.createdAt)}
                      </p>
                    </div>
                    {announcement.priority === "high" && (
                        <Badge className={`${getPriorityColor(announcement.priority)} text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 flex-shrink-0`}>
                          {announcement.priority}
                        </Badge>
                    )}
                  </div>
              );
            })}
          </div>
        </div>
    );
  }

  if (variant === "list") {
    return (
        <div className={`mobile-space-y-4 ${className}`}>
          {showHeader && (
              <div className="flex items-center gap-2 sm:gap-3">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <h2 className="mobile-text-lg md:text-xl font-semibold">Announcements</h2>
              </div>
          )}
          <div className="mobile-space-y-2 md:space-y-3">
            {announcements.map((announcement) => {
              const CategoryIcon = getCategoryIcon(announcement.category);
              return (
                  <div
                      key={announcement.id}
                      className="border rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CategoryIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold mobile-text-base md:text-lg mb-1 sm:mb-2 line-clamp-2">{announcement.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mobile-text-sm md:text-base line-clamp-3">
                            {announcement.content}
                          </p>
                          <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500 flex-wrap">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                              <span className="truncate max-w-[120px] sm:max-w-none">{announcement.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                              <span>{formatRelativeTime(announcement.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 sm:gap-2 flex-shrink-0">
                        {announcement.priority === "high" && (
                            <Badge className={`${getPriorityColor(announcement.priority)} text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1`}>
                              {announcement.priority}
                            </Badge>
                        )}
                        <Badge className={`${getCategoryColor(announcement.category)} text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1`}>
                          {announcement.category}
                        </Badge>
                      </div>
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
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <h2 className="mobile-text-lg md:text-xl font-semibold">Announcements</h2>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600 mobile-text-xs md:text-sm mobile-touch-target">
                View All <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
              </Button>
            </div>
        )}
        <div className="grid gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {announcements.map((announcement) => {
            const CategoryIcon = getCategoryIcon(announcement.category);
            return (
                <Card key={announcement.id} className="hover:shadow-lg transition-shadow mobile-card overflow-hidden">
                  <CardHeader className="pb-2 sm:pb-3">
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CategoryIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="mobile-text-base md:text-lg line-clamp-2">{announcement.title}</CardTitle>
                          <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-2 flex-wrap">
                            <Badge className={`${getCategoryColor(announcement.category)} text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1`}>
                              {announcement.category}
                            </Badge>
                            {announcement.priority === "high" && (
                                <Badge className={`${getPriorityColor(announcement.priority)} text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1`}>
                                  {announcement.priority}
                                </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4 mobile-text-sm md:text-base line-clamp-3">
                      {announcement.content}
                    </p>
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 flex-wrap gap-2">
                      <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                          <span className="truncate max-w-[120px] sm:max-w-[200px]">{announcement.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                          <span>{formatRelativeTime(announcement.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            );
          })}
        </div>
      </div>
  );
}
