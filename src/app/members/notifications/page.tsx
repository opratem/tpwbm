"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { MembersLayout } from "@/components/members/members-layout";
import { useRealTimeNotifications } from "@/hooks/useRealTimeNotifications";
import { NotificationSettings } from "@/components/ui/notification-settings";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  Clock,
  Calendar,
  MessageSquare,
  Megaphone,
  Settings,
  AlertTriangle,
  Wifi,
  WifiOff,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Notification, NotificationPriority } from "@/lib/notification";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const {
    notifications,
    unreadCount,
    isConnected,
    lastActivity,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    reconnect,
  } = useRealTimeNotifications();

  const [filter, setFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/members/login");
    }
  }, [status]);

  if (status === "loading") {
    return (
      <MembersLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      </MembersLayout>
    );
  }

  if (!session) {
    return null;
  }

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    // Filter by read status
    if (filter === "unread" && notification.read) return false;
    if (filter === "read" && !notification.read) return false;

    // Filter by type
    if (typeFilter !== "all" && notification.type !== typeFilter) return false;

    return true;
  });

  // Group notifications by date
  const groupNotificationsByDate = (notifications: Notification[]) => {
    const groups: { [key: string]: Notification[] } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    for (const notification of notifications) {
      const notificationDate = new Date(notification.createdAt);
      notificationDate.setHours(0, 0, 0, 0);

      let groupKey: string;
      if (notificationDate.getTime() === today.getTime()) {
        groupKey = "Today";
      } else if (notificationDate.getTime() === yesterday.getTime()) {
        groupKey = "Yesterday";
      } else {
        groupKey = notificationDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        });
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(notification);
    }

    return groups;
  };

  const groupedNotifications = groupNotificationsByDate(filteredNotifications);

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "low":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "prayer_request":
        return <MessageSquare className="h-5 w-5" />;
      case "announcement":
        return <Megaphone className="h-5 w-5" />;
      case "event":
        return <Calendar className="h-5 w-5" />;
      case "admin":
        return <Settings className="h-5 w-5" />;
      case "system":
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "prayer_request":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400";
      case "announcement":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
      case "event":
        return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400";
      case "admin":
        return "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400";
      case "system":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <MembersLayout>
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Bell className="h-8 w-8 text-church-accent" />
              Notifications
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Stay updated with church activities and announcements
            </p>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm",
                isConnected
                  ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
              )}
            >
              {isConnected ? (
                <>
                  <Wifi className="h-4 w-4" />
                  <span>Live</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4" />
                  <span>Offline</span>
                </>
              )}
            </div>
            {!isConnected && (
              <Button variant="outline" size="sm" onClick={reconnect}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reconnect
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            {/* Filters and Actions */}
            <Card>
              <CardContent className="py-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex gap-3 flex-wrap">
                    <Select value={filter} onValueChange={setFilter}>
                      <SelectTrigger className="w-[140px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="unread">Unread</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="announcement">Announcements</SelectItem>
                        <SelectItem value="event">Events</SelectItem>
                        <SelectItem value="prayer_request">Prayer Requests</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    {unreadCount > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={markAllAsRead}
                      >
                        <CheckCheck className="h-4 w-4 mr-2" />
                        Mark all read
                      </Button>
                    )}
                    {notifications.length > 0 && (
                      <Button variant="outline" size="sm" onClick={clearAll}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear all
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {notifications.length}
                      </p>
                      <p className="text-xs text-gray-500">Total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                      <BellOff className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{unreadCount}</p>
                      <p className="text-xs text-gray-500">Unread</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {notifications.filter((n) => n.read).length}
                      </p>
                      <p className="text-xs text-gray-500">Read</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {
                          notifications.filter(
                            (n) =>
                              n.priority === "urgent" || n.priority === "high"
                          ).length
                        }
                      </p>
                      <p className="text-xs text-gray-500">Important</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notifications List */}
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <Bell className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No notifications
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {filter !== "all" || typeFilter !== "all"
                      ? "No notifications match your filters"
                      : "You're all caught up! Check back later for updates."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedNotifications).map(
                  ([date, dateNotifications]) => (
                    <div key={date}>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {date}
                      </h3>
                      <div className="space-y-3">
                        {dateNotifications.map((notification) => (
                          <Card
                            key={notification.id}
                            className={cn(
                              "cursor-pointer transition-all hover:shadow-md",
                              !notification.read &&
                                "border-l-4 border-l-church-accent bg-church-accent/5"
                            )}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <CardContent className="py-4">
                              <div className="flex items-start gap-4">
                                {/* Type Icon */}
                                <div
                                  className={cn(
                                    "p-2 rounded-lg flex-shrink-0",
                                    getTypeColor(notification.type)
                                  )}
                                >
                                  {getTypeIcon(notification.type)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <h4
                                          className={cn(
                                            "font-medium",
                                            !notification.read
                                              ? "text-gray-900 dark:text-white"
                                              : "text-gray-700 dark:text-gray-300"
                                          )}
                                        >
                                          {notification.title}
                                        </h4>
                                        {!notification.read && (
                                          <div className="w-2 h-2 bg-church-accent rounded-full" />
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                        {notification.message}
                                      </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      <Badge
                                        className={getPriorityColor(
                                          notification.priority
                                        )}
                                      >
                                        {notification.priority}
                                      </Badge>
                                    </div>
                                  </div>

                                  {/* Footer */}
                                  <div className="flex items-center justify-between mt-3">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {formatDistanceToNow(
                                        new Date(notification.createdAt),
                                        { addSuffix: true }
                                      )}
                                    </span>

                                    <div className="flex items-center gap-2">
                                      {notification.actionUrl && (
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-7 text-xs"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            window.location.href =
                                              notification.actionUrl!;
                                          }}
                                        >
                                          <ExternalLink className="h-3 w-3 mr-1" />
                                          View
                                        </Button>
                                      )}
                                      {!notification.read && (
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-7 text-xs"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            markAsRead(notification.id);
                                          }}
                                        >
                                          <Check className="h-3 w-3 mr-1" />
                                          Mark read
                                        </Button>
                                      )}
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 text-xs text-red-500 hover:text-red-700"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeNotification(notification.id);
                                        }}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <NotificationSettings />
          </TabsContent>
        </Tabs>
      </div>
    </MembersLayout>
  );
}
