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
import Link from "next/link";
import {
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Bell,
  TrendingUp,
  UserPlus,
  Megaphone,
  Heart,
  Youtube,
  Settings,
  ArrowRight,
  Activity,
  Crown,
  Shield,
  BarChart3,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface AdminStats {
  users: {
    total: number;
    active: number;
    members: number;
    admins: number;
  };
  events: {
    total: number;
    upcoming: number;
  };
  prayerRequests: {
    total: number;
    pending: number;
    active: number;
  };
  membershipRequests: {
    pending: number;
  };
  blog: {
    total: number;
    published: number;
  };
  announcements: {
    total: number;
    active: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    user?: string;
  }>;
}

// Helper function to check if user has admin privileges (admin or super_admin)
const isAdminUser = (role: string | undefined | null) => {
  return role === "admin" || role === "super_admin";
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const isSuperAdmin = session?.user?.role === "super_admin";

  // Fetch admin stats
  useEffect(() => {
    if (session?.user?.id && isAdminUser(session.user.role)) {
      setLoading(true);
      fetch("/api/admin/stats")
        .then((res) => res.json())
        .then((data) => {
          setStats(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching admin stats:", error);
          setLoading(false);
        });
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  // Check for both admin and super_admin roles
  if (!session || !isAdminUser(session.user.role)) {
    redirect("/members/dashboard");
  }

  // Quick action cards for admin
  const quickActions = [
    {
      title: "Users",
      description: "Manage members",
      icon: Users,
      href: "/admin/users",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30",
      borderColor: "border-blue-200 dark:border-blue-800",
      textColor: "text-blue-600 dark:text-blue-400",
      stat: stats?.users?.total,
      statLabel: "total users",
    },
    {
      title: "Blog",
      description: "Manage posts",
      icon: FileText,
      href: "/admin/blog",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30",
      borderColor: "border-purple-200 dark:border-purple-800",
      textColor: "text-purple-600 dark:text-purple-400",
      stat: stats?.blog?.total,
      statLabel: "posts",
    },
    {
      title: "Events",
      description: "Manage events",
      icon: Calendar,
      href: "/admin/events",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30",
      borderColor: "border-green-200 dark:border-green-800",
      textColor: "text-green-600 dark:text-green-400",
      stat: stats?.events?.total,
      statLabel: "events",
    },
    {
      title: "Announcements",
      description: "Manage posts",
      icon: Megaphone,
      href: "/admin/announcements",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30",
      borderColor: "border-orange-200 dark:border-orange-800",
      textColor: "text-orange-600 dark:text-orange-400",
      stat: stats?.announcements?.total,
      statLabel: "announcements",
    },
    {
      title: "Membership Requests",
      description: "Review applications",
      icon: UserPlus,
      href: "/admin/membership-requests",
      color: "from-pink-500 to-pink-600",
      bgColor: "from-pink-50 to-pink-100 dark:from-pink-950/30 dark:to-pink-900/30",
      borderColor: "border-pink-200 dark:border-pink-800",
      textColor: "text-pink-600 dark:text-pink-400",
      stat: stats?.membershipRequests?.pending,
      statLabel: "pending",
      showBadge: (stats?.membershipRequests?.pending ?? 0) > 0,
    },
    {
      title: "Prayers",
      description: "Prayer requests",
      icon: Heart,
      href: "/admin/prayer-requests",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/30",
      borderColor: "border-indigo-200 dark:border-indigo-800",
      textColor: "text-indigo-600 dark:text-indigo-400",
      stat: stats?.prayerRequests?.total,
      statLabel: "requests",
    },
    {
      title: "YouTube",
      description: "Video content",
      icon: Youtube,
      href: "/admin/youtube",
      color: "from-red-500 to-red-600",
      bgColor: "from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30",
      borderColor: "border-red-200 dark:border-red-800",
      textColor: "text-red-600 dark:text-red-400",
      stat: null,
      statLabel: "Manage",
    },
    {
      title: "Settings",
      description: "Admin settings",
      icon: Settings,
      href: "/admin/profile",
      color: "from-gray-500 to-gray-600",
      bgColor: "from-gray-50 to-gray-100 dark:from-gray-950/30 dark:to-gray-900/30",
      borderColor: "border-gray-200 dark:border-gray-800",
      textColor: "text-gray-600 dark:text-gray-400",
      stat: null,
      statLabel: "Config",
    },
  ];

  return (
    <AdminLayout>
      <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Welcome Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-3xl blur-3xl" />
          <Card className="relative backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border border-primary/10 shadow-xl">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-lg ${
                      isSuperAdmin
                        ? "bg-gradient-to-br from-amber-500 to-amber-600"
                        : "bg-gradient-to-br from-primary to-primary/80"
                    }`}>
                      {isSuperAdmin ? (
                        <Crown className="h-8 w-8 text-white" />
                      ) : (
                        <Shield className="h-8 w-8 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-2xl font-bold text-primary dark:text-white">
                        Welcome back, {session.user.name?.split(" ")[0] || "Admin"}
                      </h1>
                      <Badge
                        className={`px-3 py-1 gap-1 ${
                          isSuperAdmin
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0"
                            : "bg-primary/10 text-primary border border-primary/20"
                        }`}
                      >
                        {isSuperAdmin ? (
                          <>
                            <Crown className="h-3 w-3" />
                            Super Admin
                          </>
                        ) : (
                          <>
                            <Shield className="h-3 w-3" />
                            Administrator
                          </>
                        )}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      {isSuperAdmin
                        ? "Super Admin - Complete system control"
                        : "Full administrative access to the church management system"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  <Link href="/admin/profile">
                    <Button variant="outline" className="gap-2">
                      <Settings className="h-4 w-4" />
                      Profile Settings
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.users?.total || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats?.users?.active || 0} active
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.events?.upcoming || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats?.events?.total || 0} total events
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prayer Requests</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.prayerRequests?.active || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats?.prayerRequests?.pending || 0} pending review
              </p>
            </CardContent>
          </Card>

          <Card className={`${(stats?.membershipRequests?.pending ?? 0) > 0 ? "border-pink-500/50 bg-pink-50/30 dark:bg-pink-950/20" : "border-primary/10"}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Membership Requests</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.membershipRequests?.pending || 0}
                </span>
                {!loading && (stats?.membershipRequests?.pending ?? 0) > 0 && (
                  <Badge variant="destructive" className="text-xs">Pending</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting approval
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Management Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-primary dark:text-white">Admin Management</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href}>
                  <Card className={`group hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-gradient-to-br ${action.bgColor} border ${action.borderColor} hover:scale-105 cursor-pointer h-full`}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-white shadow-lg relative`}>
                          <Icon className="h-6 w-6" />
                          {action.showBadge && (
                            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white border-2 border-white dark:border-gray-900 text-xs">
                              {action.stat}
                            </Badge>
                          )}
                        </div>
                        <div>
                          <h3 className="text-base font-medium text-gray-900 dark:text-white">{action.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className={`text-2xl font-bold ${action.textColor}`}>
                          {loading ? "..." : action.stat ?? action.statLabel}
                        </span>
                        <ArrowRight className={`h-4 w-4 text-gray-400 group-hover:${action.textColor} transition-colors`} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Super Admin Panel Link - Only for super_admin */}
        {isSuperAdmin && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Crown className="h-5 w-5 text-amber-500" />
              <h2 className="text-xl font-bold text-amber-600 dark:text-amber-400">Super Admin Controls</h2>
            </div>
            <Link href="/admin/super-admin">
              <Card className="group hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30 border border-amber-300 dark:border-amber-700 hover:scale-[1.02] cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Crown className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-amber-800 dark:text-amber-300">Super Admin Panel</h3>
                        <p className="text-sm text-amber-600 dark:text-amber-400">
                          Password management & advanced user administration
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-6 w-6 text-amber-500 group-hover:translate-x-2 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        )}

        {/* Quick Links */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Quick Links
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/users">
                <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
                  <Users className="h-4 w-4" />
                  <span>Manage Users</span>
                </Button>
              </Link>
              <Link href="/admin/blog">
                <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
                  <FileText className="h-4 w-4" />
                  <span>Create Blog Post</span>
                </Button>
              </Link>
              <Link href="/admin/events">
                <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
                  <Calendar className="h-4 w-4" />
                  <span>Create Event</span>
                </Button>
              </Link>
              <Link href="/admin/announcements">
                <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
                  <Megaphone className="h-4 w-4" />
                  <span>New Announcement</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
