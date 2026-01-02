"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/admin-layout";
import { useRealTimeNotifications } from "@/hooks/useRealTimeNotifications";
import { BrowserNotificationToggle } from "@/components/ui/browser-notification-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Users,
  Shield,
  Mail,
  UserCheck,
  Send,
  Plus,
  Search,
  Activity,
  FileText,
  Music,
  ArrowRight,
  Eye,
  TrendingUp,
  Zap,
  ChevronRight,
} from "lucide-react";
import { formatDistanceToNow, format, subDays, isToday, isYesterday } from "date-fns";
import type { Notification, NotificationPriority } from "@/lib/notification";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Types for pending items
interface PendingItem {
  id: string;
  type: "membership" | "prayer" | "event_registration";
  title: string;
  description: string;
  createdAt: string;
  actionUrl: string;
  priority: "low" | "normal" | "high" | "urgent";
  metadata?: Record<string, unknown>;
}

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  actionUrl?: string;
}

export default function AdminNotificationsPage() {
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
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Pending items state
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [isLoadingPending, setIsLoadingPending] = useState(true);

  // Activity log state
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);

  // Notification preferences state
  const [preferences, setPreferences] = useState({
    prayerRequests: true,
    membershipRequests: true,
    newRegistrations: true,
    systemAlerts: true,
    eventRegistrations: true,
    emailNotifications: false,
  });

  // New notification form state
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "announcement" as "announcement" | "event" | "prayer_request" | "system" | "admin",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    targetAudience: "all" as "all" | "members" | "admin",
  });

  // Fetch pending items (membership requests, prayer requests)
  const fetchPendingItems = useCallback(async () => {
    if (!session?.user) return;

    setIsLoadingPending(true);
    try {
      // Fetch pending membership requests
      const membershipRes = await fetch("/api/members/register");
      const membershipData = membershipRes.ok ? await membershipRes.json() : { requests: [] };

      // Fetch pending prayer requests
      const prayerRes = await fetch("/api/prayer-requests?status=pending");
      const prayerData = prayerRes.ok ? await prayerRes.json() : { requests: [] };

      const items: PendingItem[] = [];

      // Add pending membership requests
      if (membershipData.requests) {
        for (const req of membershipData.requests.filter((r: { status: string }) => r.status === "pending")) {
          items.push({
            id: req.id,
            type: "membership",
            title: `Membership Request: ${req.firstName} ${req.lastName}`,
            description: `${req.email} - Submitted membership application`,
            createdAt: req.createdAt,
            actionUrl: "/admin/membership-requests",
            priority: "high",
            metadata: { email: req.email },
          });
        }
      }

      // Add pending prayer requests
      if (prayerData.requests) {
        for (const req of prayerData.requests.filter((r: { status: string }) => r.status === "pending")) {
          items.push({
            id: req.id,
            type: "prayer",
            title: `Prayer Request: ${req.title}`,
            description: `By ${req.requestedBy} - ${req.category}`,
            createdAt: req.createdAt,
            actionUrl: "/admin/prayer-requests",
            priority: req.priority === "urgent" ? "urgent" : "normal",
            metadata: { category: req.category },
          });
        }
      }

      // Sort by creation date (newest first)
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setPendingItems(items);
    } catch (error) {
      console.error("Error fetching pending items:", error);
    } finally {
      setIsLoadingPending(false);
    }
  }, [session]);

  // Fetch recent activity
  const fetchRecentActivity = useCallback(async () => {
    if (!session?.user) return;

    setIsLoadingActivity(true);
    try {
      const res = await fetch("/api/admin/recent-activity");
      if (res.ok) {
        const data = await res.json();
        setRecentActivity(data.activities || []);
      }
    } catch (error) {
      console.error("Error fetching activity:", error);
    } finally {
      setIsLoadingActivity(false);
    }
  }, [session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/members/login");
    }
    if (status === "authenticated" && session?.user?.role !== "admin" && session?.user?.role !== "super_admin") {
      redirect("/members/dashboard");
    }
  }, [status, session]);

  useEffect(() => {
    if (session?.user && (session.user.role === "admin" || session.user.role === "super_admin")) {
      fetchPendingItems();
      fetchRecentActivity();
    }
  }, [session, fetchPendingItems, fetchRecentActivity]);

  if (status === "loading") {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!session || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    return null;
  }

  // Filter notifications based on search and filters
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread" && notification.read) return false;
    if (filter === "read" && !notification.read) return false;
    if (typeFilter !== "all" && notification.type !== typeFilter) return false;
    if (priorityFilter !== "all" && notification.priority !== priorityFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !notification.title.toLowerCase().includes(query) &&
        !notification.message.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    return true;
  });

  const adminNotifications = notifications.filter(
    (n) => n.targetAudience === "admin" || n.type === "admin"
  );

  const groupNotificationsByDate = (notifs: Notification[]) => {
    const groups: { [key: string]: Notification[] } = {};

    for (const notification of notifs) {
      const notificationDate = new Date(notification.createdAt);

      let groupKey: string;
      if (isToday(notificationDate)) {
        groupKey = "Today";
      } else if (isYesterday(notificationDate)) {
        groupKey = "Yesterday";
      } else {
        groupKey = format(notificationDate, "EEEE, MMM d");
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(notification);
    }
    return groups;
  };

  const groupedNotifications = groupNotificationsByDate(filteredNotifications);

  const getPriorityColor = (priority: NotificationPriority | string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200";
      case "medium":
      case "normal":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200";
      case "low":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "prayer_request":
      case "prayer":
        return <MessageSquare className="h-5 w-5" />;
      case "announcement":
        return <Megaphone className="h-5 w-5" />;
      case "event":
      case "event_registration":
        return <Calendar className="h-5 w-5" />;
      case "admin":
        return <Shield className="h-5 w-5" />;
      case "system":
        return <AlertTriangle className="h-5 w-5" />;
      case "membership":
        return <UserCheck className="h-5 w-5" />;
      case "blog":
        return <FileText className="h-5 w-5" />;
      case "sermon":
        return <Music className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "prayer_request":
      case "prayer":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400";
      case "announcement":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
      case "event":
      case "event_registration":
        return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400";
      case "admin":
        return "bg-slate-100 text-slate-600 dark:bg-slate-900/20 dark:text-slate-400";
      case "system":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "membership":
        return "bg-teal-100 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400";
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

  const handleSendNotification = async () => {
    if (!newNotification.title.trim() || !newNotification.message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNotification),
      });

      if (response.ok) {
        toast.success("Notification sent successfully!");
        setIsCreateDialogOpen(false);
        setNewNotification({
          title: "",
          message: "",
          type: "announcement",
          priority: "medium",
          targetAudience: "all",
        });
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to send notification");
      }
    } catch (error) {
      toast.error("Failed to send notification");
    } finally {
      setIsSending(false);
    }
  };

  // Statistics calculations
  const stats = {
    total: notifications.length,
    unread: unreadCount,
    urgent: notifications.filter((n) => n.priority === "urgent" || n.priority === "high").length,
    prayers: notifications.filter((n) => n.type === "prayer_request").length,
    admin: adminNotifications.length,
    todayCount: notifications.filter((n) => isToday(new Date(n.createdAt))).length,
    pendingActions: pendingItems.length,
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-church-primary/10 rounded-xl">
                <Bell className="h-8 w-8 text-church-primary" />
              </div>
              Notifications Center
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage notifications, monitor activity, and stay informed
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
                isConnected
                  ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
              )}
            >
              {isConnected ? (
                <>
                  <Wifi className="h-4 w-4" />
                  <span>Live Updates</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4" />
                  <span>Disconnected</span>
                </>
              )}
            </div>
            {!isConnected && (
              <Button variant="outline" size="sm" onClick={reconnect}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reconnect
              </Button>
            )}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-church-primary hover:bg-church-primary/90">
                  <Plus className="h-4 w-4" />
                  Send Notification
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-church-primary" />
                    Send New Notification
                  </DialogTitle>
                  <DialogDescription>
                    Create and send a notification to members or admins
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Notification title"
                      value={newNotification.title}
                      onChange={(e) =>
                        setNewNotification({ ...newNotification, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Notification message..."
                      rows={3}
                      value={newNotification.message}
                      onChange={(e) =>
                        setNewNotification({ ...newNotification, message: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Type</Label>
                      <Select
                        value={newNotification.type}
                        onValueChange={(value) =>
                          setNewNotification({
                            ...newNotification,
                            type: value as typeof newNotification.type,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="announcement">Announcement</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                          <SelectItem value="admin">Admin Alert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Priority</Label>
                      <Select
                        value={newNotification.priority}
                        onValueChange={(value) =>
                          setNewNotification({
                            ...newNotification,
                            priority: value as typeof newNotification.priority,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Target Audience</Label>
                    <Select
                      value={newNotification.targetAudience}
                      onValueChange={(value) =>
                        setNewNotification({
                          ...newNotification,
                          targetAudience: value as typeof newNotification.targetAudience,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Everyone</SelectItem>
                        <SelectItem value="members">Members Only</SelectItem>
                        <SelectItem value="admin">Admins Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    disabled={isSending}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSendNotification} disabled={isSending} className="bg-church-primary hover:bg-church-primary/90">
                    {isSending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Notification
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <TabsTrigger value="overview" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">All</span>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900 border-blue-100">
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Bell className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
                      <p className="text-xs text-blue-600/70">Total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-900 border-orange-100">
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <BellOff className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.unread}</p>
                      <p className="text-xs text-orange-600/70">Unread</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-gray-900 border-red-100">
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.urgent}</p>
                      <p className="text-xs text-red-600/70">Urgent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-900 border-purple-100">
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.prayers}</p>
                      <p className="text-xs text-purple-600/70">Prayers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/20 dark:to-gray-900 border-slate-100">
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-900/30 rounded-lg">
                      <Shield className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.admin}</p>
                      <p className="text-xs text-slate-600/70">Admin</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-900 border-green-100">
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.todayCount}</p>
                      <p className="text-xs text-green-600/70">Today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-gray-900 border-amber-100">
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                      <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{stats.pendingActions}</p>
                      <p className="text-xs text-amber-600/70">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pending Actions Section */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Clock className="h-5 w-5 text-amber-500" />
                      Pending Actions
                    </CardTitle>
                    <CardDescription>Items requiring your attention</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => fetchPendingItems()}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingPending ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : pendingItems.length === 0 ? (
                  <div className="py-8 text-center">
                    <Check className="h-12 w-12 mx-auto text-green-500 mb-3" />
                    <p className="text-gray-500">No pending items. You're all caught up!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingItems.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn("p-2 rounded-lg", getTypeColor(item.type))}>
                            {getTypeIcon(item.type)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{item.title}</h4>
                            <p className="text-sm text-gray-500">{item.description}</p>
                            <span className="text-xs text-gray-400">
                              {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
                          <Link href={item.actionUrl}>
                            <Button size="sm" variant="outline" className="gap-2">
                              Review
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                    {pendingItems.length > 5 && (
                      <div className="text-center pt-2">
                        <Button variant="ghost" size="sm" className="text-church-primary">
                          View all {pendingItems.length} pending items
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/admin/membership-requests">
                <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-teal-500">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                          <UserCheck className="h-5 w-5 text-teal-600" />
                        </div>
                        <div>
                          <p className="font-medium">Membership Requests</p>
                          <p className="text-sm text-gray-500">Review applications</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/admin/prayer-requests">
                <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <MessageSquare className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Prayer Requests</p>
                          <p className="text-sm text-gray-500">Manage prayers</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/admin/announcements">
                <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Megaphone className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Announcements</p>
                          <p className="text-sm text-gray-500">Post updates</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/admin/events">
                <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-green-500">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <Calendar className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Events</p>
                          <p className="text-sm text-gray-500">Manage events</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Recent Notifications Preview */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Bell className="h-5 w-5 text-church-primary" />
                    Recent Notifications
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("notifications")}>
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <div className="py-8 text-center">
                    <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">No notifications yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.slice(0, 3).map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                          !notification.read
                            ? "bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800"
                        )}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className={cn("p-2 rounded-lg flex-shrink-0", getTypeColor(notification.type))}>
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-church-primary rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <Badge className={cn("flex-shrink-0", getPriorityColor(notification.priority))}>
                          {notification.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="py-4">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <div className="relative w-full lg:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search notifications..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <Select value={filter} onValueChange={setFilter}>
                      <SelectTrigger className="w-[130px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="unread">Unread</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="announcement">Announcements</SelectItem>
                        <SelectItem value="event">Events</SelectItem>
                        <SelectItem value="prayer_request">Prayer Requests</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    {unreadCount > 0 && (
                      <Button variant="outline" size="sm" onClick={markAllAsRead}>
                        <CheckCheck className="h-4 w-4 mr-2" />
                        Mark all read
                      </Button>
                    )}
                    {notifications.length > 0 && (
                      <Button variant="outline" size="sm" onClick={clearAll} className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear all
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications List */}
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <Bell className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No notifications found</h3>
                  <p className="text-gray-500">
                    {filter !== "all" || typeFilter !== "all" || priorityFilter !== "all" || searchQuery
                      ? "Try adjusting your filters or search query"
                      : "You're all caught up!"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
                  <div key={date}>
                    <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2 sticky top-0 bg-gray-50 dark:bg-gray-900 py-2 z-10">
                      <Clock className="h-4 w-4" />
                      {date}
                      <span className="text-xs text-gray-400">({dateNotifications.length})</span>
                    </h3>
                    <div className="space-y-3">
                      {dateNotifications.map((notification) => (
                        <Card
                          key={notification.id}
                          className={cn(
                            "cursor-pointer transition-all hover:shadow-md",
                            !notification.read && "border-l-4 border-l-church-primary bg-church-primary/5"
                          )}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <CardContent className="py-4">
                            <div className="flex items-start gap-4">
                              <div className={cn("p-2 rounded-lg flex-shrink-0", getTypeColor(notification.type))}>
                                {getTypeIcon(notification.type)}
                              </div>
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
                                        <div className="w-2 h-2 bg-church-primary rounded-full" />
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                      {notification.message}
                                    </p>
                                  </div>
                                  <Badge className={getPriorityColor(notification.priority)}>
                                    {notification.priority}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {formatDistanceToNow(new Date(notification.createdAt), {
                                        addSuffix: true,
                                      })}
                                    </span>
                                    <Badge variant="outline" className="text-xs">
                                      {notification.targetAudience}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {notification.actionUrl && (
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 text-xs"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          window.location.href = notification.actionUrl!;
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
                ))}
              </div>
            )}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-church-primary" />
                      Recent Activity Log
                    </CardTitle>
                    <CardDescription>Track all activities across your church platform</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => fetchRecentActivity()}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingActivity ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : recentActivity.length === 0 ? (
                  <div className="py-12 text-center">
                    <Activity className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No recent activity</h3>
                    <p className="text-gray-500">Activity logs will appear here as members interact with the platform</p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                    <div className="space-y-6">
                      {recentActivity.map((activity, index) => (
                        <div key={activity.id} className="relative flex gap-4 pl-8">
                          <div className="absolute left-0 p-2 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
                            {getTypeIcon(activity.type)}
                          </div>
                          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border p-4">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">{activity.title}</h4>
                                <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                                {activity.user && (
                                  <p className="text-xs text-gray-400 mt-2">By: {activity.user}</p>
                                )}
                              </div>
                              <span className="text-xs text-gray-400 whitespace-nowrap">
                                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                              </span>
                            </div>
                            {activity.actionUrl && (
                              <Link href={activity.actionUrl}>
                                <Button variant="ghost" size="sm" className="mt-2 text-church-primary">
                                  View Details
                                  <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Browser Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-church-primary" />
                    Browser Notifications
                  </CardTitle>
                  <CardDescription>
                    Enable browser notifications to receive alerts even when you're not on the page
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BrowserNotificationToggle />
                </CardContent>
              </Card>

              {/* Admin Alert Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-church-primary" />
                    Admin Alert Preferences
                  </CardTitle>
                  <CardDescription>Configure which notifications you receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <MessageSquare className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">New Prayer Requests</p>
                        <p className="text-xs text-gray-500">Get notified when members submit prayers</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.prayerRequests}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, prayerRequests: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-teal-100 rounded-lg">
                        <UserCheck className="h-4 w-4 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Membership Requests</p>
                        <p className="text-xs text-gray-500">Alert when new applications arrive</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.membershipRequests}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, membershipRequests: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">New User Registrations</p>
                        <p className="text-xs text-gray-500">Be informed when users sign up</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.newRegistrations}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, newRegistrations: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Event Registrations</p>
                        <p className="text-xs text-gray-500">Notify when members register for events</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.eventRegistrations}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, eventRegistrations: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">System Alerts</p>
                        <p className="text-xs text-gray-500">Critical system notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.systemAlerts}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, systemAlerts: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Mail className="h-4 w-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Email Notifications</p>
                        <p className="text-xs text-gray-500">Receive email copies of alerts</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Connection Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-church-primary" />
                  Connection Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "p-3 rounded-full",
                        isConnected ? "bg-green-100" : "bg-red-100"
                      )}
                    >
                      {isConnected ? (
                        <Wifi className="h-6 w-6 text-green-600" />
                      ) : (
                        <WifiOff className="h-6 w-6 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {isConnected ? "Connected to Live Updates" : "Disconnected"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {isConnected
                          ? `Last activity: ${lastActivity ? formatDistanceToNow(lastActivity, { addSuffix: true }) : "Just now"}`
                          : "Click reconnect to restore live updates"}
                      </p>
                    </div>
                  </div>
                  {!isConnected && (
                    <Button onClick={reconnect}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reconnect
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

