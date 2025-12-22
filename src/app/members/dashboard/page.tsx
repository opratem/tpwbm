"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import {
  Bell,
  Book,
  Bookmark,
  Calendar,
  FileText,
  Settings,
  Users,
  UserCheck,
  Shield,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Activity,
  CheckCircle,
  MessageCircle,
  Heart,
  Play,
  Music,
  BarChart,
  UserPlus,
  Megaphone,
  Image as ImageIcon,
  Youtube
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Announcements from "@/components/ui/announcements";
import Events from "@/components/ui/events";
import PrayerRequestsDashboard from "@/components/ui/prayer-requests-dashboard";

interface DashboardStats {
  eventsCount: number;
  upcomingEventsCount: number;
  prayerRequestsCount: number;
  groupsCount: number;
  resourcesCount: number;
  upcomingEvents: any[];
}

interface AdminStats {
  users: {
    total: number;
    active: number;
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
  recentActivity: any[];
}

export default function MemberDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [adminStatsLoading, setAdminStatsLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(true);

  const isAdmin = session?.user?.role === 'admin';

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/members/login");
    }
  }, [status]);

  // Fetch dashboard stats
  useEffect(() => {
    if (session?.user?.id) {
      setStatsLoading(true);
      fetch('/api/members/dashboard-stats')
        .then(res => res.json())
        .then(data => {
          setStats(data);
          setStatsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching dashboard stats:', error);
          setStatsLoading(false);
        });
    }
  }, [session]);

  // Fetch admin stats if user is admin
  useEffect(() => {
    if (session?.user?.id && isAdmin) {
      setAdminStatsLoading(true);
      fetch('/api/admin/stats')
        .then(res => res.json())
        .then(data => {
          setAdminStats(data);
          setAdminStatsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching admin stats:', error);
          setAdminStatsLoading(false);
        });
    }
  }, [session, isAdmin]);

  // Fetch user bookmarks
  useEffect(() => {
    if (session?.user?.id) {
      setBookmarksLoading(true);
      fetch('/api/bookmarks')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setBookmarks(data.bookmarks);
          }
          setBookmarksLoading(false);
        })
        .catch(error => {
          console.error('Error fetching bookmarks:', error);
          setBookmarksLoading(false);
        });
    }
  }, [session]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-church-text-muted dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Check for authentication
  if (!session) {
    return null; // Will redirect in useEffect
  }

  // Helper function to get role color
  const getRoleVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'member': return 'secondary';
      default: return 'outline';
    }
  };

  // Helper function to format ministry role
  const formatMinistryRole = (role: string | null | undefined) => {
    if (!role) return '';
    return role.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Breadcrumbs */}
      <Breadcrumbs />

      <div className="container py-8 space-y-8">
        {/* Modern Header */}
        <div className="relative">
          {/* Decorative background with church colors */}
          <div className="absolute inset-0 bg-gradient-to-r from-church-primary/10 via-church-accent/10 to-church-primary/5 rounded-3xl blur-3xl" />

          <Card className="relative backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border border-church-primary/10 shadow-xl">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-16 w-16 ring-4 ring-church-accent/30 shadow-lg">
                      <div className="w-full h-full bg-gradient-to-br from-church-primary to-church-primary-light flex items-center justify-center text-xl font-bold text-white">
                        {session.user.name?.charAt(0) || session.user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-church-accent border-2 border-white dark:border-gray-900 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-2xl font-bold text-church-primary dark:text-white">
                        Welcome back, {session.user.name ? session.user.name.split(' ')[0] : 'Member'}
                      </h1>
                      <Badge
                        variant={getRoleVariant(session.user.role)}
                        className="px-3 py-1 gap-1"
                      >
                        {session.user.role === 'admin' ? <Shield className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                        {session.user.role === 'admin' ? 'Administrator' : 'Member'}
                      </Badge>
                      {session.user.ministryRole && (
                        <Badge variant="outline" className="px-3 py-1 gap-1 border-church-accent text-church-accent">
                          <Calendar className="h-3 w-3" />
                          {formatMinistryRole(session.user.ministryRole)}
                        </Badge>
                      )}
                    </div>
                    <p className="text-church-text-muted dark:text-gray-400 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-church-accent" />
                      {session.user.role === 'admin' ? 'Full system access' : 'Welcome to your member dashboard'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link href="/members/profile">
                    <Button variant="outline" className="gap-2 border-church-accent text-church-accent hover:bg-church-accent hover:text-white">
                      <UserCheck className="h-4 w-4" />
                      Profile Settings
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon" className="relative border-church-primary text-church-primary">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-church-accent rounded-full animate-pulse" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border border-church-primary/10 hover:scale-105 hover:border-church-primary/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-church-primary to-church-primary-light rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-church-primary dark:text-white">Events</h3>
                  <p className="text-sm text-church-text-muted dark:text-gray-400">Upcoming church events</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-2xl font-bold text-church-primary dark:text-white">
                  {statsLoading ? '...' : stats?.upcomingEventsCount || 0}
                </span>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-church-accent transition-colors" />
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border border-church-accent/10 hover:scale-105 hover:border-church-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-church-accent to-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-church-primary dark:text-white">Prayer</h3>
                  <p className="text-sm text-church-text-muted dark:text-gray-400">Prayer requests</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-2xl font-bold text-church-accent">
                  {statsLoading ? '...' : stats?.prayerRequestsCount || 0}
                </span>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-church-accent transition-colors" />
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border border-church-primary/10 hover:scale-105 hover:border-church-primary/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-church-primary-light to-church-primary rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-church-primary dark:text-white">Groups</h3>
                  <p className="text-sm text-church-text-muted dark:text-gray-400">Small groups</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-2xl font-bold text-church-primary dark:text-white">
                  {statsLoading ? '...' : stats?.groupsCount || 0}
                </span>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-church-accent transition-colors" />
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border border-church-accent/10 hover:scale-105 hover:border-church-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-church-accent rounded-xl flex items-center justify-center text-white shadow-lg">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-church-primary dark:text-white">Resources</h3>
                  <p className="text-sm text-church-text-muted dark:text-gray-400">Study materials</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-2xl font-bold text-church-accent">
                  {statsLoading ? '...' : stats?.resourcesCount || 0}
                </span>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-church-accent transition-colors" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Quick Actions - Only visible to admins */}
        {isAdmin && (
          <>
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-church-primary" />
                <h2 className="text-xl font-bold text-church-primary dark:text-white">Admin Management</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/admin/users">
                  <Card className="group hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border border-blue-200 dark:border-blue-800 hover:scale-105 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                          <Users className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-base font-medium text-gray-900 dark:text-white">Users</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Manage members</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {adminStatsLoading ? '...' : adminStats?.users?.total || 0}
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/admin/blog">
                  <Card className="group hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border border-purple-200 dark:border-purple-800 hover:scale-105 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-base font-medium text-gray-900 dark:text-white">Blog</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Manage posts</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {adminStatsLoading ? '...' : '...'}
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/admin/events">
                  <Card className="group hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border border-green-200 dark:border-green-800 hover:scale-105 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                          <Calendar className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-base font-medium text-gray-900 dark:text-white">Events</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Manage events</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {adminStatsLoading ? '...' : adminStats?.events?.total || 0}
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/admin/announcements">
                  <Card className="group hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 border border-orange-200 dark:border-orange-800 hover:scale-105 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                          <Megaphone className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-base font-medium text-gray-900 dark:text-white">Announcements</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Manage posts</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {adminStatsLoading ? '...' : '...'}
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-orange-600 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/admin/membership-requests">
                  <Card className="group hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/30 dark:to-pink-900/30 border border-pink-200 dark:border-pink-800 hover:scale-105 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center text-white shadow-lg relative">
                          <UserPlus className="h-6 w-6" />
                          {!adminStatsLoading && (adminStats?.membershipRequests?.pending ?? 0) > 0 && (
                            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-red-500 text-white border-2 border-white dark:border-gray-900 text-xs">
                              {adminStats?.membershipRequests?.pending}
                            </Badge>
                          )}
                        </div>
                        <div>
                          <h3 className="text-base font-medium text-gray-900 dark:text-white">Membership Requests</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Review applications</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                            {adminStatsLoading ? '...' : adminStats?.membershipRequests?.pending || 0}
                          </span>
                          {!adminStatsLoading && (adminStats?.membershipRequests?.pending ?? 0) > 0 && (
                            <Badge variant="destructive" className="text-xs">Pending</Badge>
                          )}
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-pink-600 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/admin/prayer-requests">
                  <Card className="group hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/30 border border-indigo-200 dark:border-indigo-800 hover:scale-105 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                          <Heart className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-base font-medium text-gray-900 dark:text-white">Prayers</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Prayer requests</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          {adminStatsLoading ? '...' : adminStats?.prayerRequests?.total || 0}
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/admin/youtube">
                  <Card className="group hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30 border border-red-200 dark:border-red-800 hover:scale-105 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                          <Youtube className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-base font-medium text-gray-900 dark:text-white">YouTube</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Video content</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                          Manage
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-red-600 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/admin/profile">
                  <Card className="group hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950/30 dark:to-gray-900/30 border border-gray-200 dark:border-gray-800 hover:scale-105 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                          <Settings className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-base font-medium text-gray-900 dark:text-white">Settings</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Admin settings</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                          Config
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Events */}
          <Card className="lg:col-span-1 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border border-church-primary/10 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-church-primary" />
                  <CardTitle className="text-base text-church-primary dark:text-white">Upcoming Events</CardTitle>
                </div>
                {!statsLoading && stats && stats.upcomingEventsCount > 0 && (
                  <Badge variant="outline" className="text-xs border-church-accent text-church-accent">
                    {stats.upcomingEventsCount} upcoming
                  </Badge>
                )}
              </div>
              <CardDescription>View and register for events</CardDescription>
            </CardHeader>
            <CardContent>
              <Events
                limit={3}
                upcoming={true}
                showHeader={false}
                variant="compact"
                className="space-y-3"
              />
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full group text-church-primary hover:text-church-accent" asChild>
                <Link href="/events" className="flex items-center justify-center gap-2">
                  View All Events
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Small Groups */}
          <Card className="lg:col-span-1 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border border-church-primary/10 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-church-primary" />
                  <CardTitle className="text-base text-church-primary dark:text-white">My Groups</CardTitle>
                </div>
                {!statsLoading && stats && stats.groupsCount > 0 && (
                  <Badge variant="outline" className="text-xs border-church-accent text-church-accent">
                    {stats.groupsCount} active
                  </Badge>
                )}
              </div>
              <CardDescription>Your groups and studies</CardDescription>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-church-primary" />
                </div>
              ) : stats && stats.groupsCount > 0 ? (
                <div className="space-y-4">
                  {/* Groups will be displayed here when the feature is implemented */}
                  <p className="text-sm text-church-text-muted dark:text-gray-400">Groups feature coming soon...</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-church-text-muted dark:text-gray-400 mb-2">No groups yet</p>
                  <p className="text-xs text-church-text-muted dark:text-gray-500">Join a small group to connect with others</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full group text-church-primary hover:text-church-accent" asChild>
                <Link href="/ministries" className="flex items-center justify-center gap-2">
                  Browse Ministries
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Saved Resources */}
          <Card className="lg:col-span-1 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border border-church-accent/10 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-church-accent" />
                  <CardTitle className="text-base text-church-primary dark:text-white">Saved Resources</CardTitle>
                </div>
                {!bookmarksLoading && bookmarks.length > 0 && (
                  <Badge variant="outline" className="text-xs border-church-accent text-church-accent">
                    {bookmarks.length} saved
                  </Badge>
                )}
              </div>
              <CardDescription>Your saved sermons and messages</CardDescription>
            </CardHeader>
            <CardContent>
              {bookmarksLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-church-accent" />
                </div>
              ) : bookmarks.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {bookmarks.slice(0, 5).map((bookmark) => (
                    <div
                      key={bookmark.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-church-accent/30 hover:bg-church-accent/5 transition-all duration-200 cursor-pointer group"
                      onClick={() => {
                        if (bookmark.resourceUrl) {
                          window.open(bookmark.resourceUrl, '_blank');
                        } else if (bookmark.resourceType === 'sermon') {
                          window.location.href = '/sermons';
                        } else if (bookmark.resourceType === 'audio_message') {
                          window.location.href = '/audio-messages';
                        }
                      }}
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-church-accent to-amber-500 flex items-center justify-center text-white shadow-md flex-shrink-0">
                        {bookmark.resourceType === 'sermon' ? (
                          <Play className="h-5 w-5" />
                        ) : (
                          <Music className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-church-primary dark:text-white line-clamp-1 group-hover:text-church-accent transition-colors">
                          {bookmark.resourceTitle}
                        </p>
                        {bookmark.resourceMetadata?.speaker && (
                          <p className="text-xs text-church-text-muted dark:text-gray-400 line-clamp-1">
                            {bookmark.resourceMetadata.speaker}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs py-0 px-1.5">
                            {bookmark.resourceType === 'sermon' ? 'Sermon' : 'Audio'}
                          </Badge>
                          {bookmark.resourceMetadata?.date && (
                            <span className="text-xs text-church-text-muted">
                              {new Date(bookmark.resourceMetadata.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bookmark className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-church-text-muted dark:text-gray-400 mb-2">No saved resources</p>
                  <p className="text-xs text-church-text-muted dark:text-gray-500">Save sermons and audio messages for quick access</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full group text-church-primary hover:text-church-accent" asChild>
                <Link href="/sermons" className="flex items-center justify-center gap-2">
                  Browse Sermons
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Announcements & Prayer Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border border-church-primary/10 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-church-primary" />
                <CardTitle className="text-base text-church-primary dark:text-white">Recent Announcements</CardTitle>
              </div>
              <CardDescription>Important updates for our church family</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Announcements
                limit={3}
                showHeader={false}
                variant="compact"
                className="space-y-3"
              />
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full group border-church-primary text-church-primary hover:bg-church-primary hover:text-white" asChild>
                <Link href="/announcements" className="flex items-center justify-center gap-2">
                  View All Announcements
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border border-church-accent/10 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-church-accent" />
                <CardTitle className="text-base text-church-primary dark:text-white">Prayer Requests</CardTitle>
              </div>
              <CardDescription>Pray for our church members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <PrayerRequestsDashboard limit={3} />
            </CardContent>
            <CardFooter className="flex justify-between gap-3">
              <Button variant="outline" className="flex-1 border-church-primary text-church-primary hover:bg-church-primary hover:text-white" asChild>
                <Link href="/members/prayer">View All Requests</Link>
              </Button>
              <Button className="flex-1 bg-church-accent hover:bg-church-accent/90 text-white" asChild>
                <Link href="/members/prayer">Submit Request</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
