"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRealTimeNotifications } from "@/hooks/useRealTimeNotifications";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Clock,
  Calendar,
  MessageSquare,
  Megaphone,
  AlertTriangle,
  Wifi,
  WifiOff,
  RefreshCw,
  ExternalLink,
  Shield,
  Settings,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Notification, NotificationPriority } from "@/lib/notification";
import { cn } from "@/lib/utils";

interface LiveNotificationsProps {
  className?: string;
  showConnectionStatus?: boolean;
  maxNotifications?: number;
}

export function LiveNotifications({
  className,
  showConnectionStatus = false,
  maxNotifications = 5,
}: LiveNotificationsProps) {
  const { data: session } = useSession();
  const {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    reconnect,
  } = useRealTimeNotifications();

  const [isOpen, setIsOpen] = useState(false);

  const isAdmin = session?.user?.role === "admin" || session?.user?.role === "super_admin";
  const notificationsPageUrl = isAdmin ? "/admin/notifications" : "/members/notifications";

  const displayedNotifications = notifications.slice(0, maxNotifications);

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
        return <MessageSquare className="h-4 w-4" />;
      case "announcement":
        return <Megaphone className="h-4 w-4" />;
      case "event":
        return <Calendar className="h-4 w-4" />;
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "system":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
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
        return "bg-slate-100 text-slate-600 dark:bg-slate-900/20 dark:text-slate-400";
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
    setIsOpen(false);
  };

  if (!session) {
    return null;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("relative", className)}
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[calc(100vw-2rem)] sm:w-96 max-w-96 p-0" align="end" sideOffset={8}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {showConnectionStatus && (
              <div
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-full text-xs",
                  isConnected
                    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                )}
              >
                {isConnected ? (
                  <>
                    <Wifi className="h-3 w-3" />
                    <span>Live</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3" />
                    <span>Offline</span>
                  </>
                )}
              </div>
            )}
            {!isConnected && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={reconnect}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="max-h-[400px]">
          {displayedNotifications.length === 0 ? (
            <div className="py-12 text-center">
              <BellOff className="h-10 w-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No notifications yet
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                You're all caught up!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {displayedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800",
                    !notification.read && "bg-blue-50/50 dark:bg-blue-900/10"
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg flex-shrink-0",
                        getTypeColor(notification.type)
                      )}
                    >
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p
                              className={cn(
                                "text-sm font-medium truncate",
                                !notification.read
                                  ? "text-gray-900 dark:text-white"
                                  : "text-gray-700 dark:text-gray-300"
                              )}
                            >
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                        {/* Only show priority badge for urgent/high priority */}
                        {(notification.priority === 'urgent' || notification.priority === 'high') && (
                          <Badge
                            className={cn("text-[10px] px-1 py-0 h-4 leading-4", getPriorityColor(notification.priority))}
                          >
                            {notification.priority}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-between p-3 border-t bg-gray-50 dark:bg-gray-800/50">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={() => {
                markAllAsRead();
              }}
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
          <Link href={notificationsPageUrl} className="ml-auto">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={() => setIsOpen(false)}
            >
              View all
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default LiveNotifications;
