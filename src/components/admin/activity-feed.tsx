"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import {
  User,
  FileText,
  Calendar,
  Heart,
  Megaphone,
  Check,
  X,
  Edit,
  Trash2,
  Plus,
  type LucideIcon,
} from "lucide-react";

export interface Activity {
  id: string;
  type: "user" | "blog" | "event" | "prayer" | "announcement" | "other";
  action: "created" | "updated" | "deleted" | "approved" | "rejected";
  user: {
    name: string;
    avatar?: string;
    role?: string;
  };
  title: string;
  description?: string;
  timestamp: Date | string;
  metadata?: Record<string, unknown>;
}

interface ActivityFeedProps {
  activities: Activity[];
  title?: string;
  maxItems?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
  emptyMessage?: string;
  loading?: boolean;
}

const typeIcons: Record<string, LucideIcon> = {
  user: User,
  blog: FileText,
  event: Calendar,
  prayer: Heart,
  announcement: Megaphone,
  other: FileText,
};

const actionColors: Record<string, string> = {
  created: "bg-green-100 text-green-700",
  updated: "bg-blue-100 text-blue-700",
  deleted: "bg-red-100 text-red-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const actionIcons: Record<string, LucideIcon> = {
  created: Plus,
  updated: Edit,
  deleted: Trash2,
  approved: Check,
  rejected: X,
};

export function ActivityFeed({
  activities,
  title = "Recent Activity",
  maxItems = 10,
  showViewAll = false,
  onViewAll,
  emptyMessage = "No recent activity",
  loading = false,
}: ActivityFeedProps) {
  const displayedActivities = activities.slice(0, maxItems);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTimestamp = (timestamp: Date | string) => {
    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <Card className="border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-[hsl(218,31%,18%)]">{title}</CardTitle>
        {showViewAll && onViewAll && activities.length > maxItems && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            className="text-[hsl(45,56%,55%)] hover:text-[hsl(45,56%,45%)] hover:bg-amber-50"
          >
            View All ({activities.length})
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="h-10 w-10 bg-slate-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedActivities.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedActivities.map((activity) => {
              const TypeIcon = typeIcons[activity.type] || FileText;
              const ActionIcon = actionIcons[activity.action] || Edit;
              const actionColor = actionColors[activity.action] || "bg-slate-100 text-slate-700";

              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                >
                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                    {activity.user.avatar ? (
                      <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                    ) : (
                      <AvatarFallback className="bg-[hsl(218,31%,18%)] text-white text-xs">
                        {getInitials(activity.user.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-[hsl(218,31%,18%)] text-sm">
                          {activity.user.name}
                        </span>
                        {activity.user.role && (
                          <Badge variant="secondary" className="text-xs px-1.5 py-0">
                            {activity.user.role}
                          </Badge>
                        )}
                        <Badge className={`${actionColor} text-xs px-1.5 py-0 gap-1`}>
                          <ActionIcon className="h-3 w-3" />
                          {activity.action}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <TypeIcon className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 font-medium truncate">
                          {activity.title}
                        </p>
                        {activity.description && (
                          <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                            {activity.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-400">
                      {formatTimestamp(activity.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
