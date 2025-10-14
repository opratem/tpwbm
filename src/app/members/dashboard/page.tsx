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
import {
  Bell,
  Book,
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
  Heart
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Announcements from "@/components/ui/announcements";
import Events from "@/components/ui/events";
import PrayerRequestsDashboard from "@/components/ui/prayer-requests-dashboard";

export default function MemberDashboard() {
  const { data: session, status } = useSession();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/members/login");
    }
  }, [status]);

  // Redirect admin users to admin dashboard on first load (for OAuth logins)
  useEffect(() => {
    if (session?.user?.role === 'admin' && !sessionStorage.getItem('redirected')) {
      sessionStorage.setItem('redirected', 'true');
      window.location.href = '/admin/dashboard';
    }
  }, [session]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 dark:from-gray-900 dark:via-blue-900/10 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
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
  const formatMinistryRole = (role: string) => {
    return role?.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 dark:from-gray-900 dark:via-blue-900/10 dark:to-gray-900">
      <div className="container py-8 space-y-8">
        {/* Modern Header */}
        <div className="relative">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 rounded-3xl blur-3xl" />

          <Card className="relative backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-16 w-16 ring-4 ring-white/50 dark:ring-gray-700/50 shadow-lg">
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                        {session.user.name?.charAt(0)}
                      </div>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Welcome back, {session.user.name?.split(' ')[0]}
                      </h1>
                      <Badge
                        variant={getRoleVariant(session.user.role)}
                        className="px-3 py-1 gap-1"
                      >
                        {session.user.role === 'admin' ? <Shield className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                        {session.user.role === 'admin' ? 'Administrator' : 'Member'}
                      </Badge>
                      {session.user.ministryRole && (
                        <Badge variant="outline" className="px-3 py-1 gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatMinistryRole(session.user.ministryRole)}
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      {session.user.role === 'admin' ? 'Full system access' : 'Welcome to your member dashboard'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  {session.user.role === 'admin' && (
                    <Link href="/admin/dashboard">
                      <Button variant="outline" className="gap-2">
                        <Settings className="h-4 w-4" />
                        Admin Dashboard
                      </Button>
                    </Link>
                  )}
                  <Link href="/members/profile">
                    <Button variant="outline" className="gap-2">
                      <UserCheck className="h-4 w-4" />
                      Profile Settings
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">Events</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming church events</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">3</span>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">Prayer</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Prayer requests</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-2xl font-bold text-purple-600">5</span>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">Groups</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Small groups</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">2</span>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">Resources</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Study materials</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-2xl font-bold text-orange-600">12</span>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-orange-600 transition-colors" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Events */}
          <Card className="lg:col-span-1 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-base">Upcoming Events</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">3 upcoming</Badge>
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
              <Button variant="ghost" className="w-full group" asChild>
                <Link href="/events" className="flex items-center justify-center gap-2">
                  View All Events
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Small Groups */}
          <Card className="lg:col-span-1 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-base">My Groups</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">2 active</Badge>
              </div>
              <CardDescription>Your groups and studies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200/50 dark:border-green-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-green-900 dark:text-green-100">Men's Fellowship</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">Every Tuesday, 6:30 PM</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      Active
                    </Badge>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">Neighborhood Group</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">Second Friday, 7:00 PM</p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      Active
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full group" asChild>
                <Link href="/members/groups" className="flex items-center justify-center gap-2">
                  View All Groups
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Resources */}
          <Card className="lg:col-span-1 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-base">Resources</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">New content</Badge>
              </div>
              <CardDescription>Sermons and study materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Last Sunday's Sermon</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Walking in Faith</p>
                  <Badge variant="outline" className="mt-2 text-xs">New</Badge>
                </div>
                <div className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Bible Study Guide</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Book of Romans</p>
                </div>
                <div className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Prayer Guide</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Prayer Focus</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full group" asChild>
                <Link href="/members/resources" className="flex items-center justify-center gap-2">
                  View All Resources
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Announcements & Prayer Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-base">Recent Announcements</CardTitle>
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
              <Button variant="outline" className="w-full group" asChild>
                <Link href="/announcements" className="flex items-center justify-center gap-2">
                  View All Announcements
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                <CardTitle className="text-base">Prayer Requests</CardTitle>
              </div>
              <CardDescription>Pray for our church members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <PrayerRequestsDashboard limit={3} />
            </CardContent>
            <CardFooter className="flex justify-between gap-3">
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/members/prayer">View All Requests</Link>
              </Button>
              <Button className="flex-1" asChild>
                <Link href="/members/prayer">Submit Request</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
