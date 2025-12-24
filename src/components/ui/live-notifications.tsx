"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Bell, X, Check, CheckCheck, Wifi, WifiOff, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useRealTimeNotifications } from '@/hooks/useRealTimeNotifications';
import type { Notification, NotificationPriority } from '@/lib/notification';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
  onClick?: (notification: Notification) => void;
}

function NotificationItem({ notification, onMarkAsRead, onRemove, onClick }: NotificationItemProps) {
  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'low': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'new_prayer_request': return '🙏';
      case 'new_user_registration': return '👥';
      case 'new_announcement': return '📢';
      case 'new_event': return '📅';
      case 'event_update': return '📅';
      case 'user_status_change': return '👤';
      case 'system_alert': return '⚠️';
      default: return '🔔';
    }
  };

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    if (onClick) {
      onClick(notification);
    }
  };

  const handleAction = (actionUrl: string) => {
    onMarkAsRead(notification.id);
    window.location.href = actionUrl;
  };

  return (
      <div
          className={`p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
              !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
          }`}
          onClick={handleClick}
      >
        <div className="flex items-start gap-3">
          <div className="text-lg flex-shrink-0">
            {getTypeIcon(notification.type)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`text-sm font-medium truncate ${
                      !notification.read ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {notification.title}
                  </h4>
                  {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                  )}
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                  {notification.message}
                </p>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getPriorityColor(notification.priority)}>
                    {notification.priority}
                  </Badge>

                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </span>
                </div>

                {/* Action Buttons */}
                {notification.metadata && 'adminAction' in notification.metadata && notification.metadata.adminAction && (
                    <div className="mt-2">
                      <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Action would go here
                          }}
                      >
                        Action
                      </Button>
                    </div>
                )}
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                {!notification.read && (
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsRead(notification.id);
                        }}
                        title="Mark as read"
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                )}

                <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(notification.id);
                    }}
                    title="Remove notification"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

interface LiveNotificationsProps {
  className?: string;
  showConnectionStatus?: boolean;
}

export function LiveNotifications({ className = '', showConnectionStatus = true }: LiveNotificationsProps) {
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
    reconnect
  } = useRealTimeNotifications();

  const [isOpen, setIsOpen] = useState(false);

  // Don't render if not authenticated
  if (status === 'loading') {
    return null;
  }

  if (status === 'unauthenticated' || !session?.user) {
    return null;
  }

  const handleNotificationClick = (notification: Notification) => {
    // Auto-navigation is handled in the NotificationItem component
    setIsOpen(false);
  };

  const getConnectionStatusColor = () => {
    if (!isConnected) return 'text-red-500';
    if (lastActivity && Date.now() - lastActivity.getTime() > 60000) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getConnectionStatusText = () => {
    if (!isConnected) return 'Disconnected';
    if (lastActivity && Date.now() - lastActivity.getTime() > 60000) return 'Slow connection';
    return 'Connected';
  };

  return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={`relative ${className}`}>
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
                <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
            align="end"
            className="w-80 max-h-96 overflow-hidden p-0"
            sideOffset={8}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Notifications</h3>
              <div className="flex items-center gap-2">
                {showConnectionStatus && (
                    <div className="flex items-center gap-1">
                      {isConnected ? (
                          <Wifi className={`h-3 w-3 ${getConnectionStatusColor()}`} />
                      ) : (
                          <WifiOff className={`h-3 w-3 ${getConnectionStatusColor()}`} />
                      )}
                      <span className={`text-xs ${getConnectionStatusColor()}`}>
                    {getConnectionStatusText()}
                  </span>
                    </div>
                )}

                {unreadCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {unreadCount} new
                    </Badge>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {notifications.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  {unreadCount > 0 && (
                      <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-6"
                          onClick={markAllAsRead}
                      >
                        <CheckCheck className="h-3 w-3 mr-1" />
                        Mark all read
                      </Button>
                  )}

                  <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-6"
                      onClick={clearAll}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear all
                  </Button>

                  {!isConnected && (
                      <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-6"
                          onClick={reconnect}
                      >
                        Reconnect
                      </Button>
                  )}
                </div>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No notifications yet
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    You'll see real-time updates here
                  </p>
                </div>
            ) : (
                <div>
                  {notifications.map((notification) => (
                      <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onMarkAsRead={markAsRead}
                          onRemove={removeNotification}
                          onClick={handleNotificationClick}
                      />
                  ))}
                </div>
            )}
          </div>

          {/* Connection Issues Warning */}
          {!isConnected && notifications.length > 0 && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-400">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-xs">
                Real-time updates are currently unavailable
              </span>
                </div>
              </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
  );
}
