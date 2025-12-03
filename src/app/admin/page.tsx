"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  Heart,
  FileText,
  Megaphone,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Bell,
  CheckCircle,
  Clock,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

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
  blog: {
    total: number;
    published: number;
  };
  announcements: {
    total: number;
    active: number;
  };
  recentPendingRequests: Array<{
    id: string;
    title: string;
    requestedBy: string;
    category: string;
    createdAt: Date;
  }>;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/members/login");
    }
  }, [status]);

  useEffect(() => {
    if (session?.user?.role === "admin") {
      fetchStats();

      // Auto-refresh every 30 seconds to check for new pending requests
      const interval = setInterval(() => {
        fetchStats();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [session]);

  const fetchStats = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      }
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    fetchStats(true);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-amber-50/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-primary mx-auto mb-4" />
          <p className="text-church-text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== "admin") {
    redirect("/members/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/20">
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-church-primary">Admin Dashboard</h1>
            <p className="text-church-text-muted mt-2">
              Overview of your church management system
              {lastUpdated && (
                <span className="ml-2 text-xs">
                  • Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="gap-2 border-church-primary text-church-primary hover:bg-church-primary hover:text-white"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button variant="outline" className="gap-2 border-church-primary text-church-primary hover:bg-church-primary hover:text-white">
              <TrendingUp className="h-4 w-4" />
              View Analytics
            </Button>
          </div>
        </div>

        {/* Pending Prayer Requests Alert */}
        {stats && stats.prayerRequests.pending > 0 && (
          <Card className="border-church-accent bg-gradient-to-r from-amber-50/50 to-amber-100/30 border-2">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-church-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <Bell className="h-6 w-6 text-white animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-church-primary">New Prayer Requests Pending</h3>
                    <Badge className="bg-church-accent text-white">
                      {stats.prayerRequests.pending} Pending
                    </Badge>
                  </div>
                  <p className="text-church-text-muted mb-4">
                    {stats.prayerRequests.pending} prayer {stats.prayerRequests.pending === 1 ? 'request needs' : 'requests need'} your review and approval.
                  </p>
                  <Link href="/admin/prayer-requests">
                    <Button className="gap-2 bg-church-accent hover:bg-church-accent/90 text-white">
                      <Heart className="h-4 w-4" />
                      Review Prayer Requests
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Users Stats */}
          <Card className="hover:shadow-lg transition-all duration-300 border-church-primary/10 hover:border-church-primary/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-church-text-muted">Total Members</CardTitle>
              <Users className="h-4 w-4 text-church-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-church-primary">{stats?.users.total || 0}</div>
              <p className="text-xs text-church-text-muted mt-1">
                {stats?.users.active || 0} active members
              </p>
              <Link href="/admin/users">
                <Button variant="ghost" size="sm" className="mt-3 text-church-primary hover:text-church-accent">
                  Manage Users <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Events Stats */}
          <Card className="hover:shadow-lg transition-all duration-300 border-church-primary/10 hover:border-church-primary/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-church-text-muted">Events</CardTitle>
              <Calendar className="h-4 w-4 text-church-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-church-primary">{stats?.events.total || 0}</div>
              <p className="text-xs text-church-text-muted mt-1">
                {stats?.events.upcoming || 0} upcoming events
              </p>
              <Link href="/admin/events">
                <Button variant="ghost" size="sm" className="mt-3 text-church-primary hover:text-church-accent">
                  Manage Events <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Prayer Requests Stats */}
          <Card className="hover:shadow-lg transition-all duration-300 border-church-accent/20 hover:border-church-accent/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-church-text-muted">Prayer Requests</CardTitle>
              <Heart className="h-4 w-4 text-church-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-church-accent">{stats?.prayerRequests.total || 0}</div>
              <div className="flex gap-2 mt-2">
                {stats && stats.prayerRequests.pending > 0 && (
                  <Badge variant="outline" className="text-xs border-church-accent text-church-accent">
                    <Clock className="h-3 w-3 mr-1" />
                    {stats.prayerRequests.pending} pending
                  </Badge>
                )}
                {stats && stats.prayerRequests.active > 0 && (
                  <Badge variant="outline" className="text-xs border-green-500 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {stats.prayerRequests.active} active
                  </Badge>
                )}
              </div>
              <Link href="/admin/prayer-requests">
                <Button variant="ghost" size="sm" className="mt-3 text-church-accent hover:text-church-primary">
                  Manage Requests <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Blog Posts Stats */}
          <Card className="hover:shadow-lg transition-all duration-300 border-church-primary/10 hover:border-church-primary/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-church-text-muted">Blog Posts</CardTitle>
              <FileText className="h-4 w-4 text-church-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-church-primary">{stats?.blog.total || 0}</div>
              <p className="text-xs text-church-text-muted mt-1">
                {stats?.blog.published || 0} published
              </p>
              <Link href="/admin/blog">
                <Button variant="ghost" size="sm" className="mt-3 text-church-primary hover:text-church-accent">
                  Manage Blog <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Announcements Stats */}
          <Card className="hover:shadow-lg transition-all duration-300 border-church-primary/10 hover:border-church-primary/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-church-text-muted">Announcements</CardTitle>
              <Megaphone className="h-4 w-4 text-church-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-church-primary">{stats?.announcements.total || 0}</div>
              <p className="text-xs text-church-text-muted mt-1">
                {stats?.announcements.active || 0} active
              </p>
              <Link href="/admin/announcements">
                <Button variant="ghost" size="sm" className="mt-3 text-church-primary hover:text-church-accent">
                  Manage Announcements <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Pending Prayer Requests */}
        {stats && stats.recentPendingRequests && stats.recentPendingRequests.length > 0 && (
          <Card className="border-church-primary/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-church-primary">Recent Pending Prayer Requests</CardTitle>
                  <CardDescription>Latest prayer requests awaiting approval</CardDescription>
                </div>
                <Link href="/admin/prayer-requests">
                  <Button variant="outline" size="sm" className="border-church-accent text-church-accent hover:bg-church-accent hover:text-white">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentPendingRequests.slice(0, 5).map((request) => (
                  <div key={request.id} className="flex items-start gap-4 p-4 rounded-lg border border-church-primary/10 hover:bg-church-surface-hover transition-colors">
                    <div className="w-10 h-10 bg-church-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="h-5 w-5 text-church-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-church-primary truncate">{request.title}</h4>
                      <p className="text-xs text-church-text-muted mt-1">
                        By {request.requestedBy} • {request.category}
                      </p>
                      <p className="text-xs text-church-text-muted mt-1">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Link href="/admin/prayer-requests">
                      <Button size="sm" variant="ghost" className="text-church-accent hover:text-church-primary">
                        Review
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="border-church-primary/10">
          <CardHeader>
            <CardTitle className="text-church-primary">Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link href="/admin/users">
                <Button variant="outline" className="w-full gap-2 border-church-primary text-church-primary hover:bg-church-primary hover:text-white">
                  <Users className="h-4 w-4" />
                  Add User
                </Button>
              </Link>
              <Link href="/admin/events">
                <Button variant="outline" className="w-full gap-2 border-church-primary text-church-primary hover:bg-church-primary hover:text-white">
                  <Calendar className="h-4 w-4" />
                  Create Event
                </Button>
              </Link>
              <Link href="/admin/blog">
                <Button variant="outline" className="w-full gap-2 border-church-primary text-church-primary hover:bg-church-primary hover:text-white">
                  <FileText className="h-4 w-4" />
                  New Post
                </Button>
              </Link>
              <Link href="/admin/announcements">
                <Button variant="outline" className="w-full gap-2 border-church-primary text-church-primary hover:bg-church-primary hover:text-white">
                  <Megaphone className="h-4 w-4" />
                  Announce
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
