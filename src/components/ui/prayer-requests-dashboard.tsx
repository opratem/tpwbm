"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PrayerRequest {
  id: string;
  title: string;
  message: string;
  requesterName: string;
  category: string;
  priority: string;
  isPublic: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface PrayerRequestsDashboardProps {
  limit?: number;
  className?: string;
}

export default function PrayerRequestsDashboard({
                                                  limit = 3,
                                                  className = "",
                                                }: PrayerRequestsDashboardProps) {
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrayerRequests = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("limit", limit.toString());
      params.append("isPublic", "true");
      params.append("status", "active");

      const response = await fetch(`/api/prayer-requests?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch prayer requests");
      }

      const data = await response.json();
      setPrayerRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load prayer requests");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchPrayerRequests();
  }, [fetchPrayerRequests]);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "??";
    return name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  if (loading) {
    return (
        <div className={`space-y-4 ${className}`}>
          {[...Array(limit)].map((_, i) => (
              <div key={i} className="flex items-start gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
          ))}
        </div>
    );
  }

  if (error) {
    return (
        <div className={`text-center py-4 ${className}`}>
          <p className="text-sm text-gray-500">Failed to load prayer requests</p>
          <Button
              variant="outline"
              size="sm"
              onClick={fetchPrayerRequests}
              className="mt-2"
          >
            Try again
          </Button>
        </div>
    );
  }

  if (prayerRequests.length === 0) {
    return (
        <div className={`text-center py-4 ${className}`}>
          <p className="text-sm text-gray-500">No prayer requests to display</p>
        </div>
    );
  }

  return (
      <div className={`space-y-4 ${className}`}>
        {prayerRequests.map((request) => (
            <div key={request.id} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-sm font-medium">
                {getInitials(request.requesterName)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
                  {request.title || request.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {request.requesterName} · {formatDate(request.createdAt)}
                </p>
              </div>
            </div>
        ))}
      </div>
  );
}
